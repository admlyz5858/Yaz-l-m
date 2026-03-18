package com.codeflow.editor.ui.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codeflow.editor.data.model.AppSettings
import com.codeflow.editor.data.model.EditorTab
import com.codeflow.editor.data.model.FileNode
import com.codeflow.editor.data.model.toFileNode
import com.codeflow.editor.data.repository.FileRepository
import com.codeflow.editor.data.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val fileRepository: FileRepository,
    private val settingsRepository: SettingsRepository
) : ViewModel() {

    val settings: StateFlow<AppSettings> = settingsRepository.settings
        .stateIn(viewModelScope, SharingStarted.Eagerly, AppSettings())

    private val _tabs = MutableStateFlow<List<EditorTab>>(emptyList())
    val tabs: StateFlow<List<EditorTab>> = _tabs.asStateFlow()

    private val _activeTabId = MutableStateFlow<String?>(null)
    val activeTabId: StateFlow<String?> = _activeTabId.asStateFlow()

    private val _rootDirectory = MutableStateFlow<File?>(null)
    val rootDirectory: StateFlow<File?> = _rootDirectory.asStateFlow()

    private val _fileTree = MutableStateFlow<FileNode?>(null)
    val fileTree: StateFlow<FileNode?> = _fileTree.asStateFlow()

    private val _expandedPaths = MutableStateFlow<Set<String>>(emptySet())

    private val _isSidebarVisible = MutableStateFlow(true)
    val isSidebarVisible: StateFlow<Boolean> = _isSidebarVisible.asStateFlow()

    private val _toastMessage = MutableSharedFlow<String>()
    val toastMessage = _toastMessage.asSharedFlow()

    private val _showCreateFileDialog = MutableStateFlow<Pair<File, Boolean>?>(null)
    val showCreateFileDialog: StateFlow<Pair<File, Boolean>?> = _showCreateFileDialog.asStateFlow()

    private val _showRenameDialog = MutableStateFlow<File?>(null)
    val showRenameDialog: StateFlow<File?> = _showRenameDialog.asStateFlow()

    private val _showDeleteDialog = MutableStateFlow<File?>(null)
    val showDeleteDialog: StateFlow<File?> = _showDeleteDialog.asStateFlow()

    private var autoSaveJob: Job? = null

    val activeTab: EditorTab?
        get() {
            val id = _activeTabId.value ?: return null
            return _tabs.value.find { it.id == id }
        }

    fun openDirectory(directory: File) {
        _rootDirectory.value = directory
        _expandedPaths.update { it + directory.absolutePath }
        refreshFileTree()
        viewModelScope.launch {
            settingsRepository.updateLastOpenedPath(directory.absolutePath)
        }
    }

    fun refreshFileTree() {
        val root = _rootDirectory.value ?: return
        _fileTree.value = fileRepository.buildFileTree(root, _expandedPaths.value)
    }

    fun toggleDirectory(path: String) {
        _expandedPaths.update { paths ->
            if (paths.contains(path)) paths - path else paths + path
        }
        refreshFileTree()
    }

    fun openFile(file: File) {
        val existingTab = _tabs.value.find { it.file.absolutePath == file.absolutePath }
        if (existingTab != null) {
            _activeTabId.value = existingTab.id
            return
        }

        viewModelScope.launch {
            fileRepository.readFile(file).fold(
                onSuccess = { content ->
                    val tab = EditorTab(file = file, content = content)
                    _tabs.update { it + tab }
                    _activeTabId.value = tab.id
                },
                onFailure = { error ->
                    _toastMessage.emit("Dosya açılamadı: ${error.message}")
                }
            )
        }
    }

    fun closeTab(tabId: String) {
        val tabIndex = _tabs.value.indexOfFirst { it.id == tabId }
        if (tabIndex == -1) return

        _tabs.update { it.filter { tab -> tab.id != tabId } }

        if (_activeTabId.value == tabId) {
            val newTabs = _tabs.value
            _activeTabId.value = when {
                newTabs.isEmpty() -> null
                tabIndex < newTabs.size -> newTabs[tabIndex].id
                else -> newTabs.last().id
            }
        }
    }

    fun closeAllTabs() {
        _tabs.value = emptyList()
        _activeTabId.value = null
    }

    fun setActiveTab(tabId: String) {
        _activeTabId.value = tabId
    }

    fun updateTabContent(tabId: String, content: String) {
        _tabs.update { tabs ->
            tabs.map { tab ->
                if (tab.id == tabId) tab.copy(content = content, isModified = true) else tab
            }
        }
        if (settings.value.autoSave) {
            scheduleAutoSave(tabId)
        }
    }

    private fun scheduleAutoSave(tabId: String) {
        autoSaveJob?.cancel()
        autoSaveJob = viewModelScope.launch {
            delay(settings.value.autoSaveDelayMs)
            saveTab(tabId)
        }
    }

    fun saveTab(tabId: String) {
        val tab = _tabs.value.find { it.id == tabId } ?: return
        viewModelScope.launch {
            fileRepository.writeFile(tab.file, tab.content).fold(
                onSuccess = {
                    _tabs.update { tabs ->
                        tabs.map { t ->
                            if (t.id == tabId) t.copy(isModified = false) else t
                        }
                    }
                },
                onFailure = { error ->
                    _toastMessage.emit("Kaydetme başarısız: ${error.message}")
                }
            )
        }
    }

    fun saveActiveTab() {
        _activeTabId.value?.let { saveTab(it) }
    }

    fun toggleSidebar() {
        _isSidebarVisible.update { !it }
    }

    fun requestCreateFile(parentDir: File, isDirectory: Boolean) {
        _showCreateFileDialog.value = parentDir to isDirectory
    }

    fun dismissCreateFileDialog() {
        _showCreateFileDialog.value = null
    }

    fun confirmCreateFile(parent: File, name: String, isDirectory: Boolean) {
        viewModelScope.launch {
            val result = if (isDirectory) {
                fileRepository.createFolder(parent, name)
            } else {
                fileRepository.createFile(parent, name)
            }
            result.fold(
                onSuccess = { newFile ->
                    refreshFileTree()
                    if (!isDirectory) {
                        openFile(newFile)
                    }
                    _showCreateFileDialog.value = null
                },
                onFailure = { error ->
                    _toastMessage.emit("Oluşturma başarısız: ${error.message}")
                }
            )
        }
    }

    fun requestRename(file: File) {
        _showRenameDialog.value = file
    }

    fun dismissRenameDialog() {
        _showRenameDialog.value = null
    }

    fun confirmRename(file: File, newName: String) {
        viewModelScope.launch {
            fileRepository.renameFile(file, newName).fold(
                onSuccess = { newFile ->
                    _tabs.update { tabs ->
                        tabs.map { tab ->
                            if (tab.file.absolutePath == file.absolutePath) {
                                tab.copy(file = newFile)
                            } else tab
                        }
                    }
                    refreshFileTree()
                    _showRenameDialog.value = null
                },
                onFailure = { error ->
                    _toastMessage.emit("Yeniden adlandırma başarısız: ${error.message}")
                }
            )
        }
    }

    fun requestDelete(file: File) {
        _showDeleteDialog.value = file
    }

    fun dismissDeleteDialog() {
        _showDeleteDialog.value = null
    }

    fun confirmDelete(file: File) {
        viewModelScope.launch {
            fileRepository.deleteFile(file).fold(
                onSuccess = {
                    _tabs.value
                        .filter { it.file.absolutePath.startsWith(file.absolutePath) }
                        .forEach { closeTab(it.id) }
                    refreshFileTree()
                    _showDeleteDialog.value = null
                },
                onFailure = { error ->
                    _toastMessage.emit("Silme başarısız: ${error.message}")
                }
            )
        }
    }

    fun toggleDarkTheme() {
        viewModelScope.launch {
            settingsRepository.updateDarkTheme(!settings.value.isDarkTheme)
        }
    }

    fun updateFontSize(delta: Float) {
        viewModelScope.launch {
            val newSize = (settings.value.fontSize + delta).coerceIn(8f, 32f)
            settingsRepository.updateFontSize(newSize)
        }
    }

    fun toggleWordWrap() {
        viewModelScope.launch {
            settingsRepository.updateWordWrap(!settings.value.wordWrap)
        }
    }

    fun toggleLineNumbers() {
        viewModelScope.launch {
            settingsRepository.updateShowLineNumbers(!settings.value.showLineNumbers)
        }
    }
}
