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
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.lsp.Diagnostic
import com.codeflow.editor.data.lsp.DiagnosticSeverity
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun DiagnosticsPanel(
    diagnostics: Map<String, List<Diagnostic>>,
    onDiagnosticClick: (String, Diagnostic) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    val allDiagnostics = diagnostics.flatMap { (file, diags) -> diags.map { file to it } }
    val errorCount = allDiagnostics.count { it.second.severity == DiagnosticSeverity.ERROR }
    val warningCount = allDiagnostics.count { it.second.severity == DiagnosticSeverity.WARNING }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(colors.panelBackground)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(32.dp)
                .background(colors.activityBarBackground)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "SORUNLAR",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
            )
            Spacer(modifier = Modifier.width(8.dp))
            if (errorCount > 0) {
                Icon(Icons.Default.Error, null, tint = colors.error, modifier = Modifier.size(14.dp))
                Text(" $errorCount", color = colors.error, fontSize = 11.sp)
                Spacer(modifier = Modifier.width(6.dp))
            }
            if (warningCount > 0) {
                Icon(Icons.Default.Warning, null, tint = colors.warning, modifier = Modifier.size(14.dp))
                Text(" $warningCount", color = colors.warning, fontSize = 11.sp)
            }
            Spacer(modifier = Modifier.weight(1f))
            IconButton(onClick = onClose, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Close, "Kapat", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
        }

        HorizontalDivider(color = colors.border)

        if (allDiagnostics.isEmpty()) {
            Column(
                modifier = Modifier.fillMaxSize().padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Sorun bulunamadı", color = colors.onSurfaceVariant, fontSize = 13.sp)
            }
        } else {
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                val grouped = diagnostics.entries.toList()
                grouped.forEach { (filePath, diags) ->
                    item(key = "header_$filePath") {
                        Text(
                            text = filePath.substringAfterLast("/"),
                            color = colors.accent,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                        )
                    }
                    items(diags, key = { "$filePath:${it.range.start.line}:${it.message.hashCode()}" }) { diag ->
                        DiagnosticItem(
                            diagnostic = diag,
                            onClick = { onDiagnosticClick(filePath, diag) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun DiagnosticItem(
    diagnostic: Diagnostic,
    onClick: () -> Unit
) {
    val colors = EditorTheme.colors
    val severityColor = when (diagnostic.severity) {
        DiagnosticSeverity.ERROR -> colors.error
        DiagnosticSeverity.WARNING -> colors.warning
        DiagnosticSeverity.INFORMATION -> colors.accent
        DiagnosticSeverity.HINT -> colors.onSurfaceVariant
    }
    val severityIcon = when (diagnostic.severity) {
        DiagnosticSeverity.ERROR -> Icons.Default.Error
        DiagnosticSeverity.WARNING -> Icons.Default.Warning
        DiagnosticSeverity.INFORMATION -> Icons.Default.Info
        DiagnosticSeverity.HINT -> Icons.Default.Info
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            severityIcon,
            contentDescription = diagnostic.severity.label,
            tint = severityColor,
            modifier = Modifier.size(14.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = diagnostic.message,
            color = colors.editorForeground,
            fontSize = 12.sp,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = "[${diagnostic.range.start.line + 1}:${diagnostic.range.start.character + 1}]",
            color = colors.onSurfaceVariant.copy(alpha = 0.5f),
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace
        )
        if (diagnostic.source.isNotBlank()) {
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = diagnostic.source,
                color = colors.onSurfaceVariant.copy(alpha = 0.4f),
                fontSize = 10.sp
            )
        }
    }
}
