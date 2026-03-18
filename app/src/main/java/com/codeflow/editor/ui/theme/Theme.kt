package com.codeflow.editor.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

@Immutable
data class EditorColors(
    val editorBackground: Color,
    val editorForeground: Color,
    val lineHighlight: Color,
    val selectionBackground: Color,
    val sidebarBackground: Color,
    val activityBarBackground: Color,
    val tabActiveBackground: Color,
    val tabInactiveBackground: Color,
    val statusBarBackground: Color,
    val panelBackground: Color,
    val border: Color,
    val accent: Color,
    val error: Color,
    val warning: Color,
    val success: Color,
    val onSurfaceVariant: Color,
    val toolbarBackground: Color
)

val DarkEditorColors = EditorColors(
    editorBackground = DarkBackground,
    editorForeground = DarkOnBackground,
    lineHighlight = DarkEditorLineHighlight,
    selectionBackground = DarkSelectionBackground,
    sidebarBackground = DarkSideBar,
    activityBarBackground = DarkActivityBar,
    tabActiveBackground = DarkTabActive,
    tabInactiveBackground = DarkTabInactive,
    statusBarBackground = DarkStatusBar,
    panelBackground = DarkPanel,
    border = DarkBorder,
    accent = DarkAccent,
    error = DarkError,
    warning = DarkWarning,
    success = DarkSuccess,
    onSurfaceVariant = DarkOnSurfaceVariant,
    toolbarBackground = DarkSurfaceVariant
)

val LightEditorColors = EditorColors(
    editorBackground = LightBackground,
    editorForeground = LightOnBackground,
    lineHighlight = LightEditorLineHighlight,
    selectionBackground = LightSelectionBackground,
    sidebarBackground = LightSideBar,
    activityBarBackground = LightActivityBar,
    tabActiveBackground = LightTabActive,
    tabInactiveBackground = LightTabInactive,
    statusBarBackground = LightStatusBar,
    panelBackground = LightPanel,
    border = LightBorder,
    accent = LightAccent,
    error = LightError,
    warning = LightWarning,
    success = LightSuccess,
    onSurfaceVariant = LightOnSurfaceVariant,
    toolbarBackground = LightSurfaceVariant
)

val LocalEditorColors = staticCompositionLocalOf { DarkEditorColors }

private val DarkColorScheme = darkColorScheme(
    primary = DarkPrimary,
    secondary = DarkSecondary,
    tertiary = DarkTertiary,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = DarkOnBackground,
    onSurface = DarkOnSurface,
    error = DarkError,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = DarkOnSurfaceVariant
)

private val LightColorScheme = lightColorScheme(
    primary = LightPrimary,
    secondary = LightSecondary,
    tertiary = LightTertiary,
    background = LightBackground,
    surface = LightSurface,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = LightOnBackground,
    onSurface = LightOnSurface,
    error = LightError,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = LightOnSurfaceVariant
)

@Composable
fun CodeFlowTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val editorColors = if (darkTheme) DarkEditorColors else LightEditorColors

    CompositionLocalProvider(LocalEditorColors provides editorColors) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = CodeFlowTypography,
            content = content
        )
    }
}

object EditorTheme {
    val colors: EditorColors
        @Composable
        get() = LocalEditorColors.current
}
