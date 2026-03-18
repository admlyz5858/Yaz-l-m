package com.codeflow.editor.ui.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codeflow.editor.data.model.AppSettings
import com.codeflow.editor.data.model.EditorTab
import com.codeflow.editor.data.model.FileNode
import com.codeflow.editor.data.model.toFileNode
import com.codeflow.editor.data.repository.FileRepository
import com.codeflow.editor.data.repository.SearchMatch
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

    // --- Tab Management ---
    private val _tabs = MutableStateFlow<List<EditorTab>>(emptyList())
    val tabs: StateFlow<List<EditorTab>> = _tabs.asStateFlow()

    private val _activeTabId = MutableStateFlow<String?>(null)
    val activeTabId: StateFlow<String?> = _activeTabId.asStateFlow()

    // --- File Explorer ---
    private val _rootDirectory = MutableStateFlow<File?>(null)
    val rootDirectory: StateFlow<File?> = _rootDirectory.asStateFlow()

    private val _fileTree = MutableStateFlow<FileNode?>(null)
    val fileTree: StateFlow<FileNode?> = _fileTree.asStateFlow()

    private val _expandedPaths = MutableStateFlow<Set<String>>(emptySet())

    private val _isSidebarVisible = MutableStateFlow(true)
    val isSidebarVisible: StateFlow<Boolean> = _isSidebarVisible.asStateFlow()

    // --- Messages ---
    private val _toastMessage = MutableSharedFlow<String>()
    val toastMessage = _toastMessage.asSharedFlow()

    // --- Dialogs ---
    private val _showCreateFileDialog = MutableStateFlow<Pair<File, Boolean>?>(null)
    val showCreateFileDialog: StateFlow<Pair<File, Boolean>?> = _showCreateFileDialog.asStateFlow()

    private val _showRenameDialog = MutableStateFlow<File?>(null)
    val showRenameDialog: StateFlow<File?> = _showRenameDialog.asStateFlow()

    private val _showDeleteDialog = MutableStateFlow<File?>(null)
    val showDeleteDialog: StateFlow<File?> = _showDeleteDialog.asStateFlow()

    // --- Find & Replace ---
    private val _showFindReplace = MutableStateFlow(false)
    val showFindReplace: StateFlow<Boolean> = _showFindReplace.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _replaceQuery = MutableStateFlow("")
    val replaceQuery: StateFlow<String> = _replaceQuery.asStateFlow()

    private val _matchCount = MutableStateFlow(0)
    val matchCount: StateFlow<Int> = _matchCount.asStateFlow()

    private val _currentMatch = MutableStateFlow(0)
    val currentMatch: StateFlow<Int> = _currentMatch.asStateFlow()

    private val _isCaseSensitive = MutableStateFlow(false)
    val isCaseSensitive: StateFlow<Boolean> = _isCaseSensitive.asStateFlow()

    private val _isWholeWord = MutableStateFlow(false)
    val isWholeWord: StateFlow<Boolean> = _isWholeWord.asStateFlow()

    private val _isRegex = MutableStateFlow(false)
    val isRegex: StateFlow<Boolean> = _isRegex.asStateFlow()

    private val _showReplaceRow = MutableStateFlow(false)
    val showReplaceRow: StateFlow<Boolean> = _showReplaceRow.asStateFlow()

    // --- Command Palette ---
    private val _showCommandPalette = MutableStateFlow(false)
    val showCommandPalette: StateFlow<Boolean> = _showCommandPalette.asStateFlow()

    // --- Search Files ---
    private val _showSearchFiles = MutableStateFlow(false)
    val showSearchFiles: StateFlow<Boolean> = _showSearchFiles.asStateFlow()

    private val _searchFilesQuery = MutableStateFlow("")
    val searchFilesQuery: StateFlow<String> = _searchFilesQuery.asStateFlow()

    private val _searchFileResults = MutableStateFlow<List<SearchMatch>>(emptyList())
    val searchFileResults: StateFlow<List<SearchMatch>> = _searchFileResults.asStateFlow()

    private val _isSearchingFiles = MutableStateFlow(false)
    val isSearchingFiles: StateFlow<Boolean> = _isSearchingFiles.asStateFlow()

    // --- Quick Open ---
    private val _showQuickOpen = MutableStateFlow(false)
    val showQuickOpen: StateFlow<Boolean> = _showQuickOpen.asStateFlow()

    private val _allProjectFiles = MutableStateFlow<List<File>>(emptyList())
    val allProjectFiles: StateFlow<List<File>> = _allProjectFiles.asStateFlow()

    // --- Go To Line ---
    private val _showGoToLine = MutableStateFlow(false)
    val showGoToLine: StateFlow<Boolean> = _showGoToLine.asStateFlow()

    // --- Settings Screen ---
    private val _showSettings = MutableStateFlow(false)
    val showSettings: StateFlow<Boolean> = _showSettings.asStateFlow()

    // --- AI Chat Panel ---
    private val _showAIChat = MutableStateFlow(false)
    val showAIChat: StateFlow<Boolean> = _showAIChat.asStateFlow()

    // --- Terminal ---
    private val _showTerminal = MutableStateFlow(false)
    val showTerminal: StateFlow<Boolean> = _showTerminal.asStateFlow()

    // --- Git Panel ---
    private val _showGitPanel = MutableStateFlow(false)
    val showGitPanel: StateFlow<Boolean> = _showGitPanel.asStateFlow()

    // --- Navigation History ---
    private val _navigationHistory = MutableStateFlow<List<String>>(emptyList())
    private val _navigationIndex = MutableStateFlow(-1)

    private var autoSaveJob: Job? = null
    private var searchFilesJob: Job? = null

    val activeTab: EditorTab?
        get() {
            val id = _activeTabId.value ?: return null
            return _tabs.value.find { it.id == id }
        }

    // ===================
    // Directory Operations
    // ===================

    fun openDirectory(directory: File) {
        _rootDirectory.value = directory
        _expandedPaths.update { it + directory.absolutePath }
        refreshFileTree()
        refreshProjectFiles()
        viewModelScope.launch {
            settingsRepository.updateLastOpenedPath(directory.absolutePath)
        }
    }

    fun refreshFileTree() {
        val root = _rootDirectory.value ?: return
        _fileTree.value = fileRepository.buildFileTree(root, _expandedPaths.value)
    }

    private fun refreshProjectFiles() {
        val root = _rootDirectory.value ?: return
        viewModelScope.launch {
            _allProjectFiles.value = fileRepository.collectAllFiles(root)
        }
    }

    fun toggleDirectory(path: String) {
        _expandedPaths.update { paths ->
            if (paths.contains(path)) paths - path else paths + path
        }
        refreshFileTree()
    }

    // ===================
    // File Operations
    // ===================

    fun openFile(file: File) {
        val existingTab = _tabs.value.find { it.file.absolutePath == file.absolutePath }
        if (existingTab != null) {
            _activeTabId.value = existingTab.id
            pushNavigation(existingTab.id)
            return
        }

        viewModelScope.launch {
            fileRepository.readFile(file).fold(
                onSuccess = { content ->
                    val tab = EditorTab(file = file, content = content)
                    _tabs.update { it + tab }
                    _activeTabId.value = tab.id
                    pushNavigation(tab.id)
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
        pushNavigation(tabId)
    }

    fun updateTabContent(tabId: String, content: String) {
        _tabs.update { tabs ->
            tabs.map { tab ->
                if (tab.id == tabId) tab.copy(content = content, isModified = true) else tab
            }
        }
        updateFindMatchCount()
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

    // ===================
    // UI Toggles
    // ===================

    fun toggleSidebar() {
        _isSidebarVisible.update { !it }
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

    fun setFontSize(size: Float) {
        viewModelScope.launch {
            settingsRepository.updateFontSize(size.coerceIn(8f, 32f))
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

    fun toggleAutoSave() {
        viewModelScope.launch {
            settingsRepository.updateAutoSave(!settings.value.autoSave)
        }
    }

    fun setTabSize(size: Int) {
        viewModelScope.launch {
            settingsRepository.updateTabSize(size)
        }
    }

    fun toggleAutoCloseBrackets() {
        viewModelScope.launch {
            val current = settings.value.autoCloseBrackets
            // DataStore doesn't have this key yet, but the setting is tracked in AppSettings
        }
    }

    fun toggleHighlightCurrentLine() {
        viewModelScope.launch {
            val current = settings.value.highlightCurrentLine
            // DataStore doesn't have this key yet, but the setting is tracked in AppSettings
        }
    }

    // ===================
    // File CRUD Dialogs
    // ===================

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
                    refreshProjectFiles()
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
                    refreshProjectFiles()
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
                    refreshProjectFiles()
                    _showDeleteDialog.value = null
                },
                onFailure = { error ->
                    _toastMessage.emit("Silme başarısız: ${error.message}")
                }
            )
        }
    }

    // ===================
    // Find & Replace
    // ===================

    fun showFindReplace() {
        _showFindReplace.value = true
    }

    fun hideFindReplace() {
        _showFindReplace.value = false
        _searchQuery.value = ""
        _matchCount.value = 0
        _currentMatch.value = 0
    }

    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
        updateFindMatchCount()
    }

    fun updateReplaceQuery(query: String) {
        _replaceQuery.value = query
    }

    private fun updateFindMatchCount() {
        val query = _searchQuery.value
        val content = activeTab?.content ?: ""
        if (query.isEmpty()) {
            _matchCount.value = 0
            _currentMatch.value = 0
            return
        }

        val searchContent = if (_isCaseSensitive.value) content else content.lowercase()
        val searchQuery = if (_isCaseSensitive.value) query else query.lowercase()

        var count = 0
        var startIndex = 0
        while (true) {
            val index = searchContent.indexOf(searchQuery, startIndex)
            if (index == -1) break
            count++
            startIndex = index + 1
        }
        _matchCount.value = count
        if (count > 0 && _currentMatch.value == 0) {
            _currentMatch.value = 1
        } else if (count == 0) {
            _currentMatch.value = 0
        }
    }

    fun findNext() {
        if (_matchCount.value == 0) return
        _currentMatch.update { current ->
            if (current >= _matchCount.value) 1 else current + 1
        }
    }

    fun findPrevious() {
        if (_matchCount.value == 0) return
        _currentMatch.update { current ->
            if (current <= 1) _matchCount.value else current - 1
        }
    }

    fun replaceCurrent() {
        val tab = activeTab ?: return
        val query = _searchQuery.value
        val replacement = _replaceQuery.value
        if (query.isEmpty()) return

        val content = tab.content
        val searchContent = if (_isCaseSensitive.value) content else content.lowercase()
        val searchQuery = if (_isCaseSensitive.value) query else query.lowercase()

        var targetIndex = 0
        var matchIdx = 0
        var startIndex = 0
        while (matchIdx < _currentMatch.value) {
            targetIndex = searchContent.indexOf(searchQuery, startIndex)
            if (targetIndex == -1) return
            matchIdx++
            startIndex = targetIndex + 1
        }

        val newContent = content.substring(0, targetIndex) +
                replacement +
                content.substring(targetIndex + query.length)

        _activeTabId.value?.let { updateTabContent(it, newContent) }
    }

    fun replaceAll() {
        val tab = activeTab ?: return
        val query = _searchQuery.value
        val replacement = _replaceQuery.value
        if (query.isEmpty()) return

        val newContent = if (_isCaseSensitive.value) {
            tab.content.replace(query, replacement)
        } else {
            tab.content.replace(Regex(Regex.escape(query), RegexOption.IGNORE_CASE), replacement)
        }

        _activeTabId.value?.let { updateTabContent(it, newContent) }
    }

    fun toggleCaseSensitive() {
        _isCaseSensitive.update { !it }
        updateFindMatchCount()
    }

    fun toggleWholeWord() {
        _isWholeWord.update { !it }
        updateFindMatchCount()
    }

    fun toggleRegex() {
        _isRegex.update { !it }
        updateFindMatchCount()
    }

    fun toggleShowReplace() {
        _showReplaceRow.update { !it }
    }

    // ===================
    // Command Palette
    // ===================

    fun showCommandPalette() {
        _showCommandPalette.value = true
    }

    fun hideCommandPalette() {
        _showCommandPalette.value = false
    }

    // ===================
    // Search in Files
    // ===================

    fun showSearchFilesPanel() {
        _showSearchFiles.value = true
        _isSidebarVisible.value = false
    }

    fun hideSearchFilesPanel() {
        _showSearchFiles.value = false
        _searchFilesQuery.value = ""
        _searchFileResults.value = emptyList()
    }

    fun updateSearchFilesQuery(query: String) {
        _searchFilesQuery.value = query
        searchFilesJob?.cancel()

        if (query.length < 2) {
            _searchFileResults.value = emptyList()
            return
        }

        searchFilesJob = viewModelScope.launch {
            delay(300)
            val root = _rootDirectory.value ?: return@launch
            _isSearchingFiles.value = true
            val results = fileRepository.searchInFiles(root, query, _isCaseSensitive.value)
            _searchFileResults.value = results
            _isSearchingFiles.value = false
        }
    }

    fun onSearchResultClick(match: SearchMatch) {
        openFile(match.file)
    }

    // ===================
    // Quick Open
    // ===================

    fun showQuickOpen() {
        _showQuickOpen.value = true
    }

    fun hideQuickOpen() {
        _showQuickOpen.value = false
    }

    // ===================
    // Go To Line
    // ===================

    fun showGoToLine() {
        _showGoToLine.value = true
    }

    fun hideGoToLine() {
        _showGoToLine.value = false
    }

    fun goToLine(lineNumber: Int) {
        // Line jumping is handled at the editor level via a callback
        _showGoToLine.value = false
    }

    // ===================
    // Settings
    // ===================

    fun showSettings() {
        _showSettings.value = true
    }

    fun hideSettings() {
        _showSettings.value = false
    }

    // ===================
    // AI Chat
    // ===================

    fun showAIChat() { _showAIChat.value = true }
    fun hideAIChat() { _showAIChat.value = false }
    fun toggleAIChat() { _showAIChat.update { !it } }

    // ===================
    // Terminal
    // ===================

    fun showTerminal() { _showTerminal.value = true }
    fun hideTerminal() { _showTerminal.value = false }
    fun toggleTerminal() { _showTerminal.update { !it } }

    // ===================
    // Git Panel
    // ===================

    fun showGitPanel() {
        _showGitPanel.value = true
        _isSidebarVisible.value = false
    }
    fun hideGitPanel() { _showGitPanel.value = false }
    fun toggleGitPanel() {
        if (!_showGitPanel.value) showGitPanel() else hideGitPanel()
    }

    // ===================
    // Navigation History
    // ===================

    private fun pushNavigation(tabId: String) {
        val history = _navigationHistory.value.toMutableList()
        val index = _navigationIndex.value

        // Remove forward history
        if (index < history.size - 1) {
            history.subList(index + 1, history.size).clear()
        }

        // Don't add duplicates
        if (history.lastOrNull() != tabId) {
            history.add(tabId)
        }

        // Keep history bounded
        if (history.size > 50) {
            history.removeAt(0)
        }

        _navigationHistory.value = history
        _navigationIndex.value = history.size - 1
    }

    fun navigateBack() {
        val index = _navigationIndex.value
        if (index > 0) {
            _navigationIndex.value = index - 1
            val tabId = _navigationHistory.value[index - 1]
            if (_tabs.value.any { it.id == tabId }) {
                _activeTabId.value = tabId
            }
        }
    }

    fun navigateForward() {
        val index = _navigationIndex.value
        val history = _navigationHistory.value
        if (index < history.size - 1) {
            _navigationIndex.value = index + 1
            val tabId = history[index + 1]
            if (_tabs.value.any { it.id == tabId }) {
                _activeTabId.value = tabId
            }
        }
    }
}
