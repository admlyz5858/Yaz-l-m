package com.codeflow.editor.ui.lsp

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.lsp.DocumentSymbol
import com.codeflow.editor.data.lsp.SymbolKind
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun OutlinePanel(
    symbols: List<DocumentSymbol>,
    onSymbolClick: (DocumentSymbol) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(colors.sidebarBackground)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(32.dp)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "OUTLINE",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
            IconButton(onClick = onClose, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Close, "Kapat", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
        }

        HorizontalDivider(color = colors.border)

        if (symbols.isEmpty()) {
            Column(
                modifier = Modifier.fillMaxSize().padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Sembol bulunamadı", color = colors.onSurfaceVariant, fontSize = 13.sp)
                Text(
                    "LSP sunucusu aktif olduğunda\nsemboller burada gösterilir.",
                    color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                    fontSize = 11.sp,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        } else {
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                val flattened = flattenSymbols(symbols, depth = 0)
                items(flattened, key = { "${it.first.name}_${it.first.range.start.line}_${it.second}" }) { (symbol, depth) ->
                    SymbolItem(
                        symbol = symbol,
                        depth = depth,
                        onClick = { onSymbolClick(symbol) }
                    )
                }
            }
        }
    }
}

@Composable
private fun SymbolItem(
    symbol: DocumentSymbol,
    depth: Int,
    onClick: () -> Unit
) {
    val colors = EditorTheme.colors
    val kindColor = getSymbolKindColor(symbol.kind)

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(26.dp)
            .clickable(onClick = onClick)
            .padding(start = (12 + depth * 16).dp, end = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = symbol.kind.icon,
            color = kindColor,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.width(20.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = symbol.name,
            color = colors.editorForeground,
            fontSize = 12.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
        )
        if (symbol.detail.isNotBlank()) {
            Text(
                text = symbol.detail,
                color = colors.onSurfaceVariant.copy(alpha = 0.4f),
                fontSize = 10.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
        Text(
            text = "${symbol.range.start.line + 1}",
            color = colors.onSurfaceVariant.copy(alpha = 0.3f),
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            modifier = Modifier.padding(start = 4.dp)
        )
    }
}

private fun flattenSymbols(symbols: List<DocumentSymbol>, depth: Int): List<Pair<DocumentSymbol, Int>> {
    val result = mutableListOf<Pair<DocumentSymbol, Int>>()
    symbols.forEach { symbol ->
        result.add(symbol to depth)
        if (symbol.children.isNotEmpty()) {
            result.addAll(flattenSymbols(symbol.children, depth + 1))
        }
    }
    return result
}

@Composable
private fun getSymbolKindColor(kind: SymbolKind): androidx.compose.ui.graphics.Color {
    return when (kind) {
        SymbolKind.CLASS, SymbolKind.STRUCT -> androidx.compose.ui.graphics.Color(0xFF4EC9B0)
        SymbolKind.INTERFACE -> androidx.compose.ui.graphics.Color(0xFF4EC9B0)
        SymbolKind.FUNCTION, SymbolKind.METHOD, SymbolKind.CONSTRUCTOR -> androidx.compose.ui.graphics.Color(0xFFDCDCAA)
        SymbolKind.VARIABLE, SymbolKind.FIELD -> androidx.compose.ui.graphics.Color(0xFF9CDCFE)
        SymbolKind.PROPERTY -> androidx.compose.ui.graphics.Color(0xFF9CDCFE)
        SymbolKind.ENUM, SymbolKind.ENUM_MEMBER -> androidx.compose.ui.graphics.Color(0xFF4FC1FF)
        SymbolKind.CONSTANT -> androidx.compose.ui.graphics.Color(0xFF4FC1FF)
        SymbolKind.MODULE, SymbolKind.NAMESPACE, SymbolKind.PACKAGE -> androidx.compose.ui.graphics.Color(0xFFD4D4D4)
        else -> androidx.compose.ui.graphics.Color(0xFFD4D4D4)
    }
}
