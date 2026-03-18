package com.codeflow.editor.data.ai

import java.util.UUID

// --- AI Provider & Model Definitions ---

enum class AIProvider(val displayName: String) {
    OPENAI("OpenAI"),
    ANTHROPIC("Anthropic"),
    GEMINI("Google Gemini"),
    LOCAL("Yerel Model")
}

data class AIModel(
    val id: String,
    val name: String,
    val provider: AIProvider,
    val maxTokens: Int = 4096,
    val supportsStreaming: Boolean = true
)

object AvailableModels {
    val OPENAI_GPT4O = AIModel("gpt-4o", "GPT-4o", AIProvider.OPENAI, 4096)
    val OPENAI_GPT4O_MINI = AIModel("gpt-4o-mini", "GPT-4o Mini", AIProvider.OPENAI, 4096)
    val OPENAI_GPT35 = AIModel("gpt-3.5-turbo", "GPT-3.5 Turbo", AIProvider.OPENAI, 4096)
    val CLAUDE_SONNET = AIModel("claude-sonnet-4-20250514", "Claude Sonnet 4", AIProvider.ANTHROPIC, 4096)
    val CLAUDE_HAIKU = AIModel("claude-3-5-haiku-20241022", "Claude 3.5 Haiku", AIProvider.ANTHROPIC, 4096)
    val GEMINI_PRO = AIModel("gemini-2.0-flash", "Gemini 2.0 Flash", AIProvider.GEMINI, 4096)
    val GEMINI_FLASH = AIModel("gemini-1.5-flash", "Gemini 1.5 Flash", AIProvider.GEMINI, 4096)

    val all = listOf(
        OPENAI_GPT4O, OPENAI_GPT4O_MINI, OPENAI_GPT35,
        CLAUDE_SONNET, CLAUDE_HAIKU,
        GEMINI_PRO, GEMINI_FLASH
    )

    fun forProvider(provider: AIProvider) = all.filter { it.provider == provider }
}

// --- AI Configuration ---

data class AIConfig(
    val provider: AIProvider = AIProvider.OPENAI,
    val modelId: String = AvailableModels.OPENAI_GPT4O_MINI.id,
    val openaiApiKey: String = "",
    val anthropicApiKey: String = "",
    val geminiApiKey: String = "",
    val localEndpoint: String = "http://localhost:11434",
    val temperature: Float = 0.7f,
    val maxTokens: Int = 2048,
    val systemPrompt: String = DEFAULT_SYSTEM_PROMPT
) {
    val activeApiKey: String
        get() = when (provider) {
            AIProvider.OPENAI -> openaiApiKey
            AIProvider.ANTHROPIC -> anthropicApiKey
            AIProvider.GEMINI -> geminiApiKey
            AIProvider.LOCAL -> ""
        }

    val isConfigured: Boolean
        get() = when (provider) {
            AIProvider.LOCAL -> localEndpoint.isNotBlank()
            else -> activeApiKey.isNotBlank()
        }

    val activeModel: AIModel?
        get() = AvailableModels.all.find { it.id == modelId }

    companion object {
        const val DEFAULT_SYSTEM_PROMPT = """Sen CodeFlow adlı bir Android kod editörü içinde çalışan bir AI asistanısın. 
Kullanıcılara kodlama konusunda yardım ediyorsun. 
Yanıtlarını kısa, net ve kod odaklı tut. 
Kod blokları için markdown formatı kullan.
Türkçe ve İngilizce yanıt verebilirsin, kullanıcının diline göre yanıt ver."""
    }
}

// --- Chat Messages ---

enum class ChatRole {
    USER, ASSISTANT, SYSTEM
}

data class ChatMessage(
    val id: String = UUID.randomUUID().toString(),
    val role: ChatRole,
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isStreaming: Boolean = false,
    val isError: Boolean = false,
    val context: MessageContext? = null
)

data class MessageContext(
    val fileName: String? = null,
    val filePath: String? = null,
    val selectedCode: String? = null,
    val language: String? = null,
    val lineRange: IntRange? = null
)

// --- Inline Edit ---

data class InlineEditRequest(
    val instruction: String,
    val selectedCode: String,
    val fileName: String,
    val language: String,
    val surroundingContext: String = ""
)

data class InlineEditResult(
    val originalCode: String,
    val modifiedCode: String,
    val explanation: String = ""
)

// --- API Request/Response ---

data class ChatCompletionRequest(
    val model: String,
    val messages: List<ApiMessage>,
    val temperature: Float = 0.7f,
    val maxTokens: Int = 2048,
    val stream: Boolean = false
)

data class ApiMessage(
    val role: String,
    val content: String
)

data class ChatCompletionResponse(
    val content: String,
    val finishReason: String? = null,
    val usage: TokenUsage? = null
)

data class TokenUsage(
    val promptTokens: Int = 0,
    val completionTokens: Int = 0,
    val totalTokens: Int = 0
)
