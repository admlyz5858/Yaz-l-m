package com.codeflow.editor.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.codeflow.editor.data.model.AppSettings
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

@Singleton
class SettingsRepository @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private object Keys {
        val IS_DARK_THEME = booleanPreferencesKey("is_dark_theme")
        val FONT_SIZE = floatPreferencesKey("font_size")
        val SHOW_LINE_NUMBERS = booleanPreferencesKey("show_line_numbers")
        val WORD_WRAP = booleanPreferencesKey("word_wrap")
        val AUTO_SAVE = booleanPreferencesKey("auto_save")
        val TAB_SIZE = intPreferencesKey("tab_size")
        val USE_SPACES = booleanPreferencesKey("use_spaces")
        val FONT_FAMILY = stringPreferencesKey("font_family")
        val SHOW_WHITESPACE = booleanPreferencesKey("show_whitespace")
        val AUTO_CLOSE_BRACKETS = booleanPreferencesKey("auto_close_brackets")
        val HIGHLIGHT_CURRENT_LINE = booleanPreferencesKey("highlight_current_line")
        val LAST_OPENED_PATH = stringPreferencesKey("last_opened_path")
    }

    val settings: Flow<AppSettings> = context.dataStore.data.map { prefs ->
        AppSettings(
            isDarkTheme = prefs[Keys.IS_DARK_THEME] ?: true,
            fontSize = prefs[Keys.FONT_SIZE] ?: 14f,
            showLineNumbers = prefs[Keys.SHOW_LINE_NUMBERS] ?: true,
            wordWrap = prefs[Keys.WORD_WRAP] ?: false,
            autoSave = prefs[Keys.AUTO_SAVE] ?: true,
            tabSize = prefs[Keys.TAB_SIZE] ?: 4,
            useSpaces = prefs[Keys.USE_SPACES] ?: true,
            fontFamily = prefs[Keys.FONT_FAMILY] ?: "JetBrains Mono",
            showWhitespace = prefs[Keys.SHOW_WHITESPACE] ?: false,
            autoCloseBrackets = prefs[Keys.AUTO_CLOSE_BRACKETS] ?: true,
            highlightCurrentLine = prefs[Keys.HIGHLIGHT_CURRENT_LINE] ?: true
        )
    }

    val lastOpenedPath: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[Keys.LAST_OPENED_PATH]
    }

    suspend fun updateDarkTheme(isDark: Boolean) {
        context.dataStore.edit { it[Keys.IS_DARK_THEME] = isDark }
    }

    suspend fun updateFontSize(size: Float) {
        context.dataStore.edit { it[Keys.FONT_SIZE] = size }
    }

    suspend fun updateShowLineNumbers(show: Boolean) {
        context.dataStore.edit { it[Keys.SHOW_LINE_NUMBERS] = show }
    }

    suspend fun updateWordWrap(wrap: Boolean) {
        context.dataStore.edit { it[Keys.WORD_WRAP] = wrap }
    }

    suspend fun updateAutoSave(auto: Boolean) {
        context.dataStore.edit { it[Keys.AUTO_SAVE] = auto }
    }

    suspend fun updateTabSize(size: Int) {
        context.dataStore.edit { it[Keys.TAB_SIZE] = size }
    }

    suspend fun updateLastOpenedPath(path: String) {
        context.dataStore.edit { it[Keys.LAST_OPENED_PATH] = path }
    }
}
