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
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.ui.theme.EditorTheme
import java.io.File

data class SearchResult(
    val file: File,
    val lineNumber: Int,
    val lineContent: String,
    val matchStart: Int,
    val matchEnd: Int
)

@Composable
fun SearchFilesPanel(
    visible: Boolean,
    searchQuery: String,
    results: List<SearchResult>,
    isSearching: Boolean,
    onSearchQueryChange: (String) -> Unit,
    onResultClick: (SearchResult) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (!visible) return

    val colors = EditorTheme.colors

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(colors.sidebarBackground)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "DOSYALARDA ARA",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
            IconButton(
                onClick = onClose,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Kapat",
                    tint = colors.onSurfaceVariant,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        // Search input
        BasicTextField(
            value = searchQuery,
            onValueChange = onSearchQueryChange,
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
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp)
                        .background(colors.editorBackground, RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Search,
                        contentDescription = null,
                        tint = colors.onSurfaceVariant,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box {
                        if (searchQuery.isEmpty()) {
                            Text(
                                text = "Ara...",
                                color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                                fontSize = 13.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        innerTextField()
                    }
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(4.dp))

        // Result count
        if (searchQuery.isNotEmpty()) {
            Text(
                text = if (isSearching) "Aranıyor..." else "${results.size} sonuç bulundu",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 2.dp)
            )
        }

        HorizontalDivider(color = colors.border)

        // Results
        LazyColumn(modifier = Modifier.fillMaxSize()) {
            val groupedResults = results.groupBy { it.file.absolutePath }
            groupedResults.forEach { (filePath, fileResults) ->
                item(key = "header_$filePath") {
                    Text(
                        text = fileResults.first().file.name,
                        style = MaterialTheme.typography.bodySmall,
                        color = colors.accent,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                    )
                }
                items(fileResults, key = { "${it.file.absolutePath}:${it.lineNumber}:${it.matchStart}" }) { result ->
                    SearchResultItem(
                        result = result,
                        searchQuery = searchQuery,
                        onClick = { onResultClick(result) }
                    )
                }
            }
        }
    }
}

@Composable
private fun SearchResultItem(
    result: SearchResult,
    searchQuery: String,
    onClick: () -> Unit
) {
    val colors = EditorTheme.colors
    val lineText = result.lineContent.trim()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "${result.lineNumber}",
            color = colors.onSurfaceVariant.copy(alpha = 0.5f),
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace,
            modifier = Modifier.width(36.dp)
        )

        Text(
            text = buildAnnotatedString {
                val lowerLine = lineText.lowercase()
                val lowerQuery = searchQuery.lowercase()
                var startIndex = 0

                while (true) {
                    val matchIndex = lowerLine.indexOf(lowerQuery, startIndex)
                    if (matchIndex == -1) {
                        append(lineText.substring(startIndex))
                        break
                    }
                    append(lineText.substring(startIndex, matchIndex))
                    withStyle(
                        SpanStyle(
                            background = colors.accent.copy(alpha = 0.3f),
                            color = colors.editorForeground
                        )
                    ) {
                        append(lineText.substring(matchIndex, matchIndex + searchQuery.length))
                    }
                    startIndex = matchIndex + searchQuery.length
                }
            },
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace,
            color = colors.editorForeground,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
