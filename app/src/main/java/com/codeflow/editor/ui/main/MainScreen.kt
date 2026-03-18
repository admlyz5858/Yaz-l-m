package com.codeflow.editor.ui.main

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.FindReplace
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material.icons.filled.Source
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material.icons.filled.TextDecrease
import androidx.compose.material.icons.filled.TextIncrease
import androidx.compose.material.icons.filled.WrapText
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.documentfile.provider.DocumentFile
import androidx.hilt.navigation.compose.hiltViewModel
import com.codeflow.editor.ui.components.CommandPalette
import com.codeflow.editor.ui.components.CreateFileDialog
import com.codeflow.editor.ui.components.DeleteConfirmDialog
import com.codeflow.editor.ui.components.EditorTabBar
import com.codeflow.editor.ui.components.FindReplaceBar
import com.codeflow.editor.ui.components.GoToLineDialog
import com.codeflow.editor.ui.components.QuickOpenDialog
import com.codeflow.editor.ui.components.RenameDialog
import com.codeflow.editor.ui.components.SearchFilesPanel
import com.codeflow.editor.ui.components.SearchResult
import com.codeflow.editor.ui.components.StatusBar
import com.codeflow.editor.ui.components.SymbolToolbar
import com.codeflow.editor.ui.components.buildCommandList
import com.codeflow.editor.ui.editor.CodeEditorView
import com.codeflow.editor.ui.explorer.FileExplorerPanel
import com.codeflow.editor.ui.ai.AIChatPanel
import com.codeflow.editor.ui.ai.AIChatViewModel
import com.codeflow.editor.ui.ai.AISettingsSheet
import com.codeflow.editor.ui.ai.InlineEditDialog
import com.codeflow.editor.ui.git.DiffView
import com.codeflow.editor.ui.git.GitPanel
import com.codeflow.editor.ui.git.GitViewModel
import com.codeflow.editor.ui.terminal.TerminalPanel
import com.codeflow.editor.ui.terminal.TerminalViewModel
import com.codeflow.editor.ui.settings.SettingsScreen
import com.codeflow.editor.ui.theme.EditorTheme
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: MainViewModel = hiltViewModel(),
    aiViewModel: AIChatViewModel = hiltViewModel(),
    terminalViewModel: TerminalViewModel = hiltViewModel(),
    gitViewModel: GitViewModel = hiltViewModel()
) {
    val colors = EditorTheme.colors
    val settings by viewModel.settings.collectAsState()
    val tabs by viewModel.tabs.collectAsState()
    val activeTabId by viewModel.activeTabId.collectAsState()
    val fileTree by viewModel.fileTree.collectAsState()
    val rootDirectory by viewModel.rootDirectory.collectAsState()
    val isSidebarVisible by viewModel.isSidebarVisible.collectAsState()
    val showCreateFileDialog by viewModel.showCreateFileDialog.collectAsState()
    val showRenameDialog by viewModel.showRenameDialog.collectAsState()
    val showDeleteDialog by viewModel.showDeleteDialog.collectAsState()

    // AI states
    val showAIChat by viewModel.showAIChat.collectAsState()
    val aiMessages by aiViewModel.messages.collectAsState()
    val aiLoading by aiViewModel.isLoading.collectAsState()
    val aiContext by aiViewModel.currentContext.collectAsState()
    val aiConfig by aiViewModel.aiConfig.collectAsState()
    val aiTokens by aiViewModel.totalTokensUsed.collectAsState()
    val showAISettings by aiViewModel.showAISettings.collectAsState()
    val inlineEditResult by aiViewModel.inlineEditResult.collectAsState()

    // Terminal states
    val showTerminal by viewModel.showTerminal.collectAsState()
    val terminalLines by terminalViewModel.lines.collectAsState()
    val terminalDir by terminalViewModel.currentDir.collectAsState()
    val terminalRunning by terminalViewModel.isRunning.collectAsState()
    val terminalHistory by terminalViewModel.commandHistory.collectAsState()

    // Git states
    val showGitPanel by viewModel.showGitPanel.collectAsState()
    val gitStatus by gitViewModel.gitStatus.collectAsState()
    val isGitRepo by gitViewModel.isGitRepo.collectAsState()
    val gitLoading by gitViewModel.isLoading.collectAsState()
    val currentDiff by gitViewModel.currentDiff.collectAsState()

    // Phase 2 states
    val showFindReplace by viewModel.showFindReplace.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val replaceQuery by viewModel.replaceQuery.collectAsState()
    val matchCount by viewModel.matchCount.collectAsState()
    val currentMatch by viewModel.currentMatch.collectAsState()
    val isCaseSensitive by viewModel.isCaseSensitive.collectAsState()
    val isWholeWord by viewModel.isWholeWord.collectAsState()
    val isRegex by viewModel.isRegex.collectAsState()
    val showReplaceRow by viewModel.showReplaceRow.collectAsState()
    val showCommandPalette by viewModel.showCommandPalette.collectAsState()
    val showSearchFiles by viewModel.showSearchFiles.collectAsState()
    val searchFilesQuery by viewModel.searchFilesQuery.collectAsState()
    val searchFileResults by viewModel.searchFileResults.collectAsState()
    val isSearchingFiles by viewModel.isSearchingFiles.collectAsState()
    val showQuickOpen by viewModel.showQuickOpen.collectAsState()
    val allProjectFiles by viewModel.allProjectFiles.collectAsState()
    val showGoToLine by viewModel.showGoToLine.collectAsState()
    val showSettings by viewModel.showSettings.collectAsState()

    val context = LocalContext.current
    var showOverflowMenu by remember { mutableStateOf(false) }

    val folderPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocumentTree()
    ) { uri ->
        uri?.let {
            context.contentResolver.takePersistableUriPermission(
                it,
                android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION or
                        android.content.Intent.FLAG_GRANT_WRITE_URI_PERMISSION
            )
            val path = getPathFromUri(context, it)
            if (path != null) {
                viewModel.openDirectory(File(path))
            }
        }
    }

    val activeTab = tabs.find { it.id == activeTabId }
    val lineCount = activeTab?.content?.lines()?.size ?: 0

    // Sync rootDirectory to git/terminal
    androidx.compose.runtime.LaunchedEffect(rootDirectory) {
        gitViewModel.setRootDirectory(rootDirectory)
    }

    // Diff View Screen
    if (currentDiff != null) {
        DiffView(
            diff = currentDiff,
            onBack = { gitViewModel.closeDiff() }
        )
        return
    }

    // AI Settings Screen
    if (showAISettings) {
        AISettingsSheet(
            config = aiConfig,
            onBack = { aiViewModel.hideAISettings() },
            onProviderChange = { aiViewModel.updateProvider(it) },
            onModelChange = { aiViewModel.updateModel(it) },
            onApiKeyChange = { provider, key -> aiViewModel.updateApiKey(provider, key) },
            onTemperatureChange = { aiViewModel.updateTemperature(it) }
        )
        return
    }

    // Settings Screen
    if (showSettings) {
        SettingsScreen(
            settings = settings,
            onBack = { viewModel.hideSettings() },
            onToggleDarkTheme = { viewModel.toggleDarkTheme() },
            onFontSizeChange = { viewModel.setFontSize(it) },
            onToggleLineNumbers = { viewModel.toggleLineNumbers() },
            onToggleWordWrap = { viewModel.toggleWordWrap() },
            onToggleAutoSave = { viewModel.toggleAutoSave() },
            onTabSizeChange = { viewModel.setTabSize(it) },
            onToggleAutoCloseBrackets = { viewModel.toggleAutoCloseBrackets() },
            onToggleHighlightCurrentLine = { viewModel.toggleHighlightCurrentLine() }
        )
        return
    }

    // Command list for palette
    val commands = remember(settings) {
        buildCommandList(
            onOpenFolder = { folderPickerLauncher.launch(null) },
            onSaveFile = { viewModel.saveActiveTab() },
            onToggleTheme = { viewModel.toggleDarkTheme() },
            isDarkTheme = settings.isDarkTheme,
            onToggleWordWrap = { viewModel.toggleWordWrap() },
            wordWrap = settings.wordWrap,
            onToggleLineNumbers = { viewModel.toggleLineNumbers() },
            showLineNumbers = settings.showLineNumbers,
            onFontIncrease = { viewModel.updateFontSize(1f) },
            onFontDecrease = { viewModel.updateFontSize(-1f) },
            onShowFindReplace = { viewModel.showFindReplace() },
            onShowSearchFiles = { viewModel.showSearchFilesPanel() },
            onGoToLine = { viewModel.showGoToLine() },
            onShowSettings = { viewModel.showSettings() },
            onCloseAllTabs = { viewModel.closeAllTabs() },
            onToggleSidebar = { viewModel.toggleSidebar() },
            onShowQuickOpen = { viewModel.showQuickOpen() },
            onShowAIChat = { viewModel.showAIChat() },
            onShowAISettings = { aiViewModel.showAISettings() }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = activeTab?.displayTitle ?: "CodeFlow",
                        style = MaterialTheme.typography.titleMedium,
                        color = colors.editorForeground
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { viewModel.toggleSidebar() }) {
                        Icon(
                            Icons.Default.Menu,
                            contentDescription = "Menü",
                            tint = colors.editorForeground
                        )
                    }
                },
                actions = {
                    // Find & Replace
                    IconButton(onClick = { viewModel.showFindReplace() }) {
                        Icon(
                            Icons.Default.FindReplace,
                            contentDescription = "Bul & Değiştir",
                            tint = colors.editorForeground
                        )
                    }
                    // Search in files
                    IconButton(onClick = { viewModel.showSearchFilesPanel() }) {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = "Dosyalarda Ara",
                            tint = colors.editorForeground
                        )
                    }
                    // Save
                    IconButton(onClick = { viewModel.saveActiveTab() }) {
                        Icon(
                            Icons.Default.Save,
                            contentDescription = "Kaydet",
                            tint = colors.editorForeground
                        )
                    }
                    // AI Chat
                    IconButton(onClick = { viewModel.toggleAIChat() }) {
                        Icon(
                            Icons.Default.SmartToy,
                            contentDescription = "AI Asistan",
                            tint = if (showAIChat) colors.accent else colors.editorForeground
                        )
                    }
                    // Git
                    IconButton(onClick = { viewModel.toggleGitPanel() }) {
                        Icon(
                            Icons.Default.Source,
                            contentDescription = "Git",
                            tint = if (showGitPanel) colors.accent else colors.editorForeground
                        )
                    }
                    IconButton(onClick = { showOverflowMenu = true }) {
                        Icon(
                            Icons.Default.MoreVert,
                            contentDescription = "Diğer",
                            tint = colors.editorForeground
                        )
                    }
                    DropdownMenu(
                        expanded = showOverflowMenu,
                        onDismissRequest = { showOverflowMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Klasör Aç") },
                            leadingIcon = { Icon(Icons.Default.FolderOpen, null) },
                            onClick = {
                                showOverflowMenu = false
                                folderPickerLauncher.launch(null)
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Hızlı Dosya Aç") },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.showQuickOpen()
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Satıra Git") },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.showGoToLine()
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Komut Paleti") },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.showCommandPalette()
                            }
                        )
                        HorizontalDivider()
                        DropdownMenuItem(
                            text = { Text(if (showTerminal) "Terminali Kapat" else "Terminal Aç") },
                            leadingIcon = { Icon(Icons.Default.Terminal, null) },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.toggleTerminal()
                                terminalViewModel.ensureSession(rootDirectory?.absolutePath ?: "/storage/emulated/0")
                            }
                        )
                        HorizontalDivider()
                        DropdownMenuItem(
                            text = { Text(if (settings.isDarkTheme) "Açık Tema" else "Koyu Tema") },
                            leadingIcon = {
                                Icon(
                                    if (settings.isDarkTheme) Icons.Default.LightMode
                                    else Icons.Default.DarkMode,
                                    null
                                )
                            },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.toggleDarkTheme()
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Yazı Büyüt") },
                            leadingIcon = { Icon(Icons.Default.TextIncrease, null) },
                            onClick = { viewModel.updateFontSize(1f) }
                        )
                        DropdownMenuItem(
                            text = { Text("Yazı Küçült") },
                            leadingIcon = { Icon(Icons.Default.TextDecrease, null) },
                            onClick = { viewModel.updateFontSize(-1f) }
                        )
                        DropdownMenuItem(
                            text = { Text(if (settings.wordWrap) "Word Wrap: Açık" else "Word Wrap: Kapalı") },
                            leadingIcon = { Icon(Icons.Default.WrapText, null) },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.toggleWordWrap()
                            }
                        )
                        HorizontalDivider()
                        DropdownMenuItem(
                            text = { Text("Ayarlar") },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.showSettings()
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Tüm Sekmeleri Kapat") },
                            onClick = {
                                showOverflowMenu = false
                                viewModel.closeAllTabs()
                            }
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colors.activityBarBackground
                )
            )
        },
        bottomBar = {
            Column {
                if (activeTab != null) {
                    SymbolToolbar(
                        onSymbolClick = { symbol ->
                            // Symbol insertion handled via editor reference
                        }
                    )
                }
                StatusBar(
                    activeTab = activeTab,
                    lineCount = lineCount
                )
            }
        },
        containerColor = colors.editorBackground
    ) { paddingValues ->
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Sidebar - File Explorer, Search Files, or Git Panel
            AnimatedVisibility(
                visible = isSidebarVisible || showSearchFiles || showGitPanel,
                enter = slideInHorizontally(),
                exit = slideOutHorizontally(targetOffsetX = { -it })
            ) {
                Row {
                    if (showGitPanel) {
                        GitPanel(
                            gitStatus = gitStatus,
                            isLoading = gitLoading,
                            isGitRepo = isGitRepo,
                            onRefresh = { gitViewModel.refreshStatus() },
                            onStageFile = { gitViewModel.stageFile(it) },
                            onUnstageFile = { gitViewModel.unstageFile(it) },
                            onStageAll = { gitViewModel.stageAll() },
                            onCommit = { gitViewModel.commit(it) },
                            onPull = { gitViewModel.pull() },
                            onPush = { gitViewModel.push() },
                            onDiscardChanges = { gitViewModel.discardChanges(it) },
                            onViewDiff = { path, staged -> gitViewModel.viewDiff(path, staged) },
                            onClose = { viewModel.hideGitPanel() },
                            modifier = Modifier.width(280.dp)
                        )
                    } else if (showSearchFiles) {
                        SearchFilesPanel(
                            visible = true,
                            searchQuery = searchFilesQuery,
                            results = searchFileResults.map { match ->
                                SearchResult(
                                    file = match.file,
                                    lineNumber = match.lineNumber,
                                    lineContent = match.lineContent,
                                    matchStart = match.matchStart,
                                    matchEnd = match.matchEnd
                                )
                            },
                            isSearching = isSearchingFiles,
                            onSearchQueryChange = { viewModel.updateSearchFilesQuery(it) },
                            onResultClick = { result ->
                                viewModel.onSearchResultClick(
                                    com.codeflow.editor.data.repository.SearchMatch(
                                        file = result.file,
                                        lineNumber = result.lineNumber,
                                        lineContent = result.lineContent,
                                        matchStart = result.matchStart,
                                        matchEnd = result.matchEnd
                                    )
                                )
                            },
                            onClose = { viewModel.hideSearchFilesPanel() },
                            modifier = Modifier.width(280.dp)
                        )
                    } else {
                        FileExplorerPanel(
                            fileTree = fileTree,
                            rootDirectory = rootDirectory,
                            onFileClick = { viewModel.openFile(it) },
                            onToggleDirectory = { viewModel.toggleDirectory(it) },
                            onCreateFile = { parent, isDir ->
                                viewModel.requestCreateFile(parent, isDir)
                            },
                            onRename = { viewModel.requestRename(it) },
                            onDelete = { viewModel.requestDelete(it) },
                            onRefresh = { viewModel.refreshFileTree() }
                        )
                    }
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .width(1.dp)
                            .background(colors.border)
                    )
                }
            }

            // Editor Area
            Column(modifier = Modifier.weight(1f)) {
                // Find & Replace bar
                FindReplaceBar(
                    visible = showFindReplace,
                    searchQuery = searchQuery,
                    replaceQuery = replaceQuery,
                    matchCount = matchCount,
                    currentMatch = currentMatch,
                    isCaseSensitive = isCaseSensitive,
                    isWholeWord = isWholeWord,
                    isRegex = isRegex,
                    showReplace = showReplaceRow,
                    onSearchQueryChange = { viewModel.updateSearchQuery(it) },
                    onReplaceQueryChange = { viewModel.updateReplaceQuery(it) },
                    onFindNext = { viewModel.findNext() },
                    onFindPrevious = { viewModel.findPrevious() },
                    onReplace = { viewModel.replaceCurrent() },
                    onReplaceAll = { viewModel.replaceAll() },
                    onToggleCaseSensitive = { viewModel.toggleCaseSensitive() },
                    onToggleWholeWord = { viewModel.toggleWholeWord() },
                    onToggleRegex = { viewModel.toggleRegex() },
                    onToggleReplace = { viewModel.toggleShowReplace() },
                    onClose = { viewModel.hideFindReplace() }
                )

                // Tab bar
                if (tabs.isNotEmpty()) {
                    EditorTabBar(
                        tabs = tabs,
                        activeTabId = activeTabId,
                        onTabClick = { viewModel.setActiveTab(it) },
                        onTabClose = { viewModel.closeTab(it) }
                    )
                    HorizontalDivider(color = colors.border, thickness = 1.dp)
                }

                // Editor or Welcome
                if (activeTab != null) {
                    CodeEditorView(
                        tab = activeTab!!,
                        settings = settings,
                        onContentChange = { content ->
                            activeTabId?.let { viewModel.updateTabContent(it, content) }
                        },
                        modifier = Modifier.weight(1f)
                    )
                } else {
                    WelcomeView(
                        onOpenFolder = { folderPickerLauncher.launch(null) },
                        onOpenCommandPalette = { viewModel.showCommandPalette() },
                        modifier = Modifier.weight(1f)
                    )
                }

                // Terminal Panel (bottom)
                AnimatedVisibility(visible = showTerminal) {
                    Column {
                        HorizontalDivider(color = colors.border)
                        TerminalPanel(
                            lines = terminalLines,
                            currentDir = terminalDir,
                            isRunning = terminalRunning,
                            commandHistory = terminalHistory,
                            onExecuteCommand = { terminalViewModel.executeCommand(it) },
                            onCancelProcess = { terminalViewModel.cancelProcess() },
                            onClear = { terminalViewModel.clearTerminal() },
                            onClose = { viewModel.hideTerminal() },
                            modifier = Modifier.height(200.dp)
                        )
                    }
                }
            }

            // AI Chat Panel (right side)
            AnimatedVisibility(
                visible = showAIChat,
                enter = slideInHorizontally(initialOffsetX = { it }),
                exit = slideOutHorizontally(targetOffsetX = { it })
            ) {
                Row {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .width(1.dp)
                            .background(colors.border)
                    )
                    AIChatPanel(
                        messages = aiMessages,
                        isLoading = aiLoading,
                        currentContext = aiContext,
                        aiConfig = aiConfig,
                        totalTokens = aiTokens,
                        onSendMessage = { aiViewModel.sendMessage(it) },
                        onClearChat = { aiViewModel.clearChat() },
                        onClearContext = { aiViewModel.clearContext() },
                        onShowSettings = { aiViewModel.showAISettings() },
                        onClose = { viewModel.hideAIChat() },
                        modifier = Modifier.width(300.dp)
                    )
                }
            }
        }
    }

    // Inline Edit Dialog
    InlineEditDialog(
        result = inlineEditResult,
        onAccept = { aiViewModel.acceptInlineEdit() },
        onReject = { aiViewModel.rejectInlineEdit() }
    )

    // ===== Dialogs =====

    showCreateFileDialog?.let { (parent, isDir) ->
        CreateFileDialog(
            isDirectory = isDir,
            onConfirm = { name -> viewModel.confirmCreateFile(parent, name, isDir) },
            onDismiss = { viewModel.dismissCreateFileDialog() }
        )
    }

    showRenameDialog?.let { file ->
        RenameDialog(
            currentName = file.name,
            onConfirm = { newName -> viewModel.confirmRename(file, newName) },
            onDismiss = { viewModel.dismissRenameDialog() }
        )
    }

    showDeleteDialog?.let { file ->
        DeleteConfirmDialog(
            fileName = file.name,
            onConfirm = { viewModel.confirmDelete(file) },
            onDismiss = { viewModel.dismissDeleteDialog() }
        )
    }

    // Command Palette
    CommandPalette(
        visible = showCommandPalette,
        commands = commands,
        onDismiss = { viewModel.hideCommandPalette() }
    )

    // Quick Open
    QuickOpenDialog(
        visible = showQuickOpen,
        allFiles = allProjectFiles,
        onFileSelected = { viewModel.openFile(it) },
        onDismiss = { viewModel.hideQuickOpen() }
    )

    // Go To Line
    GoToLineDialog(
        visible = showGoToLine,
        totalLines = lineCount,
        onGoToLine = { viewModel.goToLine(it) },
        onDismiss = { viewModel.hideGoToLine() }
    )
}

@Composable
private fun WelcomeView(
    onOpenFolder: () -> Unit,
    onOpenCommandPalette: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    Box(
        modifier = modifier.background(colors.editorBackground),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "CodeFlow",
                style = MaterialTheme.typography.headlineLarge,
                color = colors.editorForeground.copy(alpha = 0.6f)
            )
            Text(
                text = "Android Kod Editörü",
                style = MaterialTheme.typography.bodyLarge,
                color = colors.onSurfaceVariant,
                modifier = Modifier.padding(top = 8.dp)
            )
            Text(
                text = "Başlamak için bir klasör açın\nveya komut paletini kullanın",
                style = MaterialTheme.typography.bodyMedium,
                color = colors.onSurfaceVariant.copy(alpha = 0.7f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 24.dp)
            )
            Row(modifier = Modifier.padding(top = 16.dp)) {
                TextButton(onClick = onOpenFolder) {
                    Icon(Icons.Default.FolderOpen, contentDescription = null)
                    Text("  Klasör Aç")
                }
                TextButton(onClick = onOpenCommandPalette) {
                    Icon(Icons.Default.Terminal, contentDescription = null)
                    Text("  Komut Paleti")
                }
            }
        }
    }
}

private fun getPathFromUri(context: android.content.Context, uri: android.net.Uri): String? {
    val docId = DocumentFile.fromTreeUri(context, uri)?.uri?.lastPathSegment ?: return null

    if (docId.contains(":")) {
        val parts = docId.split(":")
        val type = parts[0]
        val relativePath = if (parts.size > 1) parts[1] else ""

        return when (type) {
            "primary" -> "/storage/emulated/0/$relativePath"
            "home" -> "/storage/emulated/0/Documents/$relativePath"
            else -> "/storage/$type/$relativePath"
        }
    }
    return null
}
