package com.codeflow.editor.ui.git

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.automirrored.filled.Undo
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.git.FileStatus
import com.codeflow.editor.data.git.GitFileChange
import com.codeflow.editor.data.git.GitStatus
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun GitPanel(
    gitStatus: GitStatus?,
    isLoading: Boolean,
    isGitRepo: Boolean,
    onRefresh: () -> Unit,
    onStageFile: (String) -> Unit,
    onUnstageFile: (String) -> Unit,
    onStageAll: () -> Unit,
    onCommit: (String) -> Unit,
    onPull: () -> Unit,
    onPush: () -> Unit,
    onDiscardChanges: (String) -> Unit,
    onViewDiff: (String, Boolean) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    var commitMessage by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
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
                text = "KAYNAK KONTROL",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
            IconButton(onClick = onRefresh, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Refresh, "Yenile", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
            IconButton(onClick = onClose, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Close, "Kapat", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
        }

        HorizontalDivider(color = colors.border)

        if (!isGitRepo) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Bu klasör bir Git deposu değil.\nGit deposu açın.",
                    color = colors.onSurfaceVariant,
                    fontSize = 13.sp,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
            }
            return
        }

        val status = gitStatus ?: return

        LazyColumn(modifier = Modifier.weight(1f)) {
            // Branch info
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("⎇", color = colors.accent, fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = status.branch,
                        color = colors.editorForeground,
                        fontSize = 13.sp,
                        modifier = Modifier.weight(1f)
                    )
                    if (status.ahead > 0) {
                        Text("↑${status.ahead}", color = colors.success, fontSize = 11.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                    }
                    if (status.behind > 0) {
                        Text("↓${status.behind}", color = colors.warning, fontSize = 11.sp)
                    }
                }
            }

            // Push / Pull buttons
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    TextButton(onClick = onPull, modifier = Modifier.weight(1f).height(32.dp)) {
                        Icon(Icons.Default.CloudDownload, null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Pull", fontSize = 12.sp)
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    TextButton(onClick = onPush, modifier = Modifier.weight(1f).height(32.dp)) {
                        Icon(Icons.Default.CloudUpload, null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Push", fontSize = 12.sp)
                    }
                }
            }

            // Commit input
            item {
                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)) {
                    BasicTextField(
                        value = commitMessage,
                        onValueChange = { commitMessage = it },
                        textStyle = TextStyle(color = colors.editorForeground, fontSize = 12.sp),
                        cursorBrush = SolidColor(colors.accent),
                        maxLines = 3,
                        decorationBox = { innerTextField ->
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(colors.editorBackground, RoundedCornerShape(4.dp))
                                    .padding(8.dp)
                                    .height(48.dp)
                            ) {
                                if (commitMessage.isEmpty()) {
                                    Text("Commit mesajı...", color = colors.onSurfaceVariant.copy(alpha = 0.4f), fontSize = 12.sp)
                                }
                                innerTextField()
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    TextButton(
                        onClick = {
                            if (commitMessage.isNotBlank()) {
                                onCommit(commitMessage.trim())
                                commitMessage = ""
                            }
                        },
                        enabled = commitMessage.isNotBlank() && status.stagedChanges.isNotEmpty(),
                        modifier = Modifier.fillMaxWidth().height(32.dp)
                    ) {
                        Icon(Icons.Default.Check, null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Commit", fontSize = 12.sp)
                    }
                }
            }

            item { HorizontalDivider(color = colors.border, modifier = Modifier.padding(vertical = 4.dp)) }

            // Staged changes
            if (status.stagedChanges.isNotEmpty()) {
                item {
                    SectionHeader(
                        title = "Hazırlanmış Değişiklikler (${status.stagedChanges.size})",
                        onAction = null
                    )
                }
                items(status.stagedChanges, key = { "staged_${it.relativePath}" }) { change ->
                    GitFileItem(
                        change = change,
                        onStage = null,
                        onUnstage = { onUnstageFile(change.relativePath) },
                        onDiscard = null,
                        onViewDiff = { onViewDiff(change.relativePath, true) }
                    )
                }
            }

            // Unstaged changes
            if (status.unstagedChanges.isNotEmpty()) {
                item {
                    SectionHeader(
                        title = "Değişiklikler (${status.unstagedChanges.size})",
                        onAction = onStageAll
                    )
                }
                items(status.unstagedChanges, key = { "unstaged_${it.relativePath}" }) { change ->
                    GitFileItem(
                        change = change,
                        onStage = { onStageFile(change.relativePath) },
                        onUnstage = null,
                        onDiscard = { onDiscardChanges(change.relativePath) },
                        onViewDiff = { onViewDiff(change.relativePath, false) }
                    )
                }
            }

            // Untracked files
            if (status.untrackedFiles.isNotEmpty()) {
                item {
                    SectionHeader(title = "İzlenmeyen Dosyalar (${status.untrackedFiles.size})", onAction = null)
                }
                items(status.untrackedFiles, key = { "untracked_${it.relativePath}" }) { change ->
                    GitFileItem(
                        change = change,
                        onStage = { onStageFile(change.relativePath) },
                        onUnstage = null,
                        onDiscard = null,
                        onViewDiff = null
                    )
                }
            }

            if (status.isClean) {
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth().padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Değişiklik yok", color = colors.onSurfaceVariant, fontSize = 13.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(title: String, onAction: (() -> Unit)?) {
    val colors = EditorTheme.colors
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, color = colors.onSurfaceVariant, fontSize = 11.sp, modifier = Modifier.weight(1f))
        if (onAction != null) {
            IconButton(onClick = onAction, modifier = Modifier.size(20.dp)) {
                Icon(Icons.Default.Add, "Tümünü Hazırla", tint = colors.onSurfaceVariant, modifier = Modifier.size(14.dp))
            }
        }
    }
}

@Composable
private fun GitFileItem(
    change: GitFileChange,
    onStage: (() -> Unit)?,
    onUnstage: (() -> Unit)?,
    onDiscard: (() -> Unit)?,
    onViewDiff: (() -> Unit)?
) {
    val colors = EditorTheme.colors
    val statusColor = when (change.status) {
        FileStatus.MODIFIED -> Color(0xFFE2C08D)
        FileStatus.ADDED -> Color(0xFF73C991)
        FileStatus.DELETED -> Color(0xFFC74E39)
        FileStatus.RENAMED -> Color(0xFF73C991)
        FileStatus.UNTRACKED -> Color(0xFF73C991)
        FileStatus.CONFLICTED -> Color(0xFFE51400)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = onViewDiff != null, onClick = { onViewDiff?.invoke() })
            .padding(horizontal = 12.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = change.status.symbol,
            color = statusColor,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace,
            modifier = Modifier.width(16.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = change.relativePath,
            color = colors.editorForeground,
            fontSize = 12.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
        )

        if (onStage != null) {
            IconButton(onClick = onStage, modifier = Modifier.size(20.dp)) {
                Icon(Icons.Default.Add, "Hazırla", tint = colors.onSurfaceVariant, modifier = Modifier.size(14.dp))
            }
        }
        if (onUnstage != null) {
            IconButton(onClick = onUnstage, modifier = Modifier.size(20.dp)) {
                Icon(Icons.Default.Remove, "Geri Al", tint = colors.onSurfaceVariant, modifier = Modifier.size(14.dp))
            }
        }
        if (onDiscard != null) {
            IconButton(onClick = onDiscard, modifier = Modifier.size(20.dp)) {
                Icon(Icons.AutoMirrored.Filled.Undo, "İptal", tint = colors.error, modifier = Modifier.size(14.dp))
            }
        }
    }
}
