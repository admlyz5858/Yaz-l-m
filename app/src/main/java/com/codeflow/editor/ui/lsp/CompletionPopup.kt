package com.codeflow.editor.ui.lsp

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.lsp.CompletionItem
import com.codeflow.editor.data.lsp.CompletionItemKind
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun CompletionPopup(
    items: List<CompletionItem>,
    onSelect: (CompletionItem) -> Unit,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (items.isEmpty()) return

    val colors = EditorTheme.colors

    Box(
        modifier = modifier
            .background(colors.sidebarBackground, RoundedCornerShape(6.dp))
            .width(300.dp)
    ) {
        LazyColumn(
            modifier = Modifier.height((items.size.coerceAtMost(8) * 28).dp)
        ) {
            items(items.take(50), key = { "${it.label}_${it.kind}" }) { item ->
                CompletionItemRow(
                    item = item,
                    onClick = { onSelect(item) }
                )
            }
        }
    }
}

@Composable
private fun CompletionItemRow(
    item: CompletionItem,
    onClick: () -> Unit
) {
    val colors = EditorTheme.colors
    val kindColor = getKindColor(item.kind)

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(28.dp)
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Kind icon
        Box(
            modifier = Modifier
                .size(20.dp)
                .background(kindColor.copy(alpha = 0.15f), RoundedCornerShape(3.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = item.kind.icon,
                color = kindColor,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
        }
        Spacer(modifier = Modifier.width(6.dp))

        // Label
        Text(
            text = item.label,
            color = colors.editorForeground,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
        )

        // Detail
        if (item.detail.isNotBlank()) {
            Text(
                text = item.detail,
                color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                fontSize = 10.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.width(100.dp)
            )
        }
    }
}

@Composable
private fun getKindColor(kind: CompletionItemKind): androidx.compose.ui.graphics.Color {
    return when (kind) {
        CompletionItemKind.METHOD, CompletionItemKind.FUNCTION -> androidx.compose.ui.graphics.Color(0xFF9CDCFE)
        CompletionItemKind.VARIABLE, CompletionItemKind.FIELD -> androidx.compose.ui.graphics.Color(0xFF9CDCFE)
        CompletionItemKind.CLASS, CompletionItemKind.STRUCT -> androidx.compose.ui.graphics.Color(0xFF4EC9B0)
        CompletionItemKind.INTERFACE -> androidx.compose.ui.graphics.Color(0xFF4EC9B0)
        CompletionItemKind.MODULE, CompletionItemKind.PROPERTY -> androidx.compose.ui.graphics.Color(0xFF9CDCFE)
        CompletionItemKind.KEYWORD -> androidx.compose.ui.graphics.Color(0xFF569CD6)
        CompletionItemKind.SNIPPET -> androidx.compose.ui.graphics.Color(0xFFCE9178)
        CompletionItemKind.CONSTANT, CompletionItemKind.ENUM, CompletionItemKind.ENUM_MEMBER -> androidx.compose.ui.graphics.Color(0xFF4FC1FF)
        CompletionItemKind.VALUE, CompletionItemKind.UNIT -> androidx.compose.ui.graphics.Color(0xFFB5CEA8)
        CompletionItemKind.TYPE_PARAMETER -> androidx.compose.ui.graphics.Color(0xFF4EC9B0)
        else -> androidx.compose.ui.graphics.Color(0xFFD4D4D4)
    }
}
