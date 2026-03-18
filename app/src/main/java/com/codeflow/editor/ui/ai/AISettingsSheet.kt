package com.codeflow.editor.ui.ai

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.ai.AIConfig
import com.codeflow.editor.data.ai.AIProvider
import com.codeflow.editor.data.ai.AvailableModels
import com.codeflow.editor.ui.theme.EditorTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AISettingsSheet(
    config: AIConfig,
    onBack: () -> Unit,
    onProviderChange: (AIProvider) -> Unit,
    onModelChange: (String) -> Unit,
    onApiKeyChange: (AIProvider, String) -> Unit,
    onTemperatureChange: (Float) -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("AI Ayarları", color = colors.editorForeground) },
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
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Provider Selection
            SectionTitle("AI Sağlayıcı")
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth()) {
                AIProvider.entries.forEach { provider ->
                    FilterChip(
                        selected = config.provider == provider,
                        onClick = { onProviderChange(provider) },
                        label = { Text(provider.displayName, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = colors.accent.copy(alpha = 0.2f),
                            selectedLabelColor = colors.accent
                        ),
                        modifier = Modifier.padding(end = 6.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // API Key
            when (config.provider) {
                AIProvider.OPENAI -> {
                    SectionTitle("OpenAI API Anahtarı")
                    Spacer(modifier = Modifier.height(6.dp))
                    ApiKeyField(
                        value = config.openaiApiKey,
                        onValueChange = { onApiKeyChange(AIProvider.OPENAI, it) },
                        placeholder = "sk-..."
                    )
                }
                AIProvider.ANTHROPIC -> {
                    SectionTitle("Anthropic API Anahtarı")
                    Spacer(modifier = Modifier.height(6.dp))
                    ApiKeyField(
                        value = config.anthropicApiKey,
                        onValueChange = { onApiKeyChange(AIProvider.ANTHROPIC, it) },
                        placeholder = "sk-ant-..."
                    )
                }
                AIProvider.GEMINI -> {
                    SectionTitle("Google Gemini API Anahtarı")
                    Spacer(modifier = Modifier.height(6.dp))
                    ApiKeyField(
                        value = config.geminiApiKey,
                        onValueChange = { onApiKeyChange(AIProvider.GEMINI, it) },
                        placeholder = "AIza..."
                    )
                }
                AIProvider.LOCAL -> {
                    SectionTitle("Yerel Model Endpoint")
                    Spacer(modifier = Modifier.height(6.dp))
                    ApiKeyField(
                        value = config.localEndpoint,
                        onValueChange = { onApiKeyChange(AIProvider.LOCAL, it) },
                        placeholder = "http://localhost:11434",
                        isPassword = false
                    )
                }
            }

            // Status
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = if (config.isConfigured) "✓ Yapılandırıldı" else "✗ API anahtarı gerekli",
                color = if (config.isConfigured) colors.success else colors.error,
                fontSize = 12.sp
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Model Selection
            SectionTitle("Model")
            Spacer(modifier = Modifier.height(8.dp))
            val models = AvailableModels.forProvider(config.provider)
            Column {
                models.forEach { model ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onModelChange(model.id) }
                            .background(
                                if (config.modelId == model.id) colors.accent.copy(alpha = 0.1f)
                                else androidx.compose.ui.graphics.Color.Transparent,
                                RoundedCornerShape(6.dp)
                            )
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .width(8.dp)
                                .height(8.dp)
                                .background(
                                    if (config.modelId == model.id) colors.accent
                                    else colors.border,
                                    RoundedCornerShape(4.dp)
                                )
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(text = model.name, color = colors.editorForeground, fontSize = 13.sp)
                            Text(text = model.id, color = colors.onSurfaceVariant, fontSize = 11.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Temperature
            SectionTitle("Sıcaklık (Temperature): ${"%.1f".format(config.temperature)}")
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Düşük = daha tutarlı, Yüksek = daha yaratıcı",
                color = colors.onSurfaceVariant,
                fontSize = 11.sp
            )
            Slider(
                value = config.temperature,
                onValueChange = onTemperatureChange,
                valueRange = 0f..1.5f,
                steps = 14,
                colors = SliderDefaults.colors(
                    thumbColor = colors.accent,
                    activeTrackColor = colors.accent
                )
            )

            Spacer(modifier = Modifier.height(20.dp))
            HorizontalDivider(color = colors.border)
            Spacer(modifier = Modifier.height(12.dp))

            // Info
            Text(
                text = "API anahtarları cihazınızda güvenli şekilde saklanır.\nSunucuya sadece AI yanıt almak için gönderilir.",
                color = colors.onSurfaceVariant.copy(alpha = 0.5f),
                fontSize = 11.sp,
                lineHeight = 16.sp
            )
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    val colors = EditorTheme.colors
    Text(
        text = text.uppercase(),
        style = MaterialTheme.typography.labelSmall,
        color = colors.accent,
        fontSize = 11.sp
    )
}

@Composable
private fun ApiKeyField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    isPassword: Boolean = true
) {
    val colors = EditorTheme.colors
    var showPassword by remember { mutableStateOf(false) }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.sidebarBackground, RoundedCornerShape(6.dp))
            .padding(horizontal = 12.dp, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
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
            visualTransformation = if (isPassword && !showPassword) PasswordVisualTransformation() else VisualTransformation.None,
            decorationBox = { innerTextField ->
                Box(modifier = Modifier.weight(1f).padding(vertical = 10.dp)) {
                    if (value.isEmpty()) {
                        Text(placeholder, color = colors.onSurfaceVariant.copy(alpha = 0.4f), fontSize = 13.sp, fontFamily = FontFamily.Monospace)
                    }
                    innerTextField()
                }
            },
            modifier = Modifier.weight(1f)
        )
        if (isPassword) {
            IconButton(onClick = { showPassword = !showPassword }, modifier = Modifier.padding(0.dp)) {
                Icon(
                    if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                    "Göster/Gizle",
                    tint = colors.onSurfaceVariant,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
