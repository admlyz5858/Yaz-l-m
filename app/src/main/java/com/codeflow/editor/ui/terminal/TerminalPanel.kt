package com.codeflow.editor.ui.terminal

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.terminal.LineType
import com.codeflow.editor.data.terminal.TerminalLine
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun TerminalPanel(
    lines: List<TerminalLine>,
    currentDir: String,
    isRunning: Boolean,
    commandHistory: List<String>,
    onExecuteCommand: (String) -> Unit,
    onCancelProcess: () -> Unit,
    onClear: () -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    var inputText by remember { mutableStateOf("") }
    var historyIndex by remember { mutableIntStateOf(-1) }
    val listState = rememberLazyListState()

    LaunchedEffect(lines.size) {
        if (lines.isNotEmpty()) {
            listState.animateScrollToItem(lines.size - 1)
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0C0C0C))
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
                text = "TERMİNAL",
                style = MaterialTheme.typography.labelSmall,
                color = colors.onSurfaceVariant,
                modifier = Modifier.weight(1f)
            )
            if (isRunning) {
                IconButton(onClick = onCancelProcess, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.Cancel, "İptal", tint = colors.error, modifier = Modifier.size(16.dp))
                }
            }
            IconButton(onClick = onClear, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.DeleteSweep, "Temizle", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
            IconButton(onClick = onClose, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.Close, "Kapat", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
        }

        HorizontalDivider(color = colors.border)

        // Output
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            items(lines, key = { "${it.hashCode()}_${lines.indexOf(it)}" }) { line ->
                TerminalLineView(line)
            }
        }

        // Input
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1A1A1A))
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Prompt
            Text(
                text = getShortDir(currentDir),
                color = Color(0xFF6A9955),
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.width(100.dp)
            )
            Text(
                text = " $ ",
                color = Color(0xFFDCDCAA),
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace
            )

            BasicTextField(
                value = inputText,
                onValueChange = {
                    inputText = it
                    historyIndex = -1
                },
                singleLine = true,
                textStyle = TextStyle(
                    color = Color(0xFFD4D4D4),
                    fontSize = 13.sp,
                    fontFamily = FontFamily.Monospace
                ),
                cursorBrush = SolidColor(Color(0xFFAEAFAD)),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(
                    onSend = {
                        if (inputText.isNotBlank() && !isRunning) {
                            onExecuteCommand(inputText)
                            inputText = ""
                            historyIndex = -1
                        }
                    }
                ),
                decorationBox = { innerTextField ->
                    Box(modifier = Modifier.weight(1f)) {
                        if (inputText.isEmpty()) {
                            Text(
                                "komut girin...",
                                color = Color(0xFF5A5A5A),
                                fontSize = 13.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        innerTextField()
                    }
                },
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun TerminalLineView(line: TerminalLine) {
    val textColor = when (line.type) {
        LineType.INPUT -> Color(0xFF569CD6)
        LineType.OUTPUT -> Color(0xFFD4D4D4)
        LineType.ERROR -> Color(0xFFF44747)
        LineType.SYSTEM -> Color(0xFF858585)
    }

    Text(
        text = line.text,
        color = textColor,
        fontSize = 12.sp,
        fontFamily = FontFamily.Monospace,
        lineHeight = 17.sp,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 1.dp)
    )
}

private fun getShortDir(path: String): String {
    return when {
        path == "/" -> "/"
        path.startsWith("/storage/emulated/0") -> "~" + path.removePrefix("/storage/emulated/0")
        else -> path.substringAfterLast("/")
    }
}
