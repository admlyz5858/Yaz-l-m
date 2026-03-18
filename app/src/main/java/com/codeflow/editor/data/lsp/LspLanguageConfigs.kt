package com.codeflow.editor.data.lsp

/**
 * Known LSP server configurations for popular languages.
 * These require the respective language servers to be installed on the device
 * (e.g., via Termux: pkg install nodejs && npm i -g typescript-language-server).
 */
object LspLanguageConfigs {

    fun getConfig(language: String, rootPath: String): LspServerConfig? {
        val rootUri = "file://$rootPath"
        return when (language) {
            "typescript", "typescriptreact", "javascript", "javascriptreact" ->
                LspServerConfig(
                    language = language,
                    command = "typescript-language-server",
                    args = listOf("--stdio"),
                    rootUri = rootUri
                )

            "python" ->
                LspServerConfig(
                    language = language,
                    command = "pylsp",
                    rootUri = rootUri
                )

            "java" ->
                LspServerConfig(
                    language = language,
                    command = "jdtls",
                    rootUri = rootUri
                )

            "kotlin" ->
                LspServerConfig(
                    language = language,
                    command = "kotlin-language-server",
                    rootUri = rootUri
                )

            "go" ->
                LspServerConfig(
                    language = language,
                    command = "gopls",
                    rootUri = rootUri
                )

            "rust" ->
                LspServerConfig(
                    language = language,
                    command = "rust-analyzer",
                    rootUri = rootUri
                )

            "c", "cpp" ->
                LspServerConfig(
                    language = language,
                    command = "clangd",
                    rootUri = rootUri
                )

            "html" ->
                LspServerConfig(
                    language = language,
                    command = "vscode-html-language-server",
                    args = listOf("--stdio"),
                    rootUri = rootUri
                )

            "css", "scss", "less" ->
                LspServerConfig(
                    language = language,
                    command = "vscode-css-language-server",
                    args = listOf("--stdio"),
                    rootUri = rootUri
                )

            "json" ->
                LspServerConfig(
                    language = language,
                    command = "vscode-json-language-server",
                    args = listOf("--stdio"),
                    rootUri = rootUri
                )

            "yaml" ->
                LspServerConfig(
                    language = language,
                    command = "yaml-language-server",
                    args = listOf("--stdio"),
                    rootUri = rootUri
                )

            "lua" ->
                LspServerConfig(
                    language = language,
                    command = "lua-language-server",
                    rootUri = rootUri
                )

            "dart" ->
                LspServerConfig(
                    language = language,
                    command = "dart",
                    args = listOf("language-server", "--protocol=lsp"),
                    rootUri = rootUri
                )

            "swift" ->
                LspServerConfig(
                    language = language,
                    command = "sourcekit-lsp",
                    rootUri = rootUri
                )

            else -> null
        }
    }

    val supportedLanguages = listOf(
        "typescript", "javascript", "python", "java", "kotlin",
        "go", "rust", "c", "cpp", "html", "css", "json",
        "yaml", "lua", "dart", "swift"
    )

    fun isSupported(language: String): Boolean = language in supportedLanguages
}
