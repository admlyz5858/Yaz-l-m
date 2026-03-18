package com.codeflow.editor.data.model

import java.io.File
import java.util.UUID

data class EditorTab(
    val id: String = UUID.randomUUID().toString(),
    val file: File,
    val content: String = "",
    val isModified: Boolean = false,
    val cursorPosition: Int = 0,
    val scrollPosition: Int = 0,
    val language: String = detectLanguage(file.extension)
) {
    val title: String
        get() = if (isModified) "● ${file.name}" else file.name

    val displayTitle: String
        get() = file.name
}

fun detectLanguage(extension: String): String {
    return when (extension.lowercase()) {
        "js", "mjs", "cjs" -> "javascript"
        "ts", "mts", "cts" -> "typescript"
        "jsx" -> "javascriptreact"
        "tsx" -> "typescriptreact"
        "py", "pyw" -> "python"
        "java" -> "java"
        "kt", "kts" -> "kotlin"
        "c", "h" -> "c"
        "cpp", "cc", "cxx", "hpp", "hxx" -> "cpp"
        "cs" -> "csharp"
        "go" -> "go"
        "rs" -> "rust"
        "swift" -> "swift"
        "dart" -> "dart"
        "rb" -> "ruby"
        "php" -> "php"
        "html", "htm" -> "html"
        "css" -> "css"
        "scss" -> "scss"
        "less" -> "less"
        "json" -> "json"
        "xml" -> "xml"
        "yaml", "yml" -> "yaml"
        "toml" -> "toml"
        "md", "markdown" -> "markdown"
        "sql" -> "sql"
        "sh", "bash", "zsh" -> "shellscript"
        "ps1" -> "powershell"
        "r" -> "r"
        "lua" -> "lua"
        "dockerfile" -> "dockerfile"
        "gradle" -> "groovy"
        "gradle.kts" -> "kotlin"
        "makefile" -> "makefile"
        "ini", "cfg" -> "ini"
        "env" -> "dotenv"
        else -> "plaintext"
    }
}
