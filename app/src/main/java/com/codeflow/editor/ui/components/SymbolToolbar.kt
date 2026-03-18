package com.codeflow.editor.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.ui.theme.EditorTheme

private val SYMBOLS = listOf(
    "Tab" to "\t",
    "{" to "{",
    "}" to "}",
    "(" to "(",
    ")" to ")",
    "[" to "[",
    "]" to "]",
    "<" to "<",
    ">" to ">",
    ";" to ";",
    ":" to ":",
    "'" to "'",
    "\"" to "\"",
    "=" to "=",
    "+" to "+",
    "-" to "-",
    "*" to "*",
    "/" to "/",
    "\\" to "\\",
    "|" to "|",
    "&" to "&",
    "!" to "!",
    "?" to "?",
    "#" to "#",
    "_" to "_",
    "." to ".",
    "," to ","
)

@Composable
fun SymbolToolbar(
    onSymbolClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    val scrollState = rememberScrollState()

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(40.dp)
            .background(colors.toolbarBackground)
            .horizontalScroll(scrollState),
        verticalAlignment = Alignment.CenterVertically
    ) {
        SYMBOLS.forEach { (display, value) ->
            Box(
                modifier = Modifier
                    .height(40.dp)
                    .width(if (display == "Tab") 48.dp else 36.dp)
                    .clickable { onSymbolClick(value) },
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = display,
                    color = colors.editorForeground,
                    fontSize = if (display == "Tab") 11.sp else 15.sp,
                    fontFamily = FontFamily.Monospace,
                    textAlign = TextAlign.Center
                )
            }

            // Thin separator
            Box(
                modifier = Modifier
                    .height(20.dp)
                    .width(1.dp)
                    .background(colors.border.copy(alpha = 0.3f))
            )
        }
    }
}
