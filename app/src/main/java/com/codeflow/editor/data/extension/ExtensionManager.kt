package com.codeflow.editor.data.extension

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ExtensionManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val extensionsDir: File
        get() = File(context.filesDir, "extensions").also { it.mkdirs() }

    private val _installedExtensions = MutableStateFlow<List<Extension>>(emptyList())
    val installedExtensions: StateFlow<List<Extension>> = _installedExtensions.asStateFlow()

    private val _marketplaceExtensions = MutableStateFlow<List<Extension>>(emptyList())
    val marketplaceExtensions: StateFlow<List<Extension>> = _marketplaceExtensions.asStateFlow()

    init {
        _installedExtensions.value = BuiltInExtensions.getAll().filter {
            it.state == ExtensionState.INSTALLED || it.state == ExtensionState.ENABLED
        }
        _marketplaceExtensions.value = generateMarketplaceExtensions()
    }

    fun getExtension(id: String): Extension? {
        return _installedExtensions.value.find { it.manifest.id == id }
            ?: _marketplaceExtensions.value.find { it.manifest.id == id }
    }

    fun installExtension(extensionId: String) {
        val ext = _marketplaceExtensions.value.find { it.manifest.id == extensionId } ?: return
        val installPath = File(extensionsDir, extensionId)
        installPath.mkdirs()

        val installed = ext.copy(
            state = ExtensionState.INSTALLED,
            installPath = installPath
        )

        _installedExtensions.update { list ->
            if (list.any { it.manifest.id == extensionId }) {
                list.map { if (it.manifest.id == extensionId) installed else it }
            } else {
                list + installed
            }
        }

        _marketplaceExtensions.update { list ->
            list.map { if (it.manifest.id == extensionId) installed else it }
        }
    }

    fun uninstallExtension(extensionId: String) {
        val ext = _installedExtensions.value.find { it.manifest.id == extensionId } ?: return
        ext.installPath?.deleteRecursively()

        _installedExtensions.update { it.filter { e -> e.manifest.id != extensionId } }
        _marketplaceExtensions.update { list ->
            list.map {
                if (it.manifest.id == extensionId) it.copy(state = ExtensionState.NOT_INSTALLED, installPath = null)
                else it
            }
        }
    }

    fun enableExtension(extensionId: String) {
        _installedExtensions.update { list ->
            list.map {
                if (it.manifest.id == extensionId) it.copy(state = ExtensionState.ENABLED) else it
            }
        }
    }

    fun disableExtension(extensionId: String) {
        _installedExtensions.update { list ->
            list.map {
                if (it.manifest.id == extensionId) it.copy(state = ExtensionState.DISABLED) else it
            }
        }
    }

    fun searchMarketplace(query: String): List<Extension> {
        if (query.isBlank()) return _marketplaceExtensions.value
        val lq = query.lowercase()
        return _marketplaceExtensions.value.filter {
            it.manifest.displayName.lowercase().contains(lq) ||
                    it.manifest.description.lowercase().contains(lq) ||
                    it.manifest.category.displayName.lowercase().contains(lq)
        }
    }

    fun getByCategory(category: ExtensionCategory): List<Extension> {
        return _marketplaceExtensions.value.filter { it.manifest.category == category }
    }

    fun getInstalledThemes(): List<Extension> {
        return _installedExtensions.value.filter { it.manifest.category == ExtensionCategory.THEME }
    }

    fun getInstalledLanguages(): List<Extension> {
        return _installedExtensions.value.filter { it.manifest.category == ExtensionCategory.LANGUAGE }
    }

    private fun generateMarketplaceExtensions(): List<Extension> {
        val builtIn = BuiltInExtensions.getAll()
        val additional = listOf(
            createMarketplaceExt("vim-keybindings", "Vim Keybindings", "Vim modal düzenleme modu", ExtensionCategory.KEYBINDING, 4.5f, 35000),
            createMarketplaceExt("emmet-html", "Emmet", "HTML/CSS Emmet kısayolları", ExtensionCategory.SNIPPET, 4.6f, 42000),
            createMarketplaceExt("auto-rename-tag", "Auto Rename Tag", "HTML etiket çifti otomatik yeniden adlandırma", ExtensionCategory.OTHER, 4.4f, 38000),
            createMarketplaceExt("bracket-colorizer", "Bracket Pair Colorizer", "Parantez çifti renklendirme", ExtensionCategory.OTHER, 4.3f, 55000),
            createMarketplaceExt("indent-rainbow", "Indent Rainbow", "Girinti seviyelerini renklendir", ExtensionCategory.OTHER, 4.2f, 28000),
            createMarketplaceExt("path-intellisense", "Path IntelliSense", "Dosya yolu otomatik tamamlama", ExtensionCategory.OTHER, 4.4f, 32000),
            createMarketplaceExt("gitlense", "GitLens", "Gelişmiş Git özelikleri ve blame", ExtensionCategory.GIT, 4.7f, 60000),
            createMarketplaceExt("docker-support", "Docker", "Dockerfile ve Compose desteği", ExtensionCategory.LANGUAGE, 4.3f, 25000),
            createMarketplaceExt("markdown-preview", "Markdown Preview", "Markdown canlı önizleme", ExtensionCategory.OTHER, 4.5f, 40000),
            createMarketplaceExt("code-spell-checker", "Code Spell Checker", "Kod içi yazım denetimi", ExtensionCategory.LINTER, 4.3f, 33000),
            createMarketplaceExt("ai-copilot", "AI Copilot Plus", "Gelişmiş AI kod tamamlama", ExtensionCategory.AI, 4.6f, 48000),
            createMarketplaceExt("tailwindcss", "Tailwind CSS IntelliSense", "TailwindCSS sınıf tamamlama", ExtensionCategory.LANGUAGE, 4.8f, 52000),
            createMarketplaceExt("color-highlight", "Color Highlight", "CSS renk değerlerini vurgula", ExtensionCategory.OTHER, 4.1f, 22000),
            createMarketplaceExt("todo-tree", "Todo Tree", "TODO/FIXME ağaç görünümü", ExtensionCategory.OTHER, 4.4f, 36000),
            createMarketplaceExt("error-lens", "Error Lens", "Hataları satır içi göster", ExtensionCategory.LINTER, 4.6f, 44000)
        )
        return builtIn + additional
    }

    private fun createMarketplaceExt(
        id: String, name: String, desc: String,
        category: ExtensionCategory, rating: Float, downloads: Int
    ): Extension {
        return Extension(
            manifest = ExtensionManifest(
                id = id, name = id, displayName = name, version = "1.0.0",
                description = desc, author = "Community", category = category
            ),
            state = ExtensionState.NOT_INSTALLED,
            rating = rating,
            downloadCount = downloads
        )
    }
}
