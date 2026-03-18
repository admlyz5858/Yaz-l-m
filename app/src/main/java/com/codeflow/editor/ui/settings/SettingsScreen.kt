package com.codeflow.editor.ui.settings

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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.model.AppSettings
import com.codeflow.editor.ui.theme.EditorTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    settings: AppSettings,
    onBack: () -> Unit,
    onToggleDarkTheme: () -> Unit,
    onFontSizeChange: (Float) -> Unit,
    onToggleLineNumbers: () -> Unit,
    onToggleWordWrap: () -> Unit,
    onToggleAutoSave: () -> Unit,
    onTabSizeChange: (Int) -> Unit,
    onToggleAutoCloseBrackets: () -> Unit,
    onToggleHighlightCurrentLine: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Ayarlar",
                        color = colors.editorForeground
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Geri",
                            tint = colors.editorForeground
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colors.activityBarBackground
                )
            )
        },
        containerColor = colors.editorBackground
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
        ) {
            SettingsSection("Görünüm") {
                SwitchSettingItem(
                    title = "Koyu Tema",
                    subtitle = if (settings.isDarkTheme) "Koyu mod etkin" else "Açık mod etkin",
                    checked = settings.isDarkTheme,
                    onCheckedChange = { onToggleDarkTheme() }
                )
                SliderSettingItem(
                    title = "Yazı Boyutu",
                    subtitle = "${settings.fontSize.toInt()} sp",
                    value = settings.fontSize,
                    valueRange = 8f..32f,
                    steps = 23,
                    onValueChange = onFontSizeChange
                )
                SwitchSettingItem(
                    title = "Satır Numaraları",
                    subtitle = "Editör kenarında satır numarası göster",
                    checked = settings.showLineNumbers,
                    onCheckedChange = { onToggleLineNumbers() }
                )
                SwitchSettingItem(
                    title = "Word Wrap",
                    subtitle = "Uzun satırları otomatik sar",
                    checked = settings.wordWrap,
                    onCheckedChange = { onToggleWordWrap() }
                )
                SwitchSettingItem(
                    title = "Mevcut Satırı Vurgula",
                    subtitle = "İmleç satırını arka plan rengiyle vurgula",
                    checked = settings.highlightCurrentLine,
                    onCheckedChange = { onToggleHighlightCurrentLine() }
                )
            }

            SettingsSection("Düzenleyici") {
                SliderSettingItem(
                    title = "Tab Boyutu",
                    subtitle = "${settings.tabSize} boşluk",
                    value = settings.tabSize.toFloat(),
                    valueRange = 2f..8f,
                    steps = 5,
                    onValueChange = { onTabSizeChange(it.toInt()) }
                )
                SwitchSettingItem(
                    title = "Otomatik Parantez Kapatma",
                    subtitle = "Açılan parantezleri otomatik kapat",
                    checked = settings.autoCloseBrackets,
                    onCheckedChange = { onToggleAutoCloseBrackets() }
                )
                SwitchSettingItem(
                    title = "Otomatik Kaydetme",
                    subtitle = "Değişiklikleri otomatik kaydet",
                    checked = settings.autoSave,
                    onCheckedChange = { onToggleAutoSave() }
                )
            }

            SettingsSection("Hakkında") {
                InfoSettingItem(title = "Sürüm", subtitle = "0.1.0 (Faz 2)")
                InfoSettingItem(title = "Editör Motoru", subtitle = "Sora Editor 0.23.6")
                InfoSettingItem(title = "Platform", subtitle = "Android")
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun SettingsSection(
    title: String,
    content: @Composable () -> Unit
) {
    val colors = EditorTheme.colors

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = title.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = colors.accent,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
        )
        content()
        HorizontalDivider(color = colors.border)
    }
}

@Composable
private fun SwitchSettingItem(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    val colors = EditorTheme.colors

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCheckedChange(!checked) }
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                color = colors.editorForeground,
                fontSize = 14.sp
            )
            Text(
                text = subtitle,
                color = colors.onSurfaceVariant,
                fontSize = 12.sp
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = colors.accent,
                checkedTrackColor = colors.accent.copy(alpha = 0.3f)
            )
        )
    }
}

@Composable
private fun SliderSettingItem(
    title: String,
    subtitle: String,
    value: Float,
    valueRange: ClosedFloatingPointRange<Float>,
    steps: Int,
    onValueChange: (Float) -> Unit
) {
    val colors = EditorTheme.colors

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                color = colors.editorForeground,
                fontSize = 14.sp,
                modifier = Modifier.weight(1f)
            )
            Text(
                text = subtitle,
                color = colors.accent,
                fontSize = 13.sp
            )
        }
        Slider(
            value = value,
            onValueChange = onValueChange,
            valueRange = valueRange,
            steps = steps,
            colors = SliderDefaults.colors(
                thumbColor = colors.accent,
                activeTrackColor = colors.accent
            )
        )
    }
}

@Composable
private fun InfoSettingItem(
    title: String,
    subtitle: String
) {
    val colors = EditorTheme.colors

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            color = colors.editorForeground,
            fontSize = 14.sp,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = subtitle,
            color = colors.onSurfaceVariant,
            fontSize = 13.sp
        )
    }
}
