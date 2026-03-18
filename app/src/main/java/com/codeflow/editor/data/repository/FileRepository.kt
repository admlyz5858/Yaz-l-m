package com.codeflow.editor.data.repository

import com.codeflow.editor.data.model.FileNode
import com.codeflow.editor.data.model.toFileNode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

data class SearchMatch(
    val file: File,
    val lineNumber: Int,
    val lineContent: String,
    val matchStart: Int,
    val matchEnd: Int
)

@Singleton
class FileRepository @Inject constructor() {

    suspend fun readFile(file: File): Result<String> = withContext(Dispatchers.IO) {
        try {
            Result.success(file.readText())
        } catch (e: IOException) {
            Result.failure(e)
        } catch (e: OutOfMemoryError) {
            Result.failure(Exception("Dosya çok büyük: ${file.name}"))
        }
    }

    suspend fun writeFile(file: File, content: String): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            file.writeText(content)
            Result.success(Unit)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }

    suspend fun createFile(parent: File, name: String): Result<File> = withContext(Dispatchers.IO) {
        try {
            val newFile = File(parent, name)
            if (newFile.exists()) {
                return@withContext Result.failure(Exception("'$name' zaten mevcut"))
            }
            newFile.createNewFile()
            Result.success(newFile)
        } catch (e: IOException) {
            Result.failure(e)
        }
    }

    suspend fun createFolder(parent: File, name: String): Result<File> = withContext(Dispatchers.IO) {
        try {
            val newDir = File(parent, name)
            if (newDir.exists()) {
                return@withContext Result.failure(Exception("'$name' zaten mevcut"))
            }
            if (newDir.mkdirs()) {
                Result.success(newDir)
            } else {
                Result.failure(Exception("Klasör oluşturulamadı"))
            }
        } catch (e: SecurityException) {
            Result.failure(e)
        }
    }

    suspend fun deleteFile(file: File): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            if (file.isDirectory) {
                file.deleteRecursively()
            } else {
                file.delete()
            }
            Result.success(Unit)
        } catch (e: SecurityException) {
            Result.failure(e)
        }
    }

    suspend fun renameFile(file: File, newName: String): Result<File> = withContext(Dispatchers.IO) {
        try {
            val newFile = File(file.parentFile, newName)
            if (newFile.exists()) {
                return@withContext Result.failure(Exception("'$newName' zaten mevcut"))
            }
            if (file.renameTo(newFile)) {
                Result.success(newFile)
            } else {
                Result.failure(Exception("Yeniden adlandırma başarısız"))
            }
        } catch (e: SecurityException) {
            Result.failure(e)
        }
    }

    fun buildFileTree(root: File, expandedPaths: Set<String>): FileNode {
        return root.toFileNode(depth = 0, expandedPaths = expandedPaths)
    }

    fun collectAllFiles(root: File): List<File> {
        val result = mutableListOf<File>()
        collectFilesRecursive(root, result, maxDepth = 8, maxFiles = 5000)
        return result
    }

    private fun collectFilesRecursive(dir: File, result: MutableList<File>, maxDepth: Int, maxFiles: Int, depth: Int = 0) {
        if (depth > maxDepth || result.size >= maxFiles) return
        val children = dir.listFiles() ?: return
        for (child in children.sortedBy { it.name.lowercase() }) {
            if (child.name.startsWith(".")) continue
            if (child.name == "node_modules" || child.name == "build" || child.name == "__pycache__") continue
            if (child.isFile) {
                result.add(child)
            } else if (child.isDirectory) {
                collectFilesRecursive(child, result, maxDepth, maxFiles, depth + 1)
            }
        }
    }

    suspend fun searchInFiles(
        root: File,
        query: String,
        caseSensitive: Boolean = false,
        maxResults: Int = 500
    ): List<SearchMatch> = withContext(Dispatchers.IO) {
        val results = mutableListOf<SearchMatch>()
        searchFilesRecursive(root, query, caseSensitive, results, maxResults, maxDepth = 8)
        results
    }

    private fun searchFilesRecursive(
        dir: File,
        query: String,
        caseSensitive: Boolean,
        results: MutableList<SearchMatch>,
        maxResults: Int,
        maxDepth: Int,
        depth: Int = 0
    ) {
        if (depth > maxDepth || results.size >= maxResults) return
        val children = dir.listFiles() ?: return
        for (child in children) {
            if (results.size >= maxResults) return
            if (child.name.startsWith(".")) continue
            if (child.name == "node_modules" || child.name == "build" || child.name == "__pycache__") continue

            if (child.isDirectory) {
                searchFilesRecursive(child, query, caseSensitive, results, maxResults, maxDepth, depth + 1)
            } else if (child.isFile && child.length() < 1_000_000) {
                try {
                    val lines = child.readLines()
                    val searchQuery = if (caseSensitive) query else query.lowercase()
                    lines.forEachIndexed { index, line ->
                        if (results.size >= maxResults) return
                        val searchLine = if (caseSensitive) line else line.lowercase()
                        var startPos = 0
                        while (true) {
                            val matchPos = searchLine.indexOf(searchQuery, startPos)
                            if (matchPos == -1) break
                            results.add(
                                SearchMatch(
                                    file = child,
                                    lineNumber = index + 1,
                                    lineContent = line,
                                    matchStart = matchPos,
                                    matchEnd = matchPos + query.length
                                )
                            )
                            startPos = matchPos + 1
                        }
                    }
                } catch (_: Exception) {
                    // Skip unreadable files
                }
            }
        }
    }

    fun getFileIcon(extension: String): String {
        return when (extension.lowercase()) {
            "kt", "kts" -> "🟣"
            "java" -> "☕"
            "js", "mjs" -> "🟨"
            "ts", "mts" -> "🔷"
            "py" -> "🐍"
            "html", "htm" -> "🌐"
            "css", "scss", "less" -> "🎨"
            "json" -> "📋"
            "xml" -> "📄"
            "md" -> "📝"
            "yaml", "yml" -> "⚙️"
            "sh", "bash" -> "💻"
            "sql" -> "🗃️"
            "c", "h" -> "🔵"
            "cpp", "hpp" -> "🔵"
            "rs" -> "🦀"
            "go" -> "🔹"
            "swift" -> "🍎"
            "dart" -> "🎯"
            "gradle" -> "🐘"
            "txt" -> "📄"
            "gitignore" -> "🚫"
            "env" -> "🔒"
            else -> "📄"
        }
    }
}
