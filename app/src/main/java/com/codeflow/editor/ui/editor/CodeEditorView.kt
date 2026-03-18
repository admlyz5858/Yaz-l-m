package com.codeflow.editor.ui.editor

import android.content.Context
import android.graphics.Typeface
import android.view.ViewGroup
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.codeflow.editor.data.model.AppSettings
import com.codeflow.editor.data.model.EditorTab
import io.github.rosemoe.sora.event.ContentChangeEvent
import io.github.rosemoe.sora.widget.CodeEditor
import io.github.rosemoe.sora.widget.schemes.EditorColorScheme

@Composable
fun CodeEditorView(
    tab: EditorTab,
    settings: AppSettings,
    onContentChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val editor = remember { createEditor(context) }

    LaunchedEffect(tab.id) {
        editor.setText(tab.content)
    }

    LaunchedEffect(settings) {
        applySettings(editor, settings)
    }

    DisposableEffect(Unit) {
        val subscription = editor.subscribeEvent(ContentChangeEvent::class.java) { event, _ ->
            onContentChange(editor.text.toString())
        }
        onDispose {
            subscription.dispose()
        }
    }

    AndroidView(
        factory = { editor },
        modifier = modifier,
        update = { view ->
            applySettings(view, settings)
        }
    )
}

private fun createEditor(context: Context): CodeEditor {
    return CodeEditor(context).apply {
        layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )

        typefaceText = Typeface.MONOSPACE
        typefaceLineNumber = Typeface.MONOSPACE
        setTextSize(14f)
        isLineNumberEnabled = true
        isWordwrap = false
        setInterceptParentHorizontalScrollIfNeeded(true)

        val colorScheme = createDarkColorScheme()
        setColorScheme(colorScheme)
    }
}

private fun applySettings(editor: CodeEditor, settings: AppSettings) {
    editor.setTextSize(settings.fontSize)
    editor.isLineNumberEnabled = settings.showLineNumbers
    editor.isWordwrap = settings.wordWrap
    editor.tabWidth = settings.tabSize

    val colorScheme = if (settings.isDarkTheme) createDarkColorScheme() else createLightColorScheme()
    editor.setColorScheme(colorScheme)
}

private fun createDarkColorScheme(): EditorColorScheme {
    return EditorColorScheme().apply {
        setColor(EditorColorScheme.WHOLE_BACKGROUND, 0xFF1E1E1E.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_BACKGROUND, 0xFF1E1E1E.toInt())
        setColor(EditorColorScheme.LINE_NUMBER, 0xFF858585.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_CURRENT, 0xFFC6C6C6.toInt())
        setColor(EditorColorScheme.TEXT_NORMAL, 0xFFD4D4D4.toInt())
        setColor(EditorColorScheme.SELECTION_HANDLE, 0xFF007ACC.toInt())
        setColor(EditorColorScheme.SELECTION_INSERT, 0xFFAEAFAD.toInt())
        setColor(EditorColorScheme.SELECTED_TEXT_BACKGROUND, 0xFF264F78.toInt())
        setColor(EditorColorScheme.CURRENT_LINE, 0xFF2A2D2E.toInt())
        setColor(EditorColorScheme.KEYWORD, 0xFF569CD6.toInt())
        setColor(EditorColorScheme.COMMENT, 0xFF6A9955.toInt())
        setColor(EditorColorScheme.LITERAL, 0xFFCE9178.toInt())
        setColor(EditorColorScheme.OPERATOR, 0xFFD4D4D4.toInt())
        setColor(EditorColorScheme.FUNCTION_NAME, 0xFFDCDCAA.toInt())
        setColor(EditorColorScheme.LINE_DIVIDER, 0xFF3C3C3C.toInt())
        setColor(EditorColorScheme.SCROLL_BAR_THUMB, 0xFF424242.toInt())
        setColor(EditorColorScheme.SCROLL_BAR_TRACK, 0xFF1E1E1E.toInt())
        setColor(EditorColorScheme.BLOCK_LINE, 0xFF3C3C3C.toInt())
        setColor(EditorColorScheme.BLOCK_LINE_CURRENT, 0xFF505050.toInt())
    }
}

private fun createLightColorScheme(): EditorColorScheme {
    return EditorColorScheme().apply {
        setColor(EditorColorScheme.WHOLE_BACKGROUND, 0xFFFFFFFF.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_BACKGROUND, 0xFFFFFFFF.toInt())
        setColor(EditorColorScheme.LINE_NUMBER, 0xFF237893.toInt())
        setColor(EditorColorScheme.LINE_NUMBER_CURRENT, 0xFF0B216F.toInt())
        setColor(EditorColorScheme.TEXT_NORMAL, 0xFF1E1E1E.toInt())
        setColor(EditorColorScheme.SELECTION_HANDLE, 0xFF007ACC.toInt())
        setColor(EditorColorScheme.SELECTION_INSERT, 0xFF000000.toInt())
        setColor(EditorColorScheme.SELECTED_TEXT_BACKGROUND, 0xFFADD6FF.toInt())
        setColor(EditorColorScheme.CURRENT_LINE, 0xFFFFF9C4.toInt())
        setColor(EditorColorScheme.KEYWORD, 0xFF0000FF.toInt())
        setColor(EditorColorScheme.COMMENT, 0xFF008000.toInt())
        setColor(EditorColorScheme.LITERAL, 0xFFA31515.toInt())
        setColor(EditorColorScheme.OPERATOR, 0xFF1E1E1E.toInt())
        setColor(EditorColorScheme.FUNCTION_NAME, 0xFF795E26.toInt())
        setColor(EditorColorScheme.LINE_DIVIDER, 0xFFD4D4D4.toInt())
        setColor(EditorColorScheme.SCROLL_BAR_THUMB, 0xFFBDBDBD.toInt())
        setColor(EditorColorScheme.SCROLL_BAR_TRACK, 0xFFFFFFFF.toInt())
        setColor(EditorColorScheme.BLOCK_LINE, 0xFFD4D4D4.toInt())
        setColor(EditorColorScheme.BLOCK_LINE_CURRENT, 0xFF999999.toInt())
    }
}
