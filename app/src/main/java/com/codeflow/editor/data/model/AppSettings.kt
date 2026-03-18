package com.codeflow.editor.data.model

data class AppSettings(
    val isDarkTheme: Boolean = true,
    val fontSize: Float = 14f,
    val showLineNumbers: Boolean = true,
    val wordWrap: Boolean = false,
    val autoSave: Boolean = true,
    val autoSaveDelayMs: Long = 2000L,
    val tabSize: Int = 4,
    val useSpaces: Boolean = true,
    val showMinimap: Boolean = false,
    val fontFamily: String = "JetBrains Mono",
    val showWhitespace: Boolean = false,
    val bracketPairColorization: Boolean = true,
    val autoCloseBrackets: Boolean = true,
    val highlightCurrentLine: Boolean = true
)
