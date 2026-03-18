package com.codeflow.editor.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.model.EditorTab
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun StatusBar(
    activeTab: EditorTab?,
    lineCount: Int,
    encoding: String = "UTF-8",
    onLanguageClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(24.dp)
            .background(colors.statusBarBackground)
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (activeTab != null) {
            StatusText("Satır: $lineCount")
            StatusSpacer()
            StatusText(encoding)
            StatusSpacer()
            StatusText(
                text = activeTab.language.uppercase(),
                modifier = Modifier.clickable(onClick = onLanguageClick)
            )
            Spacer(modifier = Modifier.weight(1f))
            if (activeTab.isModified) {
                StatusText("● Değiştirildi")
            } else {
                StatusText("✓ Kaydedildi")
            }
        } else {
            Text(
                text = "CodeFlow v0.1.0",
                color = Color.White.copy(alpha = 0.8f),
                fontSize = 11.sp,
                fontFamily = FontFamily.Default
            )
        }
    }
}

@Composable
private fun StatusText(text: String, modifier: Modifier = Modifier) {
    Text(
        text = text,
        color = Color.White.copy(alpha = 0.85f),
        fontSize = 11.sp,
        fontFamily = FontFamily.Default,
        modifier = modifier
    )
}

@Composable
private fun StatusSpacer() {
    Spacer(modifier = Modifier.width(16.dp))
}
