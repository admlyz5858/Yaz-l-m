package com.codeflow.editor.data.repository

import com.codeflow.editor.data.model.FileNode
import com.codeflow.editor.data.model.toFileNode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

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
