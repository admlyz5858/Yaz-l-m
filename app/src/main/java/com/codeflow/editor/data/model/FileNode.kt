package com.codeflow.editor.data.model

import java.io.File

data class FileNode(
    val file: File,
    val name: String = file.name,
    val isDirectory: Boolean = file.isDirectory,
    val children: List<FileNode> = emptyList(),
    val isExpanded: Boolean = false,
    val depth: Int = 0
) {
    val extension: String
        get() = if (isDirectory) "" else file.extension.lowercase()

    val path: String
        get() = file.absolutePath
}

fun File.toFileNode(depth: Int = 0, expandedPaths: Set<String> = emptySet()): FileNode {
    val isExpanded = expandedPaths.contains(absolutePath)
    val children = if (isDirectory && isExpanded) {
        listFiles()
            ?.sortedWith(compareBy<File> { !it.isDirectory }.thenBy { it.name.lowercase() })
            ?.map { it.toFileNode(depth + 1, expandedPaths) }
            ?: emptyList()
    } else {
        emptyList()
    }
    return FileNode(
        file = this,
        isDirectory = isDirectory,
        children = children,
        isExpanded = isExpanded,
        depth = depth
    )
}
