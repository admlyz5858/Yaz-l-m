package com.codeflow.editor.data.ai

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.aiDataStore: DataStore<Preferences> by preferencesDataStore(name = "ai_settings")

@Singleton
class AIRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val apiClient: AIApiClient
) {
    private object Keys {
        val PROVIDER = stringPreferencesKey("ai_provider")
        val MODEL_ID = stringPreferencesKey("ai_model_id")
        val OPENAI_KEY = stringPreferencesKey("openai_api_key")
        val ANTHROPIC_KEY = stringPreferencesKey("anthropic_api_key")
        val GEMINI_KEY = stringPreferencesKey("gemini_api_key")
        val LOCAL_ENDPOINT = stringPreferencesKey("local_endpoint")
        val TEMPERATURE = floatPreferencesKey("ai_temperature")
        val MAX_TOKENS = intPreferencesKey("ai_max_tokens")
        val SYSTEM_PROMPT = stringPreferencesKey("ai_system_prompt")
    }

    val config: Flow<AIConfig> = context.aiDataStore.data.map { prefs ->
        AIConfig(
            provider = prefs[Keys.PROVIDER]?.let { AIProvider.valueOf(it) } ?: AIProvider.OPENAI,
            modelId = prefs[Keys.MODEL_ID] ?: AvailableModels.OPENAI_GPT4O_MINI.id,
            openaiApiKey = prefs[Keys.OPENAI_KEY] ?: "",
            anthropicApiKey = prefs[Keys.ANTHROPIC_KEY] ?: "",
            geminiApiKey = prefs[Keys.GEMINI_KEY] ?: "",
            localEndpoint = prefs[Keys.LOCAL_ENDPOINT] ?: "http://localhost:11434",
            temperature = prefs[Keys.TEMPERATURE] ?: 0.7f,
            maxTokens = prefs[Keys.MAX_TOKENS] ?: 2048,
            systemPrompt = prefs[Keys.SYSTEM_PROMPT] ?: AIConfig.DEFAULT_SYSTEM_PROMPT
        )
    }

    suspend fun updateProvider(provider: AIProvider) {
        context.aiDataStore.edit { it[Keys.PROVIDER] = provider.name }
    }

    suspend fun updateModelId(modelId: String) {
        context.aiDataStore.edit { it[Keys.MODEL_ID] = modelId }
    }

    suspend fun updateApiKey(provider: AIProvider, key: String) {
        context.aiDataStore.edit {
            when (provider) {
                AIProvider.OPENAI -> it[Keys.OPENAI_KEY] = key
                AIProvider.ANTHROPIC -> it[Keys.ANTHROPIC_KEY] = key
                AIProvider.GEMINI -> it[Keys.GEMINI_KEY] = key
                AIProvider.LOCAL -> it[Keys.LOCAL_ENDPOINT] = key
            }
        }
    }

    suspend fun updateTemperature(temp: Float) {
        context.aiDataStore.edit { it[Keys.TEMPERATURE] = temp }
    }

    suspend fun updateMaxTokens(tokens: Int) {
        context.aiDataStore.edit { it[Keys.MAX_TOKENS] = tokens }
    }

    suspend fun updateSystemPrompt(prompt: String) {
        context.aiDataStore.edit { it[Keys.SYSTEM_PROMPT] = prompt }
    }

    suspend fun sendMessage(
        config: AIConfig,
        chatHistory: List<ChatMessage>,
        context: MessageContext? = null
    ): Result<ChatCompletionResponse> {
        val apiMessages = mutableListOf<ApiMessage>()

        // System prompt
        apiMessages.add(ApiMessage("system", config.systemPrompt))

        // Add context if available
        if (context != null) {
            val contextText = buildContextPrompt(context)
            if (contextText.isNotBlank()) {
                apiMessages.add(ApiMessage("system", contextText))
            }
        }

        // Chat history
        chatHistory.filter { !it.isError && !it.isStreaming }.forEach { msg ->
            apiMessages.add(ApiMessage(
                role = when (msg.role) {
                    ChatRole.USER -> "user"
                    ChatRole.ASSISTANT -> "assistant"
                    ChatRole.SYSTEM -> "system"
                },
                content = msg.content
            ))
        }

        return apiClient.sendChatRequest(config, apiMessages)
    }

    suspend fun requestInlineEdit(
        config: AIConfig,
        request: InlineEditRequest
    ): Result<InlineEditResult> {
        val prompt = buildInlineEditPrompt(request)
        val messages = listOf(
            ApiMessage("system", INLINE_EDIT_SYSTEM_PROMPT),
            ApiMessage("user", prompt)
        )

        return apiClient.sendChatRequest(config, messages).map { response ->
            parseInlineEditResponse(request.selectedCode, response.content)
        }
    }

    private fun buildContextPrompt(context: MessageContext): String {
        val parts = mutableListOf<String>()

        context.fileName?.let { parts.add("Dosya: $it") }
        context.language?.let { parts.add("Dil: $it") }
        context.selectedCode?.let { code ->
            val lineInfo = context.lineRange?.let { " (satır ${it.first}-${it.last})" } ?: ""
            parts.add("Seçili kod$lineInfo:\n```\n$code\n```")
        }

        return if (parts.isNotEmpty()) {
            "Kullanıcının çalıştığı bağlam:\n${parts.joinToString("\n")}"
        } else ""
    }

    private fun buildInlineEditPrompt(request: InlineEditRequest): String {
        return """Dosya: ${request.fileName} (${request.language})
Talimat: ${request.instruction}

Değiştirilecek kod:
```
${request.selectedCode}
```

${if (request.surroundingContext.isNotBlank()) "Çevreleyen bağlam:\n```\n${request.surroundingContext}\n```" else ""}

SADECE değiştirilmiş kodu döndür, açıklama ekleme. Kod bloğu içinde döndür."""
    }

    private fun parseInlineEditResponse(originalCode: String, response: String): InlineEditResult {
        // Extract code from markdown code blocks if present
        val codeBlockRegex = Regex("```(?:\\w+)?\\n([\\s\\S]*?)\\n```")
        val match = codeBlockRegex.find(response)
        val modifiedCode = match?.groupValues?.get(1) ?: response.trim()

        return InlineEditResult(
            originalCode = originalCode,
            modifiedCode = modifiedCode,
            explanation = if (match != null) {
                response.replace(match.value, "").trim()
            } else ""
        )
    }

    companion object {
        private const val INLINE_EDIT_SYSTEM_PROMPT = """Sen bir kod düzenleme asistanısın. 
Kullanıcının talimatına göre verilen kodu düzenle.
SADECE değiştirilmiş kodu döndür.
Kod bloğu (```) içinde döndür.
Açıklama ekleme, sadece kodu ver."""
    }
}
