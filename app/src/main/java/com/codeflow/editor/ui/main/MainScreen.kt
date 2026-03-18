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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Undo
import androidx.compose.material.icons.automirrored.filled.Redo
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Save
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
import com.codeflow.editor.ui.components.CreateFileDialog
import com.codeflow.editor.ui.components.DeleteConfirmDialog
import com.codeflow.editor.ui.components.EditorTabBar
import com.codeflow.editor.ui.components.RenameDialog
import com.codeflow.editor.ui.components.StatusBar
import com.codeflow.editor.ui.components.SymbolToolbar
import com.codeflow.editor.ui.editor.CodeEditorView
import com.codeflow.editor.ui.explorer.FileExplorerPanel
import com.codeflow.editor.ui.theme.EditorTheme
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: MainViewModel = hiltViewModel()
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
            val docFile = DocumentFile.fromTreeUri(context, it)
            val path = getPathFromUri(context, it)
            if (path != null) {
                viewModel.openDirectory(File(path))
            }
        }
    }

    val activeTab = tabs.find { it.id == activeTabId }
    val lineCount = activeTab?.content?.lines()?.size ?: 0

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
                    IconButton(onClick = { viewModel.saveActiveTab() }) {
                        Icon(
                            Icons.Default.Save,
                            contentDescription = "Kaydet",
                            tint = colors.editorForeground
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
                            onClick = {
                                viewModel.updateFontSize(1f)
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Yazı Küçült") },
                            leadingIcon = { Icon(Icons.Default.TextDecrease, null) },
                            onClick = {
                                viewModel.updateFontSize(-1f)
                            }
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
                            // Symbol insertion will be handled via editor reference
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
            // Sidebar
            AnimatedVisibility(
                visible = isSidebarVisible,
                enter = slideInHorizontally(),
                exit = slideOutHorizontally(targetOffsetX = { -it })
            ) {
                Row {
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
                    // Sidebar border
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .width(1.dp)
                            .background(colors.border)
                    )
                }
            }

            // Editor Area
            Column(modifier = Modifier.fillMaxSize()) {
                if (tabs.isNotEmpty()) {
                    EditorTabBar(
                        tabs = tabs,
                        activeTabId = activeTabId,
                        onTabClick = { viewModel.setActiveTab(it) },
                        onTabClose = { viewModel.closeTab(it) }
                    )
                    HorizontalDivider(color = colors.border, thickness = 1.dp)
                }

                if (activeTab != null) {
                    CodeEditorView(
                        tab = activeTab!!,
                        settings = settings,
                        onContentChange = { content ->
                            activeTabId?.let { viewModel.updateTabContent(it, content) }
                        },
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    WelcomeView(
                        onOpenFolder = { folderPickerLauncher.launch(null) },
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }
        }
    }

    // Dialogs
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
}

@Composable
private fun WelcomeView(
    onOpenFolder: () -> Unit,
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
                text = "Başlamak için bir klasör açın\nveya soldaki dosya gezginini kullanın",
                style = MaterialTheme.typography.bodyMedium,
                color = colors.onSurfaceVariant.copy(alpha = 0.7f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 24.dp)
            )
            androidx.compose.material3.TextButton(
                onClick = onOpenFolder,
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Icon(Icons.Default.FolderOpen, contentDescription = null)
                Text(
                    text = "  Klasör Aç",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        }
    }
}

private fun getPathFromUri(context: android.content.Context, uri: android.net.Uri): String? {
    // Try to resolve the real file path from a tree URI
    val docId = DocumentFile.fromTreeUri(context, uri)?.uri?.lastPathSegment ?: return null

    // Handle "primary:path" format
    if (docId.contains(":")) {
        val parts = docId.split(":")
        val type = parts[0]
        val relativePath = if (parts.size > 1) parts[1] else ""

        return when (type) {
            "primary" -> "/storage/emulated/0/$relativePath"
            "home" -> "/storage/emulated/0/Documents/$relativePath"
            else -> {
                // External SD card or other storage
                "/storage/$type/$relativePath"
            }
        }
    }
    return null
}
