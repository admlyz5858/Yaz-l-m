package com.codeflow.editor.ui.lsp

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codeflow.editor.data.lsp.CompletionItem
import com.codeflow.editor.data.lsp.Diagnostic
import com.codeflow.editor.data.lsp.DocumentSymbol
import com.codeflow.editor.data.lsp.HoverInfo
import com.codeflow.editor.data.lsp.LspClient
import com.codeflow.editor.data.lsp.LspConnectionState
import com.codeflow.editor.data.lsp.LspLanguageConfigs
import com.codeflow.editor.data.lsp.LspLocation
import com.codeflow.editor.data.lsp.LspPosition
import com.codeflow.editor.data.lsp.LspRange
import com.codeflow.editor.data.lsp.LspServerStatus
import com.codeflow.editor.data.lsp.TextEdit
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LspViewModel @Inject constructor(
    private val lspClient: LspClient
) : ViewModel() {

    val serverStatus: StateFlow<LspServerStatus> = lspClient.status
        .stateIn(viewModelScope, SharingStarted.Eagerly, LspServerStatus(""))

    val diagnostics: StateFlow<Map<String, List<Diagnostic>>> = lspClient.diagnostics
        .stateIn(viewModelScope, SharingStarted.Eagerly, emptyMap())

    private val _completionItems = MutableStateFlow<List<CompletionItem>>(emptyList())
    val completionItems: StateFlow<List<CompletionItem>> = _completionItems.asStateFlow()

    private val _hoverInfo = MutableStateFlow<HoverInfo?>(null)
    val hoverInfo: StateFlow<HoverInfo?> = _hoverInfo.asStateFlow()

    private val _documentSymbols = MutableStateFlow<List<DocumentSymbol>>(emptyList())
    val documentSymbols: StateFlow<List<DocumentSymbol>> = _documentSymbols.asStateFlow()

    private val _definitions = MutableStateFlow<List<LspLocation>>(emptyList())
    val definitions: StateFlow<List<LspLocation>> = _definitions.asStateFlow()

    private val _showDiagnostics = MutableStateFlow(false)
    val showDiagnostics: StateFlow<Boolean> = _showDiagnostics.asStateFlow()

    private val _showOutline = MutableStateFlow(false)
    val showOutline: StateFlow<Boolean> = _showOutline.asStateFlow()

    private val _showCompletion = MutableStateFlow(false)
    val showCompletion: StateFlow<Boolean> = _showCompletion.asStateFlow()

    private val _toastMessage = MutableSharedFlow<String>()
    val toastMessage = _toastMessage.asSharedFlow()

    private var currentLanguage: String? = null
    private var openDocumentVersions = mutableMapOf<String, Int>()

    fun connectToServer(language: String, rootPath: String) {
        if (serverStatus.value.state == LspConnectionState.READY && currentLanguage == language) return

        val config = LspLanguageConfigs.getConfig(language, rootPath) ?: run {
            viewModelScope.launch { _toastMessage.emit("$language için LSP sunucusu bulunamadı") }
            return
        }

        currentLanguage = language
        viewModelScope.launch {
            if (serverStatus.value.state == LspConnectionState.READY) {
                lspClient.stop()
            }
            lspClient.start(config).fold(
                onSuccess = { _toastMessage.emit("LSP bağlandı: ${config.language}") },
                onFailure = { _toastMessage.emit("LSP bağlantı hatası: ${it.message}") }
            )
        }
    }

    fun disconnectServer() {
        viewModelScope.launch {
            lspClient.stop()
            currentLanguage = null
        }
    }

    // --- Document Sync ---

    fun onDocumentOpened(uri: String, language: String, content: String) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        val version = 1
        openDocumentVersions[uri] = version
        viewModelScope.launch {
            lspClient.didOpen(uri, language, version, content)
        }
    }

    fun onDocumentChanged(uri: String, content: String) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        val version = (openDocumentVersions[uri] ?: 0) + 1
        openDocumentVersions[uri] = version
        viewModelScope.launch {
            lspClient.didChange(uri, version, content)
        }
    }

    fun onDocumentSaved(uri: String, content: String?) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.didSave(uri, content)
        }
    }

    fun onDocumentClosed(uri: String) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        openDocumentVersions.remove(uri)
        viewModelScope.launch {
            lspClient.didClose(uri)
        }
    }

    // --- Completion ---

    fun requestCompletion(uri: String, line: Int, character: Int) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.completion(uri, LspPosition(line, character)).fold(
                onSuccess = {
                    _completionItems.value = it
                    _showCompletion.value = it.isNotEmpty()
                },
                onFailure = { _completionItems.value = emptyList() }
            )
        }
    }

    fun dismissCompletion() {
        _showCompletion.value = false
        _completionItems.value = emptyList()
    }

    // --- Hover ---

    fun requestHover(uri: String, line: Int, character: Int) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.hover(uri, LspPosition(line, character)).fold(
                onSuccess = { _hoverInfo.value = it },
                onFailure = { _hoverInfo.value = null }
            )
        }
    }

    fun dismissHover() {
        _hoverInfo.value = null
    }

    // --- Definition ---

    fun goToDefinition(uri: String, line: Int, character: Int) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.definition(uri, LspPosition(line, character)).fold(
                onSuccess = {
                    _definitions.value = it
                    if (it.isEmpty()) {
                        _toastMessage.emit("Tanım bulunamadı")
                    }
                },
                onFailure = { _toastMessage.emit("Tanıma gitme hatası: ${it.message}") }
            )
        }
    }

    fun clearDefinitions() {
        _definitions.value = emptyList()
    }

    // --- References ---

    fun findReferences(uri: String, line: Int, character: Int) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.references(uri, LspPosition(line, character)).fold(
                onSuccess = { refs ->
                    if (refs.isEmpty()) {
                        _toastMessage.emit("Referans bulunamadı")
                    } else {
                        _toastMessage.emit("${refs.size} referans bulundu")
                    }
                },
                onFailure = { _toastMessage.emit("Referans arama hatası: ${it.message}") }
            )
        }
    }

    // --- Document Symbols ---

    fun requestDocumentSymbols(uri: String) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.documentSymbols(uri).fold(
                onSuccess = { _documentSymbols.value = it },
                onFailure = { _documentSymbols.value = emptyList() }
            )
        }
    }

    // --- Formatting ---

    fun formatDocument(uri: String, tabSize: Int, insertSpaces: Boolean): StateFlow<List<TextEdit>> {
        val result = MutableStateFlow<List<TextEdit>>(emptyList())
        if (serverStatus.value.state != LspConnectionState.READY) return result
        viewModelScope.launch {
            lspClient.formatting(uri, tabSize, insertSpaces).fold(
                onSuccess = { result.value = it },
                onFailure = { _toastMessage.emit("Biçimlendirme hatası: ${it.message}") }
            )
        }
        return result
    }

    // --- Signature Help ---

    fun requestSignatureHelp(uri: String, line: Int, character: Int) {
        if (serverStatus.value.state != LspConnectionState.READY) return
        viewModelScope.launch {
            lspClient.signatureHelp(uri, LspPosition(line, character))
        }
    }

    // --- Panel Toggles ---

    fun toggleDiagnostics() { _showDiagnostics.value = !_showDiagnostics.value }
    fun hideDiagnostics() { _showDiagnostics.value = false }

    fun toggleOutline() { _showOutline.value = !_showOutline.value }
    fun hideOutline() { _showOutline.value = false }

    override fun onCleared() {
        super.onCleared()
        viewModelScope.launch { lspClient.stop() }
    }
}
