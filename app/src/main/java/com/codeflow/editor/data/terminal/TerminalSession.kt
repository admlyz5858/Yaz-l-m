package com.codeflow.editor.data.terminal

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.util.UUID

data class TerminalLine(
    val text: String,
    val type: LineType = LineType.OUTPUT
)

enum class LineType {
    INPUT, OUTPUT, ERROR, SYSTEM
}

class TerminalSession(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "Terminal",
    initialWorkDir: String = "/storage/emulated/0"
) {
    private val _lines = MutableStateFlow<List<TerminalLine>>(emptyList())
    val lines: StateFlow<List<TerminalLine>> = _lines.asStateFlow()

    private val _isRunning = MutableStateFlow(false)
    val isRunning: StateFlow<Boolean> = _isRunning.asStateFlow()

    private val _currentDir = MutableStateFlow(initialWorkDir)
    val currentDir: StateFlow<String> = _currentDir.asStateFlow()

    private val _commandHistory = MutableStateFlow<List<String>>(emptyList())
    val commandHistory: StateFlow<List<String>> = _commandHistory.asStateFlow()

    private var currentProcess: Process? = null

    init {
        appendLine("CodeFlow Terminal v0.1.0", LineType.SYSTEM)
        appendLine("Çalışma dizini: $initialWorkDir", LineType.SYSTEM)
        appendLine("---", LineType.SYSTEM)
    }

    suspend fun executeCommand(command: String) {
        if (command.isBlank()) return

        val trimmed = command.trim()
        _commandHistory.update { it + trimmed }

        appendLine("$ $trimmed", LineType.INPUT)

        // Handle built-in commands
        when {
            trimmed == "clear" || trimmed == "cls" -> {
                _lines.value = emptyList()
                return
            }
            trimmed.startsWith("cd ") -> {
                handleCd(trimmed.removePrefix("cd ").trim())
                return
            }
            trimmed == "cd" -> {
                handleCd("/storage/emulated/0")
                return
            }
            trimmed == "pwd" -> {
                appendLine(_currentDir.value, LineType.OUTPUT)
                return
            }
            trimmed == "exit" -> {
                appendLine("Terminal oturumu sonlandırıldı.", LineType.SYSTEM)
                return
            }
        }

        withContext(Dispatchers.IO) {
            try {
                _isRunning.value = true
                val workDir = File(_currentDir.value)

                val processBuilder = ProcessBuilder("/system/bin/sh", "-c", trimmed)
                    .directory(if (workDir.exists()) workDir else File("/"))
                    .redirectErrorStream(true)

                processBuilder.environment().apply {
                    put("HOME", "/storage/emulated/0")
                    put("TERM", "xterm-256color")
                    put("LANG", "en_US.UTF-8")
                    putIfAbsent("PATH", "/system/bin:/system/xbin:/sbin:/vendor/bin")
                }

                val process = processBuilder.start()
                currentProcess = process

                val reader = BufferedReader(InputStreamReader(process.inputStream))
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    line?.let { appendLine(stripAnsiCodes(it), LineType.OUTPUT) }
                }

                val exitCode = process.waitFor()
                if (exitCode != 0) {
                    appendLine("İşlem çıkış kodu: $exitCode", LineType.ERROR)
                }
            } catch (e: Exception) {
                appendLine("Hata: ${e.message}", LineType.ERROR)
            } finally {
                _isRunning.value = false
                currentProcess = null
            }
        }
    }

    fun cancelCurrentProcess() {
        currentProcess?.destroyForcibly()
        currentProcess = null
        _isRunning.value = false
        appendLine("^C İşlem iptal edildi", LineType.SYSTEM)
    }

    private fun handleCd(path: String) {
        val target = if (path.startsWith("/")) {
            File(path)
        } else {
            File(_currentDir.value, path)
        }.canonicalFile

        if (target.exists() && target.isDirectory) {
            _currentDir.value = target.absolutePath
            appendLine(_currentDir.value, LineType.OUTPUT)
        } else {
            appendLine("cd: $path: Dizin bulunamadı", LineType.ERROR)
        }
    }

    private fun appendLine(text: String, type: LineType) {
        _lines.update { current ->
            val updated = current + TerminalLine(text, type)
            if (updated.size > 5000) updated.drop(updated.size - 5000) else updated
        }
    }

    private fun stripAnsiCodes(text: String): String {
        return text.replace(Regex("\u001B\\[[;\\d]*[A-Za-z]"), "")
    }
}
