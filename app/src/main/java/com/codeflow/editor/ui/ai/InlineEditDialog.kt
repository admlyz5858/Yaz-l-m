package com.codeflow.editor.ui.ai

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.ai.InlineEditResult
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun InlineEditDialog(
    result: InlineEditResult?,
    onAccept: () -> Unit,
    onReject: () -> Unit
) {
    if (result == null) return

    val colors = EditorTheme.colors

    AlertDialog(
        onDismissRequest = onReject,
        title = {
            Text("AI Düzenleme Önerisi", color = colors.editorForeground)
        },
        text = {
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                // Original code
                Text(
                    text = "MEVCUT KOD",
                    color = colors.error.copy(alpha = 0.7f),
                    fontSize = 10.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            colors.error.copy(alpha = 0.05f),
                            RoundedCornerShape(6.dp)
                        )
                        .padding(8.dp)
                ) {
                    Text(
                        text = result.originalCode,
                        color = colors.editorForeground.copy(alpha = 0.6f),
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 17.sp
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Modified code
                Text(
                    text = "ÖNERİLEN KOD",
                    color = colors.success.copy(alpha = 0.7f),
                    fontSize = 10.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            colors.success.copy(alpha = 0.05f),
                            RoundedCornerShape(6.dp)
                        )
                        .padding(8.dp)
                ) {
                    Text(
                        text = result.modifiedCode,
                        color = colors.editorForeground,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 17.sp
                    )
                }

                if (result.explanation.isNotBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = result.explanation,
                        color = colors.onSurfaceVariant,
                        fontSize = 12.sp
                    )
                }
            }
        },
        confirmButton = {
            Row {
                TextButton(onClick = onReject) {
                    Text("Reddet", color = colors.error)
                }
                Spacer(modifier = Modifier.width(8.dp))
                TextButton(onClick = onAccept) {
                    Text("Kabul Et", color = colors.success)
                }
            }
        },
        containerColor = colors.sidebarBackground
    )
}
