package com.codeflow.editor.ui.ai

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.ai.AIConfig
import com.codeflow.editor.data.ai.ChatMessage
import com.codeflow.editor.data.ai.ChatRole
import com.codeflow.editor.data.ai.MessageContext
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun AIChatPanel(
    messages: List<ChatMessage>,
    isLoading: Boolean,
    currentContext: MessageContext?,
    aiConfig: AIConfig,
    totalTokens: Int,
    onSendMessage: (String) -> Unit,
    onClearChat: () -> Unit,
    onClearContext: () -> Unit,
    onShowSettings: () -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    var inputText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(colors.sidebarBackground)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(40.dp)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.SmartToy,
                contentDescription = null,
                tint = colors.accent,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "AI Asistan",
                style = MaterialTheme.typography.titleMedium,
                color = colors.editorForeground,
                fontSize = 14.sp,
                modifier = Modifier.weight(1f)
            )
            // Model indicator
            Text(
                text = aiConfig.activeModel?.name ?: "Yapılandırılmadı",
                style = MaterialTheme.typography.labelSmall,
                color = if (aiConfig.isConfigured) colors.accent else colors.error,
                fontSize = 10.sp
            )
            Spacer(modifier = Modifier.width(4.dp))
            IconButton(onClick = onClearChat, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.DeleteSweep, "Sohbeti Temizle", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
            IconButton(onClick = onShowSettings, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.Settings, "AI Ayarları", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
            IconButton(onClick = onClose, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.Close, "Kapat", tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
            }
        }

        HorizontalDivider(color = colors.border)

        // Context indicator
        if (currentContext != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.accent.copy(alpha = 0.1f))
                    .padding(horizontal = 10.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Code, null, tint = colors.accent, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = buildString {
                        currentContext.fileName?.let { append(it) }
                        currentContext.language?.let { append(" ($it)") }
                        currentContext.selectedCode?.let {
                            val lines = it.lines().size
                            append(" - $lines satır seçili")
                        }
                    },
                    color = colors.accent,
                    fontSize = 11.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                IconButton(onClick = onClearContext, modifier = Modifier.size(20.dp)) {
                    Icon(Icons.Default.Close, "Bağlamı Temizle", tint = colors.accent, modifier = Modifier.size(12.dp))
                }
            }
        }

        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).fillMaxWidth(),
            contentPadding = PaddingValues(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (messages.isEmpty()) {
                item {
                    EmptyStateView()
                }
            }
            items(messages, key = { it.id }) { message ->
                ChatMessageBubble(message = message)
            }
        }

        // Token counter
        if (totalTokens > 0) {
            Text(
                text = "Token: $totalTokens",
                color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                fontSize = 10.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )
        }

        HorizontalDivider(color = colors.border)

        // Input area
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            verticalAlignment = Alignment.Bottom
        ) {
            BasicTextField(
                value = inputText,
                onValueChange = { inputText = it },
                textStyle = TextStyle(
                    color = colors.editorForeground,
                    fontSize = 13.sp
                ),
                cursorBrush = SolidColor(colors.accent),
                maxLines = 5,
                decorationBox = { innerTextField ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .background(colors.editorBackground, RoundedCornerShape(8.dp))
                            .padding(10.dp)
                    ) {
                        if (inputText.isEmpty()) {
                            Text(
                                text = "AI'a bir soru sorun...",
                                color = colors.onSurfaceVariant.copy(alpha = 0.4f),
                                fontSize = 13.sp
                            )
                        }
                        innerTextField()
                    }
                },
                modifier = Modifier.weight(1f)
            )
            Spacer(modifier = Modifier.width(6.dp))
            IconButton(
                onClick = {
                    if (inputText.isNotBlank() && !isLoading) {
                        onSendMessage(inputText.trim())
                        inputText = ""
                    }
                },
                enabled = inputText.isNotBlank() && !isLoading,
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(
                        if (inputText.isNotBlank() && !isLoading) colors.accent
                        else colors.border
                    )
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp,
                        color = colors.editorForeground
                    )
                } else {
                    Icon(
                        Icons.AutoMirrored.Filled.Send,
                        "Gönder",
                        tint = androidx.compose.ui.graphics.Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun ChatMessageBubble(message: ChatMessage) {
    val colors = EditorTheme.colors
    val isUser = message.role == ChatRole.USER
    val bgColor = when {
        message.isError -> colors.error.copy(alpha = 0.1f)
        isUser -> colors.accent.copy(alpha = 0.15f)
        else -> colors.editorBackground
    }
    val alignment = if (isUser) Alignment.End else Alignment.Start

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = alignment
    ) {
        // Role label
        Text(
            text = if (isUser) "Sen" else "AI",
            color = if (isUser) colors.accent else colors.success,
            fontSize = 10.sp,
            modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
        )

        Box(
            modifier = Modifier
                .fillMaxWidth(if (isUser) 0.85f else 0.95f)
                .background(bgColor, RoundedCornerShape(8.dp))
                .padding(10.dp)
        ) {
            if (message.isStreaming) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(14.dp),
                        strokeWidth = 2.dp,
                        color = colors.accent
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = message.content,
                        color = colors.onSurfaceVariant,
                        fontSize = 13.sp
                    )
                }
            } else {
                MarkdownText(
                    text = message.content,
                    color = if (message.isError) colors.error else colors.editorForeground
                )
            }
        }
    }
}

@Composable
private fun MarkdownText(
    text: String,
    color: androidx.compose.ui.graphics.Color
) {
    val colors = EditorTheme.colors
    val parts = parseSimpleMarkdown(text)

    Column {
        parts.forEach { part ->
            when (part) {
                is MarkdownPart.Text -> {
                    Text(
                        text = part.content,
                        color = color,
                        fontSize = 13.sp,
                        lineHeight = 19.sp
                    )
                }
                is MarkdownPart.CodeBlock -> {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .background(
                                colors.editorBackground.copy(alpha = 0.8f),
                                RoundedCornerShape(6.dp)
                            )
                            .padding(10.dp)
                    ) {
                        Column {
                            if (part.language.isNotBlank()) {
                                Text(
                                    text = part.language,
                                    color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                                    fontSize = 10.sp,
                                    modifier = Modifier.padding(bottom = 4.dp)
                                )
                            }
                            Text(
                                text = part.content,
                                color = colors.editorForeground,
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                lineHeight = 17.sp
                            )
                        }
                    }
                }
                is MarkdownPart.InlineCode -> {
                    Text(
                        text = part.content,
                        color = colors.accent,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier
                            .background(colors.editorBackground, RoundedCornerShape(3.dp))
                            .padding(horizontal = 4.dp, vertical = 1.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun EmptyStateView() {
    val colors = EditorTheme.colors
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            Icons.Default.SmartToy,
            contentDescription = null,
            tint = colors.onSurfaceVariant.copy(alpha = 0.3f),
            modifier = Modifier.size(48.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "AI Asistanına Hoş Geldiniz",
            color = colors.editorForeground.copy(alpha = 0.6f),
            fontSize = 15.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Kod hakkında sorular sorun,\nhata ayıklayın veya yeni kod üretin.",
            color = colors.onSurfaceVariant.copy(alpha = 0.5f),
            fontSize = 12.sp,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            lineHeight = 18.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        val suggestions = listOf("Bu kodu açıkla", "Hataları düzelt", "Test yaz", "Optimize et")
        suggestions.forEach { suggestion ->
            Text(
                text = "• $suggestion",
                color = colors.accent.copy(alpha = 0.7f),
                fontSize = 12.sp,
                modifier = Modifier.padding(vertical = 2.dp)
            )
        }
    }
}

// --- Simple Markdown Parser ---

private sealed class MarkdownPart {
    data class Text(val content: String) : MarkdownPart()
    data class CodeBlock(val content: String, val language: String) : MarkdownPart()
    data class InlineCode(val content: String) : MarkdownPart()
}

private fun parseSimpleMarkdown(text: String): List<MarkdownPart> {
    val parts = mutableListOf<MarkdownPart>()
    val lines = text.lines()
    var i = 0
    val currentText = StringBuilder()

    while (i < lines.size) {
        val line = lines[i]
        if (line.trimStart().startsWith("```")) {
            // Flush accumulated text
            if (currentText.isNotBlank()) {
                parts.add(MarkdownPart.Text(currentText.toString().trimEnd()))
                currentText.clear()
            }
            val language = line.trimStart().removePrefix("```").trim()
            val codeLines = StringBuilder()
            i++
            while (i < lines.size && !lines[i].trimStart().startsWith("```")) {
                codeLines.appendLine(lines[i])
                i++
            }
            parts.add(MarkdownPart.CodeBlock(codeLines.toString().trimEnd(), language))
            i++ // skip closing ```
        } else {
            currentText.appendLine(line)
            i++
        }
    }

    if (currentText.isNotBlank()) {
        parts.add(MarkdownPart.Text(currentText.toString().trimEnd()))
    }

    return parts
}
