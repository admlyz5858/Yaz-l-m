package com.codeflow.editor.data.ai

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AIApiClient @Inject constructor() {

    suspend fun sendChatRequest(
        config: AIConfig,
        messages: List<ApiMessage>
    ): Result<ChatCompletionResponse> = withContext(Dispatchers.IO) {
        try {
            when (config.provider) {
                AIProvider.OPENAI -> callOpenAI(config, messages)
                AIProvider.ANTHROPIC -> callAnthropic(config, messages)
                AIProvider.GEMINI -> callGemini(config, messages)
                AIProvider.LOCAL -> callLocal(config, messages)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ===== OpenAI API =====
    private fun callOpenAI(config: AIConfig, messages: List<ApiMessage>): Result<ChatCompletionResponse> {
        val url = URL("https://api.openai.com/v1/chat/completions")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("Authorization", "Bearer ${config.openaiApiKey}")
            doOutput = true
            connectTimeout = 30000
            readTimeout = 60000
        }

        val body = JSONObject().apply {
            put("model", config.modelId)
            put("messages", JSONArray().apply {
                messages.forEach { msg ->
                    put(JSONObject().apply {
                        put("role", msg.role)
                        put("content", msg.content)
                    })
                }
            })
            put("temperature", config.temperature.toDouble())
            put("max_tokens", config.maxTokens)
        }

        conn.outputStream.use { it.write(body.toString().toByteArray()) }

        return parseOpenAIResponse(conn)
    }

    private fun parseOpenAIResponse(conn: HttpURLConnection): Result<ChatCompletionResponse> {
        val responseCode = conn.responseCode
        val stream = if (responseCode in 200..299) conn.inputStream else conn.errorStream
        val responseText = BufferedReader(InputStreamReader(stream)).readText()

        if (responseCode !in 200..299) {
            val errorMsg = try {
                JSONObject(responseText).optJSONObject("error")?.optString("message") ?: responseText
            } catch (_: Exception) { responseText }
            return Result.failure(Exception("OpenAI API hatası ($responseCode): $errorMsg"))
        }

        return try {
            val json = JSONObject(responseText)
            val choice = json.getJSONArray("choices").getJSONObject(0)
            val content = choice.getJSONObject("message").getString("content")
            val usage = json.optJSONObject("usage")?.let {
                TokenUsage(
                    promptTokens = it.optInt("prompt_tokens"),
                    completionTokens = it.optInt("completion_tokens"),
                    totalTokens = it.optInt("total_tokens")
                )
            }
            Result.success(ChatCompletionResponse(content, choice.optString("finish_reason"), usage))
        } catch (e: Exception) {
            Result.failure(Exception("Yanıt ayrıştırma hatası: ${e.message}"))
        }
    }

    // ===== Anthropic (Claude) API =====
    private fun callAnthropic(config: AIConfig, messages: List<ApiMessage>): Result<ChatCompletionResponse> {
        val url = URL("https://api.anthropic.com/v1/messages")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("x-api-key", config.anthropicApiKey)
            setRequestProperty("anthropic-version", "2023-06-01")
            doOutput = true
            connectTimeout = 30000
            readTimeout = 60000
        }

        val systemMsg = messages.find { it.role == "system" }?.content ?: ""
        val chatMessages = messages.filter { it.role != "system" }

        val body = JSONObject().apply {
            put("model", config.modelId)
            put("max_tokens", config.maxTokens)
            if (systemMsg.isNotBlank()) put("system", systemMsg)
            put("messages", JSONArray().apply {
                chatMessages.forEach { msg ->
                    put(JSONObject().apply {
                        put("role", msg.role)
                        put("content", msg.content)
                    })
                }
            })
        }

        conn.outputStream.use { it.write(body.toString().toByteArray()) }

        return parseAnthropicResponse(conn)
    }

    private fun parseAnthropicResponse(conn: HttpURLConnection): Result<ChatCompletionResponse> {
        val responseCode = conn.responseCode
        val stream = if (responseCode in 200..299) conn.inputStream else conn.errorStream
        val responseText = BufferedReader(InputStreamReader(stream)).readText()

        if (responseCode !in 200..299) {
            val errorMsg = try {
                JSONObject(responseText).optJSONObject("error")?.optString("message") ?: responseText
            } catch (_: Exception) { responseText }
            return Result.failure(Exception("Claude API hatası ($responseCode): $errorMsg"))
        }

        return try {
            val json = JSONObject(responseText)
            val content = json.getJSONArray("content").getJSONObject(0).getString("text")
            val usage = json.optJSONObject("usage")?.let {
                TokenUsage(
                    promptTokens = it.optInt("input_tokens"),
                    completionTokens = it.optInt("output_tokens"),
                    totalTokens = it.optInt("input_tokens") + it.optInt("output_tokens")
                )
            }
            Result.success(ChatCompletionResponse(content, json.optString("stop_reason"), usage))
        } catch (e: Exception) {
            Result.failure(Exception("Yanıt ayrıştırma hatası: ${e.message}"))
        }
    }

    // ===== Google Gemini API =====
    private fun callGemini(config: AIConfig, messages: List<ApiMessage>): Result<ChatCompletionResponse> {
        val url = URL("https://generativelanguage.googleapis.com/v1beta/models/${config.modelId}:generateContent?key=${config.geminiApiKey}")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json")
            doOutput = true
            connectTimeout = 30000
            readTimeout = 60000
        }

        val systemMsg = messages.find { it.role == "system" }?.content
        val chatMessages = messages.filter { it.role != "system" }

        val body = JSONObject().apply {
            if (systemMsg != null) {
                put("systemInstruction", JSONObject().apply {
                    put("parts", JSONArray().apply {
                        put(JSONObject().put("text", systemMsg))
                    })
                })
            }
            put("contents", JSONArray().apply {
                chatMessages.forEach { msg ->
                    put(JSONObject().apply {
                        put("role", if (msg.role == "assistant") "model" else "user")
                        put("parts", JSONArray().apply {
                            put(JSONObject().put("text", msg.content))
                        })
                    })
                }
            })
            put("generationConfig", JSONObject().apply {
                put("temperature", config.temperature.toDouble())
                put("maxOutputTokens", config.maxTokens)
            })
        }

        conn.outputStream.use { it.write(body.toString().toByteArray()) }

        return parseGeminiResponse(conn)
    }

    private fun parseGeminiResponse(conn: HttpURLConnection): Result<ChatCompletionResponse> {
        val responseCode = conn.responseCode
        val stream = if (responseCode in 200..299) conn.inputStream else conn.errorStream
        val responseText = BufferedReader(InputStreamReader(stream)).readText()

        if (responseCode !in 200..299) {
            val errorMsg = try {
                JSONObject(responseText).optJSONObject("error")?.optString("message") ?: responseText
            } catch (_: Exception) { responseText }
            return Result.failure(Exception("Gemini API hatası ($responseCode): $errorMsg"))
        }

        return try {
            val json = JSONObject(responseText)
            val candidate = json.getJSONArray("candidates").getJSONObject(0)
            val content = candidate.getJSONObject("content")
                .getJSONArray("parts").getJSONObject(0).getString("text")
            val usage = json.optJSONObject("usageMetadata")?.let {
                TokenUsage(
                    promptTokens = it.optInt("promptTokenCount"),
                    completionTokens = it.optInt("candidatesTokenCount"),
                    totalTokens = it.optInt("totalTokenCount")
                )
            }
            Result.success(ChatCompletionResponse(content, candidate.optString("finishReason"), usage))
        } catch (e: Exception) {
            Result.failure(Exception("Yanıt ayrıştırma hatası: ${e.message}"))
        }
    }

    // ===== Local (Ollama-compatible) API =====
    private fun callLocal(config: AIConfig, messages: List<ApiMessage>): Result<ChatCompletionResponse> {
        val endpoint = config.localEndpoint.trimEnd('/')
        val url = URL("$endpoint/api/chat")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            setRequestProperty("Content-Type", "application/json")
            doOutput = true
            connectTimeout = 10000
            readTimeout = 120000
        }

        val body = JSONObject().apply {
            put("model", config.modelId)
            put("messages", JSONArray().apply {
                messages.forEach { msg ->
                    put(JSONObject().apply {
                        put("role", msg.role)
                        put("content", msg.content)
                    })
                }
            })
            put("stream", false)
            put("options", JSONObject().apply {
                put("temperature", config.temperature.toDouble())
            })
        }

        conn.outputStream.use { it.write(body.toString().toByteArray()) }

        val responseCode = conn.responseCode
        val stream = if (responseCode in 200..299) conn.inputStream else conn.errorStream
        val responseText = BufferedReader(InputStreamReader(stream)).readText()

        if (responseCode !in 200..299) {
            return Result.failure(Exception("Yerel model hatası ($responseCode): $responseText"))
        }

        return try {
            val json = JSONObject(responseText)
            val content = json.getJSONObject("message").getString("content")
            Result.success(ChatCompletionResponse(content))
        } catch (e: Exception) {
            Result.failure(Exception("Yanıt ayrıştırma hatası: ${e.message}"))
        }
    }
}
