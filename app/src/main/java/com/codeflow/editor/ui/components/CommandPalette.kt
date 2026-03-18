package com.codeflow.editor.ui.components

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
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.FindReplace
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.FormatLineSpacing
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Numbers
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.TextDecrease
import androidx.compose.material.icons.filled.TextIncrease
import androidx.compose.material.icons.filled.WrapText
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.codeflow.editor.ui.theme.EditorTheme

data class Command(
    val id: String,
    val title: String,
    val subtitle: String = "",
    val icon: ImageVector? = null,
    val category: String = "",
    val action: () -> Unit
)

@Composable
fun CommandPalette(
    visible: Boolean,
    commands: List<Command>,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (!visible) return

    val colors = EditorTheme.colors
    var query by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }

    val filteredCommands = remember(query, commands) {
        if (query.isBlank()) {
            commands
        } else {
            val lowerQuery = query.lowercase()
            commands.filter { cmd ->
                cmd.title.lowercase().contains(lowerQuery) ||
                        cmd.category.lowercase().contains(lowerQuery) ||
                        cmd.subtitle.lowercase().contains(lowerQuery)
            }
        }
    }

    LaunchedEffect(visible) {
        if (visible) {
            query = ""
            focusRequester.requestFocus()
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.4f))
                .clickable(onClick = onDismiss),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .padding(top = 48.dp, start = 16.dp, end = 16.dp)
                    .fillMaxWidth()
                    .background(colors.sidebarBackground, RoundedCornerShape(8.dp))
                    .clickable(enabled = false, onClick = {})
            ) {
                // Search input
                BasicTextField(
                    value = query,
                    onValueChange = { query = it },
                    singleLine = true,
                    textStyle = TextStyle(
                        color = colors.editorForeground,
                        fontSize = 14.sp,
                        fontFamily = FontFamily.Default
                    ),
                    cursorBrush = SolidColor(colors.accent),
                    decorationBox = { innerTextField ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = null,
                                tint = colors.onSurfaceVariant,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Box {
                                if (query.isEmpty()) {
                                    Text(
                                        text = "Komut ara veya > yazın...",
                                        color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                                        fontSize = 14.sp
                                    )
                                }
                                innerTextField()
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .focusRequester(focusRequester)
                )

                HorizontalDivider(color = colors.border)

                // Command list
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(320.dp)
                ) {
                    items(filteredCommands, key = { it.id }) { command ->
                        CommandItem(
                            command = command,
                            onDismiss = onDismiss
                        )
                    }

                    if (filteredCommands.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(24.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "Eşleşen komut bulunamadı",
                                    color = colors.onSurfaceVariant,
                                    fontSize = 13.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CommandItem(
    command: Command,
    onDismiss: () -> Unit
) {
    val colors = EditorTheme.colors

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable {
                command.action()
                onDismiss()
            }
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (command.icon != null) {
            Icon(
                command.icon,
                contentDescription = null,
                tint = colors.onSurfaceVariant,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
        } else {
            Spacer(modifier = Modifier.width(28.dp))
        }

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = command.title,
                color = colors.editorForeground,
                fontSize = 13.sp
            )
            if (command.subtitle.isNotEmpty()) {
                Text(
                    text = command.subtitle,
                    color = colors.onSurfaceVariant,
                    fontSize = 11.sp
                )
            }
        }

        if (command.category.isNotEmpty()) {
            Text(
                text = command.category,
                color = colors.onSurfaceVariant.copy(alpha = 0.6f),
                fontSize = 10.sp
            )
        }
    }
}

fun buildCommandList(
    onOpenFolder: () -> Unit,
    onSaveFile: () -> Unit,
    onToggleTheme: () -> Unit,
    isDarkTheme: Boolean,
    onToggleWordWrap: () -> Unit,
    wordWrap: Boolean,
    onToggleLineNumbers: () -> Unit,
    showLineNumbers: Boolean,
    onFontIncrease: () -> Unit,
    onFontDecrease: () -> Unit,
    onShowFindReplace: () -> Unit,
    onShowSearchFiles: () -> Unit,
    onGoToLine: () -> Unit,
    onShowSettings: () -> Unit,
    onCloseAllTabs: () -> Unit,
    onToggleSidebar: () -> Unit,
    onShowQuickOpen: () -> Unit
): List<Command> {
    return listOf(
        Command("open_folder", "Klasör Aç", icon = Icons.Default.FolderOpen, category = "Dosya") { onOpenFolder() },
        Command("save", "Kaydet", icon = Icons.Default.Save, category = "Dosya") { onSaveFile() },
        Command("find", "Bul ve Değiştir", icon = Icons.Default.FindReplace, category = "Düzenle") { onShowFindReplace() },
        Command("search_files", "Dosyalarda Ara", icon = Icons.Default.Search, category = "Ara") { onShowSearchFiles() },
        Command("quick_open", "Hızlı Dosya Aç", icon = Icons.Default.Code, category = "Git") { onShowQuickOpen() },
        Command("goto_line", "Satıra Git", icon = Icons.Default.Numbers, category = "Git") { onGoToLine() },
        Command(
            "toggle_theme",
            if (isDarkTheme) "Açık Temaya Geç" else "Koyu Temaya Geç",
            icon = if (isDarkTheme) Icons.Default.LightMode else Icons.Default.DarkMode,
            category = "Görünüm"
        ) { onToggleTheme() },
        Command("font_increase", "Yazı Boyutunu Büyüt", icon = Icons.Default.TextIncrease, category = "Görünüm") { onFontIncrease() },
        Command("font_decrease", "Yazı Boyutunu Küçült", icon = Icons.Default.TextDecrease, category = "Görünüm") { onFontDecrease() },
        Command(
            "toggle_wrap",
            if (wordWrap) "Word Wrap: Kapat" else "Word Wrap: Aç",
            icon = Icons.Default.WrapText,
            category = "Görünüm"
        ) { onToggleWordWrap() },
        Command(
            "toggle_line_numbers",
            if (showLineNumbers) "Satır Numaralarını Gizle" else "Satır Numaralarını Göster",
            icon = Icons.Default.FormatLineSpacing,
            category = "Görünüm"
        ) { onToggleLineNumbers() },
        Command("toggle_sidebar", "Kenar Çubuğunu Aç/Kapat", category = "Görünüm") { onToggleSidebar() },
        Command("settings", "Ayarlar", icon = Icons.Default.Settings, category = "Tercihler") { onShowSettings() },
        Command("close_all", "Tüm Sekmeleri Kapat", category = "Dosya") { onCloseAllTabs() }
    )
}
