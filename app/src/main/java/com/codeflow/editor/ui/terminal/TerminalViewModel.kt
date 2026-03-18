package com.codeflow.editor.ui.terminal

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import com.codeflow.editor.data.terminal.TerminalLine
import com.codeflow.editor.data.terminal.TerminalSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class TerminalViewModel @Inject constructor() : ViewModel() {

    private val _sessions = MutableStateFlow<List<TerminalSession>>(emptyList())
    val sessions: StateFlow<List<TerminalSession>> = _sessions.asStateFlow()

    private val _activeSessionId = MutableStateFlow<String?>(null)
    val activeSessionId: StateFlow<String?> = _activeSessionId.asStateFlow()

    private val activeSession: TerminalSession?
        get() {
            val id = _activeSessionId.value ?: return null
            return _sessions.value.find { it.id == id }
        }

    val lines: StateFlow<List<TerminalLine>> = _activeSessionId.flatMapLatest { id ->
        _sessions.value.find { it.id == id }?.lines ?: flowOf(emptyList())
    }.stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    val currentDir: StateFlow<String> = _activeSessionId.flatMapLatest { id ->
        _sessions.value.find { it.id == id }?.currentDir ?: flowOf("")
    }.stateIn(viewModelScope, SharingStarted.Eagerly, "")

    val isRunning: StateFlow<Boolean> = _activeSessionId.flatMapLatest { id ->
        _sessions.value.find { it.id == id }?.isRunning ?: flowOf(false)
    }.stateIn(viewModelScope, SharingStarted.Eagerly, false)

    val commandHistory: StateFlow<List<String>> = _activeSessionId.flatMapLatest { id ->
        _sessions.value.find { it.id == id }?.commandHistory ?: flowOf(emptyList())
    }.stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    fun createSession(workDir: String = "/storage/emulated/0") {
        val session = TerminalSession(initialWorkDir = workDir)
        _sessions.value = _sessions.value + session
        _activeSessionId.value = session.id
    }

    fun ensureSession(workDir: String = "/storage/emulated/0") {
        if (_sessions.value.isEmpty()) {
            createSession(workDir)
        }
    }

    fun executeCommand(command: String) {
        val session = activeSession ?: return
        viewModelScope.launch {
            session.executeCommand(command)
        }
    }

    fun cancelProcess() {
        activeSession?.cancelCurrentProcess()
    }

    fun clearTerminal() {
        val session = activeSession ?: return
        // Create fresh session at same directory
        val newSession = TerminalSession(initialWorkDir = session.currentDir.value)
        _sessions.value = _sessions.value.map { if (it.id == session.id) newSession else it }
        _activeSessionId.value = newSession.id
    }
}
