package com.codeflow.editor.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.model.EditorTab
import com.codeflow.editor.ui.theme.EditorTheme

@Composable
fun EditorTabBar(
    tabs: List<EditorTab>,
    activeTabId: String?,
    onTabClick: (String) -> Unit,
    onTabClose: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    val scrollState = rememberScrollState()

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(36.dp)
            .background(colors.tabInactiveBackground)
            .horizontalScroll(scrollState),
        verticalAlignment = Alignment.CenterVertically
    ) {
        tabs.forEach { tab ->
            val isActive = tab.id == activeTabId
            TabItem(
                tab = tab,
                isActive = isActive,
                onClick = { onTabClick(tab.id) },
                onClose = { onTabClose(tab.id) }
            )
        }
    }
}

@Composable
private fun TabItem(
    tab: EditorTab,
    isActive: Boolean,
    onClick: () -> Unit,
    onClose: () -> Unit
) {
    val colors = EditorTheme.colors
    val bgColor = if (isActive) colors.tabActiveBackground else colors.tabInactiveBackground
    val textColor = if (isActive) colors.editorForeground else colors.onSurfaceVariant

    Box(
        modifier = Modifier
            .height(36.dp)
            .background(bgColor)
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier
                .height(36.dp)
                .padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (tab.isModified) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(
                            colors.accent,
                            shape = androidx.compose.foundation.shape.CircleShape
                        )
                )
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(
                text = tab.displayTitle,
                style = MaterialTheme.typography.bodySmall,
                color = textColor,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.width(8.dp))
            IconButton(
                onClick = onClose,
                modifier = Modifier.size(16.dp)
            ) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Kapat",
                    tint = colors.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
            }
        }

        if (isActive) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .background(colors.accent)
                    .align(Alignment.BottomCenter)
            )
        }

        // Right border separator
        Box(
            modifier = Modifier
                .width(1.dp)
                .height(36.dp)
                .background(colors.border)
                .align(Alignment.CenterEnd)
        )
    }
}
