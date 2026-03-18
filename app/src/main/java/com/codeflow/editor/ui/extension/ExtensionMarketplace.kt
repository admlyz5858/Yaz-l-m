package com.codeflow.editor.ui.extension

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.extension.Extension
import com.codeflow.editor.data.extension.ExtensionCategory
import com.codeflow.editor.data.extension.ExtensionState
import com.codeflow.editor.ui.theme.EditorTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExtensionMarketplace(
    installedExtensions: List<Extension>,
    marketplaceExtensions: List<Extension>,
    onInstall: (String) -> Unit,
    onUninstall: (String) -> Unit,
    onEnable: (String) -> Unit,
    onDisable: (String) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    var searchQuery by remember { mutableStateOf("") }
    var selectedTab by remember { mutableStateOf(0) } // 0=Installed, 1=Marketplace
    var selectedCategory by remember { mutableStateOf<ExtensionCategory?>(null) }

    val displayList = if (selectedTab == 0) {
        installedExtensions.filter {
            searchQuery.isBlank() || it.manifest.displayName.lowercase().contains(searchQuery.lowercase())
        }
    } else {
        marketplaceExtensions.filter {
            val matchesQuery = searchQuery.isBlank() || it.manifest.displayName.lowercase().contains(searchQuery.lowercase())
                    || it.manifest.description.lowercase().contains(searchQuery.lowercase())
            val matchesCat = selectedCategory == null || it.manifest.category == selectedCategory
            matchesQuery && matchesCat
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Eklentiler", color = colors.editorForeground) },
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
        ) {
            // Search
            BasicTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                singleLine = true,
                textStyle = TextStyle(color = colors.editorForeground, fontSize = 13.sp),
                cursorBrush = SolidColor(colors.accent),
                decorationBox = { innerTextField ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                            .background(colors.sidebarBackground, RoundedCornerShape(6.dp))
                            .padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Search, null, tint = colors.onSurfaceVariant, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(modifier = Modifier.weight(1f)) {
                            if (searchQuery.isEmpty()) Text("Eklenti ara...", color = colors.onSurfaceVariant.copy(alpha = 0.4f), fontSize = 13.sp)
                            innerTextField()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth()
            )

            // Tab selector
            Row(modifier = Modifier.padding(horizontal = 12.dp)) {
                FilterChip(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    label = { Text("Yüklü (${installedExtensions.size})", fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = colors.accent.copy(alpha = 0.2f),
                        selectedLabelColor = colors.accent
                    ),
                    modifier = Modifier.padding(end = 6.dp)
                )
                FilterChip(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    label = { Text("Mağaza", fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = colors.accent.copy(alpha = 0.2f),
                        selectedLabelColor = colors.accent
                    )
                )
            }

            // Category filter (marketplace only)
            if (selectedTab == 1) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    FilterChip(
                        selected = selectedCategory == null,
                        onClick = { selectedCategory = null },
                        label = { Text("Tümü", fontSize = 10.sp) },
                        modifier = Modifier.padding(end = 4.dp)
                    )
                    listOf(ExtensionCategory.THEME, ExtensionCategory.LANGUAGE, ExtensionCategory.LINTER, ExtensionCategory.AI).forEach { cat ->
                        FilterChip(
                            selected = selectedCategory == cat,
                            onClick = { selectedCategory = if (selectedCategory == cat) null else cat },
                            label = { Text(cat.displayName, fontSize = 10.sp) },
                            modifier = Modifier.padding(end = 4.dp)
                        )
                    }
                }
            }

            HorizontalDivider(color = colors.border)

            // Extension list
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                items(displayList, key = { it.manifest.id }) { ext ->
                    ExtensionListItem(
                        extension = ext,
                        onInstall = { onInstall(ext.manifest.id) },
                        onUninstall = { onUninstall(ext.manifest.id) },
                        onEnable = { onEnable(ext.manifest.id) },
                        onDisable = { onDisable(ext.manifest.id) }
                    )
                }
                if (displayList.isEmpty()) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(24.dp), contentAlignment = Alignment.Center) {
                            Text("Sonuç bulunamadı", color = colors.onSurfaceVariant, fontSize = 13.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ExtensionListItem(
    extension: Extension,
    onInstall: () -> Unit,
    onUninstall: () -> Unit,
    onEnable: () -> Unit,
    onDisable: () -> Unit
) {
    val colors = EditorTheme.colors
    val isInstalled = extension.state == ExtensionState.INSTALLED || extension.state == ExtensionState.ENABLED

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Icon placeholder
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(colors.accent.copy(alpha = 0.1f), RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = extension.manifest.category.displayName.first().toString(),
                color = colors.accent,
                fontSize = 18.sp
            )
        }

        Spacer(modifier = Modifier.width(10.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = extension.manifest.displayName,
                color = colors.editorForeground,
                fontSize = 13.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = extension.manifest.description,
                color = colors.onSurfaceVariant,
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Star, null, tint = androidx.compose.ui.graphics.Color(0xFFFFC107), modifier = Modifier.size(12.dp))
                Text(" ${"%.1f".format(extension.rating)}", color = colors.onSurfaceVariant, fontSize = 10.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Icon(Icons.Default.Download, null, tint = colors.onSurfaceVariant, modifier = Modifier.size(12.dp))
                val dlText = if (extension.downloadCount >= 1000) "${extension.downloadCount / 1000}K" else "${extension.downloadCount}"
                Text(" $dlText", color = colors.onSurfaceVariant, fontSize = 10.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(extension.manifest.category.displayName, color = colors.onSurfaceVariant.copy(alpha = 0.5f), fontSize = 10.sp)
            }
        }

        // Action button
        if (isInstalled) {
            TextButton(onClick = onUninstall, modifier = Modifier.height(32.dp)) {
                Icon(Icons.Default.Check, null, tint = colors.success, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(2.dp))
                Text("Yüklü", fontSize = 11.sp, color = colors.success)
            }
        } else {
            TextButton(onClick = onInstall, modifier = Modifier.height(32.dp)) {
                Icon(Icons.Default.Add, null, tint = colors.accent, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(2.dp))
                Text("Yükle", fontSize = 11.sp, color = colors.accent)
            }
        }
    }
}
