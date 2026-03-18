package com.codeflow.editor.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FindReplace
import androidx.compose.material.icons.filled.TextFormat
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun FindReplaceBar(
    visible: Boolean,
    searchQuery: String,
    replaceQuery: String,
    matchCount: Int,
    currentMatch: Int,
    isCaseSensitive: Boolean,
    isWholeWord: Boolean,
    isRegex: Boolean,
    showReplace: Boolean,
    onSearchQueryChange: (String) -> Unit,
    onReplaceQueryChange: (String) -> Unit,
    onFindNext: () -> Unit,
    onFindPrevious: () -> Unit,
    onReplace: () -> Unit,
    onReplaceAll: () -> Unit,
    onToggleCaseSensitive: () -> Unit,
    onToggleWholeWord: () -> Unit,
    onToggleRegex: () -> Unit,
    onToggleReplace: () -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    AnimatedVisibility(
        visible = visible,
        enter = expandVertically(),
        exit = shrinkVertically(),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.sidebarBackground)
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            // Search row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onToggleReplace,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        Icons.Default.FindReplace,
                        contentDescription = "Değiştir",
                        tint = if (showReplace) colors.accent else colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }

                SearchInputField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    placeholder = "Ara",
                    modifier = Modifier.weight(1f)
                )

                Spacer(modifier = Modifier.width(4.dp))

                // Toggle buttons
                ToggleIconButton(
                    active = isCaseSensitive,
                    onClick = onToggleCaseSensitive,
                    icon = { Icon(Icons.Default.TextFormat, "Büyük/Küçük Harf", Modifier.size(14.dp)) }
                )
                ToggleIconButton(
                    active = isWholeWord,
                    onClick = onToggleWholeWord,
                    icon = {
                        Text(
                            "ab",
                            fontSize = 10.sp,
                            color = if (isWholeWord) colors.accent else colors.onSurfaceVariant
                        )
                    }
                )
                ToggleIconButton(
                    active = isRegex,
                    onClick = onToggleRegex,
                    icon = {
                        Text(
                            ".*",
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            color = if (isRegex) colors.accent else colors.onSurfaceVariant
                        )
                    }
                )

                Spacer(modifier = Modifier.width(4.dp))

                // Match count
                Text(
                    text = if (matchCount > 0) "$currentMatch/$matchCount" else "Sonuç yok",
                    style = MaterialTheme.typography.labelSmall,
                    color = colors.onSurfaceVariant,
                    modifier = Modifier.width(60.dp)
                )

                // Navigation buttons
                IconButton(
                    onClick = onFindPrevious,
                    modifier = Modifier.size(28.dp),
                    enabled = matchCount > 0
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Önceki",
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }
                IconButton(
                    onClick = onFindNext,
                    modifier = Modifier.size(28.dp),
                    enabled = matchCount > 0
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "Sonraki",
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }

                IconButton(
                    onClick = onClose,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = "Kapat",
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            // Replace row
            AnimatedVisibility(visible = showReplace) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Spacer(modifier = Modifier.width(28.dp))

                    SearchInputField(
                        value = replaceQuery,
                        onValueChange = onReplaceQueryChange,
                        placeholder = "Değiştir",
                        modifier = Modifier.weight(1f)
                    )

                    Spacer(modifier = Modifier.width(4.dp))

                    TextButton(
                        onClick = onReplace,
                        enabled = matchCount > 0,
                        modifier = Modifier.height(28.dp)
                    ) {
                        Text("Değiştir", fontSize = 11.sp)
                    }

                    TextButton(
                        onClick = onReplaceAll,
                        enabled = matchCount > 0,
                        modifier = Modifier.height(28.dp)
                    ) {
                        Text("Tümü", fontSize = 11.sp)
                    }
                }
            }

            HorizontalDivider(color = colors.border, thickness = 1.dp, modifier = Modifier.padding(top = 4.dp))
        }
    }
}

@Composable
private fun SearchInputField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        singleLine = true,
        textStyle = TextStyle(
            color = colors.editorForeground,
            fontSize = 13.sp,
            fontFamily = FontFamily.Monospace
        ),
        cursorBrush = SolidColor(colors.accent),
        decorationBox = { innerTextField ->
            Row(
                modifier = Modifier
                    .background(colors.editorBackground, RoundedCornerShape(4.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
                    .height(24.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (value.isEmpty()) {
                    Text(
                        text = placeholder,
                        style = TextStyle(
                            color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                            fontSize = 13.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    )
                }
                innerTextField()
            }
        },
        modifier = modifier
    )
}

@Composable
private fun ToggleIconButton(
    active: Boolean,
    onClick: () -> Unit,
    icon: @Composable () -> Unit
) {
    val colors = EditorTheme.colors
    IconButton(
        onClick = onClick,
        modifier = Modifier.size(24.dp),
        colors = IconButtonDefaults.iconButtonColors(
            containerColor = if (active) colors.accent.copy(alpha = 0.2f)
            else androidx.compose.ui.graphics.Color.Transparent
        )
    ) {
        icon()
    }
}
