package com.codeflow.editor.ui.explorer

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.InsertDriveFile
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.CreateNewFolder
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.NoteAdd
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.model.FileNode
import com.codeflow.editor.ui.theme.EditorColors
import com.codeflow.editor.ui.theme.EditorTheme
import java.io.File

@Composable
fun FileExplorerPanel(
    fileTree: FileNode?,
    rootDirectory: File?,
    onFileClick: (File) -> Unit,
    onToggleDirectory: (String) -> Unit,
    onCreateFile: (File, Boolean) -> Unit,
    onRename: (File) -> Unit,
    onDelete: (File) -> Unit,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    Column(
        modifier = modifier
            .fillMaxHeight()
            .width(260.dp)
            .background(colors.sidebarBackground)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(36.dp)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "DOSYA GEZGİNİ",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
            if (rootDirectory != null) {
                IconButton(
                    onClick = { onCreateFile(rootDirectory, false) },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        Icons.Default.NoteAdd,
                        contentDescription = "Yeni Dosya",
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
                IconButton(
                    onClick = { onCreateFile(rootDirectory, true) },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        Icons.Default.CreateNewFolder,
                        contentDescription = "Yeni Klasör",
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
                IconButton(
                    onClick = onRefresh,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(
                        Icons.Default.Refresh,
                        contentDescription = "Yenile",
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }

        HorizontalDivider(color = colors.border, thickness = 1.dp)

        if (fileTree == null) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Klasör açmak için\nmenüyü kullanın",
                    color = colors.onSurfaceVariant,
                    style = MaterialTheme.typography.bodySmall,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
            }
        } else {
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                val flatNodes = flattenFileTree(fileTree)
                items(flatNodes, key = { it.path }) { node ->
                    FileTreeItem(
                        node = node,
                        onFileClick = onFileClick,
                        onToggleDirectory = onToggleDirectory,
                        onCreateFile = onCreateFile,
                        onRename = onRename,
                        onDelete = onDelete
                    )
                }
            }
        }
    }
}

@Composable
private fun FileTreeItem(
    node: FileNode,
    onFileClick: (File) -> Unit,
    onToggleDirectory: (String) -> Unit,
    onCreateFile: (File, Boolean) -> Unit,
    onRename: (File) -> Unit,
    onDelete: (File) -> Unit
) {
    val colors = EditorTheme.colors
    var showContextMenu by remember { mutableStateOf(false) }

    Box {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(28.dp)
                .combinedClickable(
                    onClick = {
                        if (node.isDirectory) {
                            onToggleDirectory(node.path)
                        } else {
                            onFileClick(node.file)
                        }
                    },
                    onLongClick = {
                        showContextMenu = true
                    }
                )
                .padding(start = (16 + node.depth * 16).dp, end = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (node.isDirectory) {
                Icon(
                    imageVector = if (node.isExpanded) Icons.Default.ExpandMore else Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = colors.onSurfaceVariant,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(2.dp))
                Icon(
                    imageVector = if (node.isExpanded) Icons.Default.FolderOpen else Icons.Default.Folder,
                    contentDescription = null,
                    tint = colors.warning,
                    modifier = Modifier.size(16.dp)
                )
            } else {
                Spacer(modifier = Modifier.width(18.dp))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.InsertDriveFile,
                    contentDescription = null,
                    tint = getFileIconColor(node.extension, colors),
                    modifier = Modifier.size(16.dp)
                )
            }
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = node.name,
                style = MaterialTheme.typography.bodySmall,
                color = colors.editorForeground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 13.sp
            )
        }

        DropdownMenu(
            expanded = showContextMenu,
            onDismissRequest = { showContextMenu = false }
        ) {
            if (node.isDirectory) {
                DropdownMenuItem(
                    text = { Text("Yeni Dosya") },
                    onClick = {
                        showContextMenu = false
                        onCreateFile(node.file, false)
                    }
                )
                DropdownMenuItem(
                    text = { Text("Yeni Klasör") },
                    onClick = {
                        showContextMenu = false
                        onCreateFile(node.file, true)
                    }
                )
            }
            DropdownMenuItem(
                text = { Text("Yeniden Adlandır") },
                onClick = {
                    showContextMenu = false
                    onRename(node.file)
                }
            )
            DropdownMenuItem(
                text = { Text("Sil", color = MaterialTheme.colorScheme.error) },
                onClick = {
                    showContextMenu = false
                    onDelete(node.file)
                }
            )
        }
    }
}

private fun getFileIconColor(extension: String, colors: EditorColors): androidx.compose.ui.graphics.Color {
    return when (extension) {
        "kt", "kts" -> androidx.compose.ui.graphics.Color(0xFF7F52FF)
        "java" -> androidx.compose.ui.graphics.Color(0xFFE76F00)
        "js", "mjs" -> androidx.compose.ui.graphics.Color(0xFFF7DF1E)
        "ts", "mts" -> androidx.compose.ui.graphics.Color(0xFF3178C6)
        "py" -> androidx.compose.ui.graphics.Color(0xFF3776AB)
        "html", "htm" -> androidx.compose.ui.graphics.Color(0xFFE34F26)
        "css" -> androidx.compose.ui.graphics.Color(0xFF1572B6)
        "json" -> androidx.compose.ui.graphics.Color(0xFFFBC02D)
        "md" -> colors.accent
        "xml" -> androidx.compose.ui.graphics.Color(0xFFFF6600)
        "yaml", "yml" -> androidx.compose.ui.graphics.Color(0xFFCB171E)
        "sh", "bash" -> androidx.compose.ui.graphics.Color(0xFF4EAA25)
        "rs" -> androidx.compose.ui.graphics.Color(0xFFDEA584)
        "go" -> androidx.compose.ui.graphics.Color(0xFF00ADD8)
        "swift" -> androidx.compose.ui.graphics.Color(0xFFFA7343)
        "dart" -> androidx.compose.ui.graphics.Color(0xFF0175C2)
        "c", "h" -> androidx.compose.ui.graphics.Color(0xFF555555)
        "cpp", "hpp" -> androidx.compose.ui.graphics.Color(0xFF00599C)
        else -> colors.onSurfaceVariant
    }
}

private fun flattenFileTree(node: FileNode): List<FileNode> {
    val result = mutableListOf<FileNode>()
    for (child in node.children) {
        result.add(child)
        if (child.isDirectory && child.isExpanded) {
            result.addAll(flattenFileTree(child))
        }
    }
    return result
}
