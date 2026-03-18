package com.codeflow.editor.data.lsp

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.util.concurrent.atomic.AtomicInteger
import javax.inject.Inject
import javax.inject.Singleton

/**
 * LSP client that communicates with language servers via JSON-RPC 2.0 over stdio.
 * Supports the core LSP protocol features needed for a mobile code editor.
 */
@Singleton
class LspClient @Inject constructor() {

    private var process: Process? = null
    private var writer: OutputStreamWriter? = null
    private var reader: BufferedReader? = null
    private val requestId = AtomicInteger(0)
    private val pendingResponses = mutableMapOf<Int, (JSONObject) -> Unit>()

    private val _status = MutableStateFlow(LspServerStatus("", state = LspConnectionState.DISCONNECTED))
    val status: StateFlow<LspServerStatus> = _status.asStateFlow()

    private val _diagnostics = MutableStateFlow<Map<String, List<Diagnostic>>>(emptyMap())
    val diagnostics: StateFlow<Map<String, List<Diagnostic>>> = _diagnostics.asStateFlow()

    suspend fun start(config: LspServerConfig): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            _status.value = LspServerStatus(config.language, state = LspConnectionState.CONNECTING)

            val command = mutableListOf(config.command) + config.args
            val pb = ProcessBuilder(command)
                .redirectErrorStream(false)

            if (config.rootUri.isNotBlank()) {
                pb.directory(File(config.rootUri.removePrefix("file://")))
            }

            val proc = pb.start()
            process = proc
            writer = OutputStreamWriter(proc.outputStream, Charsets.UTF_8)
            reader = BufferedReader(InputStreamReader(proc.inputStream, Charsets.UTF_8))

            _status.value = LspServerStatus(config.language, state = LspConnectionState.INITIALIZING)

            // Send initialize request
            val initResult = sendRequest("initialize", JSONObject().apply {
                put("processId", android.os.Process.myPid())
                put("rootUri", config.rootUri)
                put("capabilities", buildClientCapabilities())
            })

            if (initResult.isSuccess) {
                val serverInfo = initResult.getOrNull()
                val serverName = serverInfo?.optJSONObject("serverInfo")?.optString("name") ?: "LSP Server"
                val caps = parseServerCapabilities(serverInfo?.optJSONObject("capabilities"))

                // Send initialized notification
                sendNotification("initialized", JSONObject())

                _status.value = LspServerStatus(
                    language = config.language,
                    serverName = serverName,
                    state = LspConnectionState.READY,
                    capabilities = caps
                )
                Result.success(Unit)
            } else {
                _status.value = LspServerStatus(config.language, state = LspConnectionState.ERROR, errorMessage = "Başlatma başarısız")
                Result.failure(Exception("LSP başlatma başarısız"))
            }
        } catch (e: Exception) {
            _status.value = LspServerStatus(config.language, state = LspConnectionState.ERROR, errorMessage = e.message)
            Result.failure(e)
        }
    }

    suspend fun stop() = withContext(Dispatchers.IO) {
        try {
            sendRequest("shutdown", null)
            sendNotification("exit", null)
        } catch (_: Exception) {}
        process?.destroyForcibly()
        process = null
        writer = null
        reader = null
        _status.value = LspServerStatus("", state = LspConnectionState.DISCONNECTED)
    }

    // --- Document Sync ---

    suspend fun didOpen(uri: String, languageId: String, version: Int, text: String) {
        sendNotification("textDocument/didOpen", JSONObject().apply {
            put("textDocument", JSONObject().apply {
                put("uri", uri)
                put("languageId", languageId)
                put("version", version)
                put("text", text)
            })
        })
    }

    suspend fun didChange(uri: String, version: Int, text: String) {
        sendNotification("textDocument/didChange", JSONObject().apply {
            put("textDocument", JSONObject().apply {
                put("uri", uri)
                put("version", version)
            })
            put("contentChanges", JSONArray().apply {
                put(JSONObject().put("text", text))
            })
        })
    }

    suspend fun didSave(uri: String, text: String?) {
        sendNotification("textDocument/didSave", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            text?.let { put("text", it) }
        })
    }

    suspend fun didClose(uri: String) {
        sendNotification("textDocument/didClose", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
        })
    }

    // --- Completion ---

    suspend fun completion(uri: String, position: LspPosition): Result<List<CompletionItem>> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/completion", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("position", position.toJson())
        })

        result.map { json ->
            val items = json?.optJSONArray("items") ?: json?.let { JSONArray().put(it) } ?: JSONArray()
            (0 until items.length()).map { i ->
                val item = items.getJSONObject(i)
                CompletionItem(
                    label = item.getString("label"),
                    kind = CompletionItemKind.fromValue(item.optInt("kind", 1)),
                    detail = item.optString("detail", ""),
                    documentation = extractDocumentation(item.opt("documentation")),
                    insertText = item.optString("insertText", item.getString("label")),
                    sortText = item.optString("sortText", item.getString("label")),
                    filterText = item.optString("filterText", item.getString("label"))
                )
            }
        }
    }

    // --- Hover ---

    suspend fun hover(uri: String, position: LspPosition): Result<HoverInfo?> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/hover", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("position", position.toJson())
        })

        result.map { json ->
            if (json == null || json.length() == 0) return@map null
            val contents = extractDocumentation(json.opt("contents"))
            if (contents.isBlank()) null
            else HoverInfo(contents, json.optJSONObject("range")?.toLspRange())
        }
    }

    // --- Definition ---

    suspend fun definition(uri: String, position: LspPosition): Result<List<LspLocation>> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/definition", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("position", position.toJson())
        })

        result.map { json ->
            parseLocations(json)
        }
    }

    // --- References ---

    suspend fun references(uri: String, position: LspPosition): Result<List<LspLocation>> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/references", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("position", position.toJson())
            put("context", JSONObject().put("includeDeclaration", true))
        })

        result.map { json -> parseLocations(json) }
    }

    // --- Document Symbols ---

    suspend fun documentSymbols(uri: String): Result<List<DocumentSymbol>> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/documentSymbol", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
        })

        result.map { json ->
            val arr = if (json?.has("result") == true) json.optJSONArray("result") else null
            if (arr != null) parseDocumentSymbols(arr) else emptyList()
        }
    }

    // --- Formatting ---

    suspend fun formatting(uri: String, tabSize: Int, insertSpaces: Boolean): Result<List<TextEdit>> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/formatting", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("options", JSONObject().apply {
                put("tabSize", tabSize)
                put("insertSpaces", insertSpaces)
            })
        })

        result.map { json ->
            val arr = json?.optJSONArray("result") ?: JSONArray()
            (0 until arr.length()).map { i ->
                val edit = arr.getJSONObject(i)
                TextEdit(
                    range = edit.getJSONObject("range").toLspRange(),
                    newText = edit.getString("newText")
                )
            }
        }
    }

    // --- Code Actions ---

    suspend fun codeActions(uri: String, range: LspRange, diagnostics: List<Diagnostic>): Result<List<CodeAction>> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/codeAction", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("range", range.toJson())
            put("context", JSONObject().apply {
                put("diagnostics", JSONArray())
            })
        })

        result.map { json ->
            val arr = json?.optJSONArray("result") ?: JSONArray()
            (0 until arr.length()).map { i ->
                val action = arr.getJSONObject(i)
                CodeAction(
                    title = action.getString("title"),
                    kind = action.optString("kind", ""),
                    isPreferred = action.optBoolean("isPreferred", false)
                )
            }
        }
    }

    // --- Signature Help ---

    suspend fun signatureHelp(uri: String, position: LspPosition): Result<SignatureInfo?> = withContext(Dispatchers.IO) {
        val result = sendRequest("textDocument/signatureHelp", JSONObject().apply {
            put("textDocument", JSONObject().put("uri", uri))
            put("position", position.toJson())
        })

        result.map { json ->
            val signatures = json?.optJSONArray("signatures")
            if (signatures == null || signatures.length() == 0) return@map null
            val sig = signatures.getJSONObject(0)
            val params = sig.optJSONArray("parameters")
            SignatureInfo(
                label = sig.getString("label"),
                documentation = extractDocumentation(sig.opt("documentation")),
                parameters = if (params != null) {
                    (0 until params.length()).map { i ->
                        val p = params.getJSONObject(i)
                        ParameterInfo(p.getString("label"), extractDocumentation(p.opt("documentation")))
                    }
                } else emptyList(),
                activeParameter = json.optInt("activeParameter", 0)
            )
        }
    }

    // ===== JSON-RPC Transport =====

    private suspend fun sendRequest(method: String, params: JSONObject?): Result<JSONObject?> = withContext(Dispatchers.IO) {
        try {
            val id = requestId.incrementAndGet()
            val message = JSONObject().apply {
                put("jsonrpc", "2.0")
                put("id", id)
                put("method", method)
                if (params != null) put("params", params)
            }
            sendMessage(message)
            val response = readResponse()
            if (response?.has("error") == true) {
                val error = response.getJSONObject("error")
                Result.failure(Exception("LSP Hata [${error.optInt("code")}]: ${error.optString("message")}"))
            } else {
                Result.success(response?.optJSONObject("result") ?: response)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun sendNotification(method: String, params: JSONObject?) {
        try {
            val message = JSONObject().apply {
                put("jsonrpc", "2.0")
                put("method", method)
                if (params != null) put("params", params)
            }
            sendMessage(message)
        } catch (_: Exception) {}
    }

    @Synchronized
    private fun sendMessage(json: JSONObject) {
        val w = writer ?: return
        val content = json.toString()
        val header = "Content-Length: ${content.toByteArray(Charsets.UTF_8).size}\r\n\r\n"
        w.write(header)
        w.write(content)
        w.flush()
    }

    private fun readResponse(): JSONObject? {
        val r = reader ?: return null
        var contentLength = -1

        while (true) {
            val headerLine = r.readLine() ?: return null
            if (headerLine.isBlank()) break
            if (headerLine.startsWith("Content-Length:")) {
                contentLength = headerLine.substringAfter(":").trim().toIntOrNull() ?: -1
            }
        }

        if (contentLength <= 0) return null

        val buffer = CharArray(contentLength)
        var totalRead = 0
        while (totalRead < contentLength) {
            val read = r.read(buffer, totalRead, contentLength - totalRead)
            if (read == -1) break
            totalRead += read
        }

        return JSONObject(String(buffer, 0, totalRead))
    }

    // ===== Helpers =====

    private fun buildClientCapabilities(): JSONObject {
        return JSONObject().apply {
            put("textDocument", JSONObject().apply {
                put("completion", JSONObject().apply {
                    put("completionItem", JSONObject().apply {
                        put("snippetSupport", true)
                        put("documentationFormat", JSONArray().apply { put("plaintext"); put("markdown") })
                    })
                })
                put("hover", JSONObject().apply {
                    put("contentFormat", JSONArray().apply { put("plaintext"); put("markdown") })
                })
                put("signatureHelp", JSONObject().apply {
                    put("signatureInformation", JSONObject().apply {
                        put("documentationFormat", JSONArray().apply { put("plaintext"); put("markdown") })
                    })
                })
                put("definition", JSONObject())
                put("references", JSONObject())
                put("documentSymbol", JSONObject())
                put("formatting", JSONObject())
                put("codeAction", JSONObject())
                put("publishDiagnostics", JSONObject())
                put("synchronization", JSONObject().apply {
                    put("didSave", true)
                    put("willSave", false)
                })
            })
            put("workspace", JSONObject().apply {
                put("workspaceFolders", true)
            })
        }
    }

    private fun parseServerCapabilities(caps: JSONObject?): Set<String> {
        if (caps == null) return emptySet()
        val result = mutableSetOf<String>()
        if (caps.has("completionProvider")) result.add("completion")
        if (caps.has("hoverProvider")) result.add("hover")
        if (caps.has("definitionProvider")) result.add("definition")
        if (caps.has("referencesProvider")) result.add("references")
        if (caps.has("documentSymbolProvider")) result.add("documentSymbol")
        if (caps.has("documentFormattingProvider")) result.add("formatting")
        if (caps.has("codeActionProvider")) result.add("codeAction")
        if (caps.has("signatureHelpProvider")) result.add("signatureHelp")
        return result
    }

    private fun extractDocumentation(doc: Any?): String {
        return when (doc) {
            is String -> doc
            is JSONObject -> doc.optString("value", "")
            else -> ""
        }
    }

    private fun parseLocations(json: JSONObject?): List<LspLocation> {
        if (json == null) return emptyList()
        return try {
            val arr = json.optJSONArray("result") ?: JSONArray().apply { put(json) }
            (0 until arr.length()).mapNotNull { i ->
                val loc = arr.optJSONObject(i) ?: return@mapNotNull null
                LspLocation(
                    uri = loc.getString("uri"),
                    range = loc.getJSONObject("range").toLspRange()
                )
            }
        } catch (_: Exception) { emptyList() }
    }

    private fun parseDocumentSymbols(arr: JSONArray): List<DocumentSymbol> {
        return (0 until arr.length()).map { i ->
            val obj = arr.getJSONObject(i)
            DocumentSymbol(
                name = obj.getString("name"),
                detail = obj.optString("detail", ""),
                kind = SymbolKind.fromValue(obj.optInt("kind", 13)),
                range = obj.getJSONObject("range").toLspRange(),
                selectionRange = obj.getJSONObject("selectionRange").toLspRange(),
                children = obj.optJSONArray("children")?.let { parseDocumentSymbols(it) } ?: emptyList()
            )
        }
    }
}

// --- Extension functions for JSON ↔ LSP conversion ---

fun LspPosition.toJson() = JSONObject().apply {
    put("line", line)
    put("character", character)
}

fun LspRange.toJson() = JSONObject().apply {
    put("start", start.toJson())
    put("end", end.toJson())
}

fun JSONObject.toLspPosition() = LspPosition(
    line = getInt("line"),
    character = getInt("character")
)

fun JSONObject.toLspRange() = LspRange(
    start = getJSONObject("start").toLspPosition(),
    end = getJSONObject("end").toLspPosition()
)
