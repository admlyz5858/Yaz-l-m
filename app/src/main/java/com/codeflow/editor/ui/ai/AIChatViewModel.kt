package com.codeflow.editor.ui.ai

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codeflow.editor.data.ai.AIConfig
import com.codeflow.editor.data.ai.AIProvider
import com.codeflow.editor.data.ai.AIRepository
import com.codeflow.editor.data.ai.AvailableModels
import com.codeflow.editor.data.ai.ChatMessage
import com.codeflow.editor.data.ai.ChatRole
import com.codeflow.editor.data.ai.InlineEditRequest
import com.codeflow.editor.data.ai.InlineEditResult
import com.codeflow.editor.data.ai.MessageContext
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AIChatViewModel @Inject constructor(
    private val aiRepository: AIRepository
) : ViewModel() {

    val aiConfig: StateFlow<AIConfig> = aiRepository.config
        .stateIn(viewModelScope, SharingStarted.Eagerly, AIConfig())

    private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _currentContext = MutableStateFlow<MessageContext?>(null)
    val currentContext: StateFlow<MessageContext?> = _currentContext.asStateFlow()

    private val _showAISettings = MutableStateFlow(false)
    val showAISettings: StateFlow<Boolean> = _showAISettings.asStateFlow()

    private val _inlineEditResult = MutableStateFlow<InlineEditResult?>(null)
    val inlineEditResult: StateFlow<InlineEditResult?> = _inlineEditResult.asStateFlow()

    private val _toastMessage = MutableSharedFlow<String>()
    val toastMessage = _toastMessage.asSharedFlow()

    private val _totalTokensUsed = MutableStateFlow(0)
    val totalTokensUsed: StateFlow<Int> = _totalTokensUsed.asStateFlow()

    fun sendMessage(text: String) {
        val config = aiConfig.value
        if (!config.isConfigured) {
            viewModelScope.launch {
                _toastMessage.emit("Lütfen önce AI ayarlarından API anahtarınızı girin")
            }
            return
        }

        val userMessage = ChatMessage(
            role = ChatRole.USER,
            content = text,
            context = _currentContext.value
        )

        _messages.update { it + userMessage }

        val loadingMessage = ChatMessage(
            role = ChatRole.ASSISTANT,
            content = "Düşünüyorum...",
            isStreaming = true
        )
        _messages.update { it + loadingMessage }
        _isLoading.value = true

        viewModelScope.launch {
            val history = _messages.value.filter { !it.isStreaming }
            aiRepository.sendMessage(config, history, _currentContext.value).fold(
                onSuccess = { response ->
                    _messages.update { msgs ->
                        msgs.filter { !it.isStreaming } + ChatMessage(
                            role = ChatRole.ASSISTANT,
                            content = response.content
                        )
                    }
                    response.usage?.let { usage ->
                        _totalTokensUsed.update { it + usage.totalTokens }
                    }
                },
                onFailure = { error ->
                    _messages.update { msgs ->
                        msgs.filter { !it.isStreaming } + ChatMessage(
                            role = ChatRole.ASSISTANT,
                            content = "Hata: ${error.message}",
                            isError = true
                        )
                    }
                }
            )
            _isLoading.value = false
        }
    }

    fun setContext(context: MessageContext?) {
        _currentContext.value = context
    }

    fun clearContext() {
        _currentContext.value = null
    }

    fun clearChat() {
        _messages.value = emptyList()
        _currentContext.value = null
    }

    fun requestInlineEdit(request: InlineEditRequest) {
        val config = aiConfig.value
        if (!config.isConfigured) {
            viewModelScope.launch {
                _toastMessage.emit("Lütfen önce AI ayarlarından API anahtarınızı girin")
            }
            return
        }

        _isLoading.value = true
        viewModelScope.launch {
            aiRepository.requestInlineEdit(config, request).fold(
                onSuccess = { result ->
                    _inlineEditResult.value = result
                },
                onFailure = { error ->
                    _toastMessage.emit("Inline düzenleme hatası: ${error.message}")
                }
            )
            _isLoading.value = false
        }
    }

    fun acceptInlineEdit() {
        _inlineEditResult.value = null
    }

    fun rejectInlineEdit() {
        _inlineEditResult.value = null
    }

    // Quick actions
    fun explainCode(code: String, language: String, fileName: String) {
        setContext(MessageContext(fileName = fileName, language = language, selectedCode = code))
        sendMessage("Bu kodu açıkla:")
    }

    fun fixCode(code: String, language: String, fileName: String) {
        setContext(MessageContext(fileName = fileName, language = language, selectedCode = code))
        sendMessage("Bu koddaki hataları bul ve düzelt:")
    }

    fun generateTests(code: String, language: String, fileName: String) {
        setContext(MessageContext(fileName = fileName, language = language, selectedCode = code))
        sendMessage("Bu kod için birim testler yaz:")
    }

    fun generateDocs(code: String, language: String, fileName: String) {
        setContext(MessageContext(fileName = fileName, language = language, selectedCode = code))
        sendMessage("Bu kod için dokümantasyon yaz:")
    }

    fun optimizeCode(code: String, language: String, fileName: String) {
        setContext(MessageContext(fileName = fileName, language = language, selectedCode = code))
        sendMessage("Bu kodu optimize et ve performansını artır:")
    }

    // Settings
    fun showAISettings() { _showAISettings.value = true }
    fun hideAISettings() { _showAISettings.value = false }

    fun updateProvider(provider: AIProvider) {
        viewModelScope.launch {
            aiRepository.updateProvider(provider)
            val models = AvailableModels.forProvider(provider)
            if (models.isNotEmpty()) {
                aiRepository.updateModelId(models.first().id)
            }
        }
    }

    fun updateModel(modelId: String) {
        viewModelScope.launch { aiRepository.updateModelId(modelId) }
    }

    fun updateApiKey(provider: AIProvider, key: String) {
        viewModelScope.launch { aiRepository.updateApiKey(provider, key) }
    }

    fun updateTemperature(temp: Float) {
        viewModelScope.launch { aiRepository.updateTemperature(temp) }
    }
}
