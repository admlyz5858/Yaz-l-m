package com.codeflow.editor.data.extension

import java.io.File
import java.util.UUID

// --- Extension Manifest ---

data class ExtensionManifest(
    val id: String,
    val name: String,
    val displayName: String,
    val version: String,
    val description: String = "",
    val author: String = "",
    val publisher: String = "",
    val icon: String = "",
    val category: ExtensionCategory = ExtensionCategory.OTHER,
    val activationEvents: List<String> = emptyList(),
    val contributes: ExtensionContributions = ExtensionContributions(),
    val engines: String = "codeflow >= 0.1.0",
    val repository: String = "",
    val license: String = ""
)

enum class ExtensionCategory(val displayName: String) {
    LANGUAGE("Dil Desteği"),
    THEME("Tema"),
    SNIPPET("Snippet"),
    FORMATTER("Biçimlendirici"),
    LINTER("Linter"),
    DEBUGGER("Hata Ayıklayıcı"),
    KEYBINDING("Klavye Kısayolları"),
    AI("AI Araçları"),
    GIT("Git Araçları"),
    OTHER("Diğer")
}

data class ExtensionContributions(
    val languages: List<LanguageContribution> = emptyList(),
    val themes: List<ThemeContribution> = emptyList(),
    val snippets: List<SnippetContribution> = emptyList(),
    val commands: List<CommandContribution> = emptyList(),
    val menus: List<MenuContribution> = emptyList(),
    val configuration: List<ConfigurationContribution> = emptyList()
)

data class LanguageContribution(
    val id: String,
    val extensions: List<String> = emptyList(),
    val aliases: List<String> = emptyList(),
    val configuration: String = "",
    val grammar: String = ""
)

data class ThemeContribution(
    val label: String,
    val uiTheme: String = "vs-dark",
    val path: String = ""
)

data class SnippetContribution(
    val language: String,
    val path: String
)

data class CommandContribution(
    val command: String,
    val title: String,
    val category: String = "",
    val icon: String = ""
)

data class MenuContribution(
    val location: String,
    val command: String,
    val group: String = "",
    val when_: String = ""
)

data class ConfigurationContribution(
    val title: String,
    val properties: Map<String, ConfigProperty> = emptyMap()
)

data class ConfigProperty(
    val type: String,
    val default: Any? = null,
    val description: String = ""
)

// --- Extension Runtime ---

enum class ExtensionState {
    NOT_INSTALLED,
    INSTALLED,
    ENABLED,
    DISABLED,
    ERROR,
    UPDATING
}

data class Extension(
    val manifest: ExtensionManifest,
    val state: ExtensionState = ExtensionState.NOT_INSTALLED,
    val installPath: File? = null,
    val errorMessage: String? = null,
    val rating: Float = 0f,
    val downloadCount: Int = 0,
    val lastUpdated: String = ""
)

// --- Marketplace ---

data class MarketplaceSearchResult(
    val extensions: List<Extension>,
    val totalCount: Int,
    val page: Int = 1
)

enum class MarketplaceSortOrder {
    RELEVANCE,
    DOWNLOADS,
    RATING,
    UPDATED,
    NAME
}

// --- Built-in Extension Registry ---

object BuiltInExtensions {

    fun getAll(): List<Extension> = listOf(
        createThemeExtension("dark-plus", "Dark+ (Varsayılan Koyu)", "CodeFlow", "VSCode Dark+ temasının uyarlaması"),
        createThemeExtension("light-plus", "Light+ (Varsayılan Açık)", "CodeFlow", "VSCode Light+ temasının uyarlaması"),
        createThemeExtension("monokai", "Monokai", "CodeFlow", "Klasik Monokai renk teması"),
        createThemeExtension("dracula", "Dracula", "CodeFlow", "Popüler Dracula teması"),
        createThemeExtension("one-dark", "One Dark Pro", "CodeFlow", "Atom One Dark teması"),
        createThemeExtension("nord", "Nord", "CodeFlow", "Arctic-inspired Nord teması"),
        createThemeExtension("solarized-dark", "Solarized Dark", "CodeFlow", "Solarized koyu tema"),
        createThemeExtension("tokyo-night", "Tokyo Night", "CodeFlow", "Tokyo Night renk teması"),
        createThemeExtension("github-dark", "GitHub Dark", "CodeFlow", "GitHub koyu tema"),
        createThemeExtension("catppuccin", "Catppuccin", "CodeFlow", "Soothing pastel tema"),

        createLanguageExtension("lang-python", "Python Language", "CodeFlow", "Python dil desteği, snippet ve grammar",
            listOf(".py", ".pyw"), listOf("Python")),
        createLanguageExtension("lang-javascript", "JavaScript Language", "CodeFlow", "JavaScript/TypeScript dil desteği",
            listOf(".js", ".mjs", ".jsx", ".ts", ".tsx"), listOf("JavaScript", "TypeScript")),
        createLanguageExtension("lang-kotlin", "Kotlin Language", "CodeFlow", "Kotlin dil desteği",
            listOf(".kt", ".kts"), listOf("Kotlin")),
        createLanguageExtension("lang-java", "Java Language", "CodeFlow", "Java dil desteği",
            listOf(".java"), listOf("Java")),
        createLanguageExtension("lang-go", "Go Language", "CodeFlow", "Go dil desteği",
            listOf(".go"), listOf("Go")),
        createLanguageExtension("lang-rust", "Rust Language", "CodeFlow", "Rust dil desteği",
            listOf(".rs"), listOf("Rust")),

        Extension(
            manifest = ExtensionManifest(
                id = "prettier-formatter",
                name = "prettier-formatter",
                displayName = "Prettier Formatter",
                version = "1.0.0",
                description = "Prettier ile otomatik kod biçimlendirme",
                author = "CodeFlow",
                category = ExtensionCategory.FORMATTER
            ),
            state = ExtensionState.INSTALLED,
            rating = 4.8f,
            downloadCount = 50000
        ),
        Extension(
            manifest = ExtensionManifest(
                id = "eslint-linter",
                name = "eslint-linter",
                displayName = "ESLint",
                version = "1.0.0",
                description = "JavaScript/TypeScript linter",
                author = "CodeFlow",
                category = ExtensionCategory.LINTER
            ),
            state = ExtensionState.INSTALLED,
            rating = 4.7f,
            downloadCount = 45000
        )
    )

    private fun createThemeExtension(id: String, name: String, author: String, desc: String): Extension {
        return Extension(
            manifest = ExtensionManifest(
                id = id, name = id, displayName = name, version = "1.0.0",
                description = desc, author = author, category = ExtensionCategory.THEME,
                contributes = ExtensionContributions(themes = listOf(ThemeContribution(label = name)))
            ),
            state = ExtensionState.INSTALLED,
            rating = (4.0f + (id.hashCode() % 10) * 0.1f).coerceIn(3.5f, 5.0f),
            downloadCount = 10000 + (id.hashCode() % 90000)
        )
    }

    private fun createLanguageExtension(
        id: String, name: String, author: String, desc: String,
        extensions: List<String>, aliases: List<String>
    ): Extension {
        return Extension(
            manifest = ExtensionManifest(
                id = id, name = id, displayName = name, version = "1.0.0",
                description = desc, author = author, category = ExtensionCategory.LANGUAGE,
                contributes = ExtensionContributions(
                    languages = listOf(LanguageContribution(id = id, extensions = extensions, aliases = aliases))
                )
            ),
            state = ExtensionState.INSTALLED,
            rating = (4.2f + (id.hashCode() % 8) * 0.1f).coerceIn(3.5f, 5.0f),
            downloadCount = 20000 + (id.hashCode() % 80000)
        )
    }
}
