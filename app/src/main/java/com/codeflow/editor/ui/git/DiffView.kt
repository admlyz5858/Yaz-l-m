package com.codeflow.editor.ui.git

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.git.DiffLine
import com.codeflow.editor.data.git.DiffLineType
import com.codeflow.editor.data.git.FileDiff
import com.codeflow.editor.ui.theme.EditorTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiffView(
    diff: FileDiff?,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    if (diff == null) return

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(diff.filePath, color = colors.editorForeground, fontSize = 14.sp)
                        Text(
                            text = "+${diff.additions} -${diff.deletions}",
                            color = colors.onSurfaceVariant,
                            fontSize = 11.sp
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Geri", tint = colors.editorForeground)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = colors.activityBarBackground)
            )
        },
        containerColor = colors.editorBackground
    ) { paddingValues ->
        if (diff.lines.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize().padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text("Değişiklik yok veya dosya ikili (binary).", color = colors.onSurfaceVariant, fontSize = 13.sp)
            }
        } else {
            val scrollState = rememberScrollState()
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .horizontalScroll(scrollState)
            ) {
                items(diff.lines) { line ->
                    DiffLineView(line)
                }
            }
        }
    }
}

@Composable
private fun DiffLineView(line: DiffLine) {
    val bgColor = when (line.type) {
        DiffLineType.ADDED -> Color(0xFF1E3A1E)
        DiffLineType.REMOVED -> Color(0xFF3A1E1E)
        DiffLineType.HUNK_HEADER -> Color(0xFF1E2A3A)
        DiffLineType.HEADER -> Color.Transparent
        DiffLineType.CONTEXT -> Color.Transparent
    }

    val textColor = when (line.type) {
        DiffLineType.ADDED -> Color(0xFF73C991)
        DiffLineType.REMOVED -> Color(0xFFC74E39)
        DiffLineType.HUNK_HEADER -> Color(0xFF569CD6)
        DiffLineType.HEADER -> Color(0xFF858585)
        DiffLineType.CONTEXT -> Color(0xFFD4D4D4)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(bgColor)
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Line numbers
        Text(
            text = line.oldLineNumber?.toString()?.padStart(4) ?: "    ",
            color = Color(0xFF5A5A5A),
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace
        )
        Text(
            text = line.newLineNumber?.toString()?.padStart(4) ?: "    ",
            color = Color(0xFF5A5A5A),
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.width(4.dp))

        // Content
        Text(
            text = line.content,
            color = textColor,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace,
            lineHeight = 17.sp
        )
    }
}
