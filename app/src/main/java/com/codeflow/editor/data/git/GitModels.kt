package com.codeflow.editor.data.git

import java.io.File

enum class FileStatus(val symbol: String, val label: String) {
    MODIFIED("M", "Değiştirildi"),
    ADDED("A", "Eklendi"),
    DELETED("D", "Silindi"),
    RENAMED("R", "Yeniden adlandırıldı"),
    UNTRACKED("?", "İzlenmeyen"),
    CONFLICTED("U", "Çakışma")
}

data class GitFileChange(
    val file: File,
    val relativePath: String,
    val status: FileStatus,
    val isStaged: Boolean = false
)

data class GitBranch(
    val name: String,
    val isCurrent: Boolean = false,
    val isRemote: Boolean = false
)

data class GitCommit(
    val hash: String,
    val shortHash: String,
    val message: String,
    val author: String,
    val date: String,
    val isHead: Boolean = false
)

data class GitStatus(
    val branch: String = "",
    val isClean: Boolean = true,
    val stagedChanges: List<GitFileChange> = emptyList(),
    val unstagedChanges: List<GitFileChange> = emptyList(),
    val untrackedFiles: List<GitFileChange> = emptyList(),
    val ahead: Int = 0,
    val behind: Int = 0
) {
    val totalChanges: Int
        get() = stagedChanges.size + unstagedChanges.size + untrackedFiles.size
}

data class DiffLine(
    val content: String,
    val type: DiffLineType,
    val oldLineNumber: Int? = null,
    val newLineNumber: Int? = null
)

enum class DiffLineType {
    CONTEXT, ADDED, REMOVED, HEADER, HUNK_HEADER
}

data class FileDiff(
    val filePath: String,
    val lines: List<DiffLine>,
    val additions: Int = 0,
    val deletions: Int = 0
)
