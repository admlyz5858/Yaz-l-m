package com.codeflow.editor.data.lsp

import java.io.File

// --- LSP Position & Range ---

data class LspPosition(val line: Int, val character: Int)

data class LspRange(val start: LspPosition, val end: LspPosition)

data class LspLocation(val uri: String, val range: LspRange) {
    val file: File get() = File(uri.removePrefix("file://"))
}

// --- Completion ---

enum class CompletionItemKind(val value: Int, val icon: String) {
    TEXT(1, "Aa"),
    METHOD(2, "fn"),
    FUNCTION(3, "fn"),
    CONSTRUCTOR(4, "C"),
    FIELD(5, "F"),
    VARIABLE(6, "V"),
    CLASS(7, "C"),
    INTERFACE(8, "I"),
    MODULE(9, "M"),
    PROPERTY(10, "P"),
    UNIT(11, "U"),
    VALUE(12, "="),
    ENUM(13, "E"),
    KEYWORD(14, "K"),
    SNIPPET(15, "S"),
    COLOR(16, "#"),
    FILE(17, "📄"),
    REFERENCE(18, "&"),
    FOLDER(19, "📁"),
    ENUM_MEMBER(20, "e"),
    CONSTANT(21, "c"),
    STRUCT(22, "S"),
    EVENT(23, "ev"),
    OPERATOR(24, "op"),
    TYPE_PARAMETER(25, "T");

    companion object {
        fun fromValue(value: Int): CompletionItemKind =
            entries.find { it.value == value } ?: TEXT
    }
}

data class CompletionItem(
    val label: String,
    val kind: CompletionItemKind = CompletionItemKind.TEXT,
    val detail: String = "",
    val documentation: String = "",
    val insertText: String = label,
    val sortText: String = label,
    val filterText: String = label
)

// --- Diagnostics ---

enum class DiagnosticSeverity(val value: Int, val label: String) {
    ERROR(1, "Hata"),
    WARNING(2, "Uyarı"),
    INFORMATION(3, "Bilgi"),
    HINT(4, "İpucu");

    companion object {
        fun fromValue(value: Int): DiagnosticSeverity =
            entries.find { it.value == value } ?: INFORMATION
    }
}

data class Diagnostic(
    val range: LspRange,
    val severity: DiagnosticSeverity = DiagnosticSeverity.ERROR,
    val code: String = "",
    val source: String = "",
    val message: String,
    val relatedInformation: List<String> = emptyList()
)

// --- Hover ---

data class HoverInfo(
    val contents: String,
    val range: LspRange? = null
)

// --- Signature Help ---

data class SignatureInfo(
    val label: String,
    val documentation: String = "",
    val parameters: List<ParameterInfo> = emptyList(),
    val activeParameter: Int = 0
)

data class ParameterInfo(
    val label: String,
    val documentation: String = ""
)

// --- Document Symbols (Outline) ---

enum class SymbolKind(val value: Int, val icon: String) {
    FILE(1, "📄"), MODULE(2, "📦"), NAMESPACE(3, "{}"),
    PACKAGE(4, "📦"), CLASS(5, "C"), METHOD(6, "fn"),
    PROPERTY(7, "P"), FIELD(8, "F"), CONSTRUCTOR(9, "C"),
    ENUM(10, "E"), INTERFACE(11, "I"), FUNCTION(12, "fn"),
    VARIABLE(13, "V"), CONSTANT(14, "c"), STRING(15, "\""),
    NUMBER(16, "#"), BOOLEAN(17, "b"), ARRAY(18, "[]"),
    OBJECT(19, "{}"), KEY(20, "K"), NULL(21, "∅"),
    ENUM_MEMBER(22, "e"), STRUCT(23, "S"), EVENT(24, "ev"),
    OPERATOR(25, "op"), TYPE_PARAMETER(26, "T");

    companion object {
        fun fromValue(value: Int): SymbolKind =
            entries.find { it.value == value } ?: VARIABLE
    }
}

data class DocumentSymbol(
    val name: String,
    val detail: String = "",
    val kind: SymbolKind,
    val range: LspRange,
    val selectionRange: LspRange,
    val children: List<DocumentSymbol> = emptyList()
)

// --- Code Actions ---

data class CodeAction(
    val title: String,
    val kind: String = "",
    val isPreferred: Boolean = false,
    val diagnostics: List<Diagnostic> = emptyList()
)

// --- Workspace Edit ---

data class TextEdit(
    val range: LspRange,
    val newText: String
)

// --- LSP Server Configuration ---

data class LspServerConfig(
    val language: String,
    val command: String,
    val args: List<String> = emptyList(),
    val rootUri: String = "",
    val initializationOptions: Map<String, Any> = emptyMap()
)

// --- LSP Connection State ---

enum class LspConnectionState {
    DISCONNECTED,
    CONNECTING,
    INITIALIZING,
    READY,
    ERROR
}

data class LspServerStatus(
    val language: String,
    val serverName: String = "",
    val state: LspConnectionState = LspConnectionState.DISCONNECTED,
    val errorMessage: String? = null,
    val capabilities: Set<String> = emptySet()
)
