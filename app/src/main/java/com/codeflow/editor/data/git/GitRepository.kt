package com.codeflow.editor.data.git

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GitRepository @Inject constructor() {

    suspend fun isGitRepo(directory: File): Boolean = withContext(Dispatchers.IO) {
        File(directory, ".git").exists() || runGitCommand(directory, "rev-parse", "--is-inside-work-tree").isSuccess
    }

    suspend fun getStatus(directory: File): Result<GitStatus> = withContext(Dispatchers.IO) {
        try {
            val branchResult = runGitCommand(directory, "branch", "--show-current")
            val branch = branchResult.getOrDefault("").trim()

            val statusResult = runGitCommand(directory, "status", "--porcelain=v1")
            val statusOutput = statusResult.getOrDefault("")

            val staged = mutableListOf<GitFileChange>()
            val unstaged = mutableListOf<GitFileChange>()
            val untracked = mutableListOf<GitFileChange>()

            statusOutput.lines().filter { it.length >= 3 }.forEach { line ->
                val indexStatus = line[0]
                val workTreeStatus = line[1]
                val relativePath = line.substring(3).trim().removeSurrounding("\"")
                val file = File(directory, relativePath)

                if (indexStatus == '?' && workTreeStatus == '?') {
                    untracked.add(GitFileChange(file, relativePath, FileStatus.UNTRACKED))
                } else {
                    if (indexStatus != ' ' && indexStatus != '?') {
                        staged.add(GitFileChange(file, relativePath, parseStatus(indexStatus), isStaged = true))
                    }
                    if (workTreeStatus != ' ' && workTreeStatus != '?') {
                        unstaged.add(GitFileChange(file, relativePath, parseStatus(workTreeStatus)))
                    }
                }
            }

            // Ahead/behind
            var ahead = 0
            var behind = 0
            val abResult = runGitCommand(directory, "rev-list", "--left-right", "--count", "HEAD...@{upstream}")
            abResult.getOrNull()?.trim()?.split("\\s+".toRegex())?.let { parts ->
                if (parts.size == 2) {
                    ahead = parts[0].toIntOrNull() ?: 0
                    behind = parts[1].toIntOrNull() ?: 0
                }
            }

            Result.success(GitStatus(
                branch = branch.ifBlank { "HEAD (detached)" },
                isClean = staged.isEmpty() && unstaged.isEmpty() && untracked.isEmpty(),
                stagedChanges = staged,
                unstagedChanges = unstaged,
                untrackedFiles = untracked,
                ahead = ahead,
                behind = behind
            ))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getBranches(directory: File): Result<List<GitBranch>> = withContext(Dispatchers.IO) {
        try {
            val result = runGitCommand(directory, "branch", "-a", "--no-color")
            val branches = result.getOrDefault("").lines()
                .filter { it.isNotBlank() }
                .map { line ->
                    val isCurrent = line.startsWith("*")
                    val name = line.removePrefix("*").trim()
                    val isRemote = name.startsWith("remotes/")
                    GitBranch(
                        name = if (isRemote) name.removePrefix("remotes/") else name,
                        isCurrent = isCurrent,
                        isRemote = isRemote
                    )
                }
            Result.success(branches)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getLog(directory: File, limit: Int = 50): Result<List<GitCommit>> = withContext(Dispatchers.IO) {
        try {
            val format = "%H|%h|%s|%an|%ar"
            val result = runGitCommand(directory, "log", "--format=$format", "-n", "$limit")
            val headResult = runGitCommand(directory, "rev-parse", "HEAD")
            val headHash = headResult.getOrDefault("").trim()

            val commits = result.getOrDefault("").lines()
                .filter { it.contains("|") }
                .map { line ->
                    val parts = line.split("|", limit = 5)
                    GitCommit(
                        hash = parts.getOrElse(0) { "" },
                        shortHash = parts.getOrElse(1) { "" },
                        message = parts.getOrElse(2) { "" },
                        author = parts.getOrElse(3) { "" },
                        date = parts.getOrElse(4) { "" },
                        isHead = parts.getOrElse(0) { "" } == headHash
                    )
                }
            Result.success(commits)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getDiff(directory: File, filePath: String, staged: Boolean = false): Result<FileDiff> = withContext(Dispatchers.IO) {
        try {
            val args = if (staged) {
                arrayOf("diff", "--cached", "--", filePath)
            } else {
                arrayOf("diff", "--", filePath)
            }
            val result = runGitCommand(directory, *args)
            val diffOutput = result.getOrDefault("")
            Result.success(parseDiff(filePath, diffOutput))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun stageFile(directory: File, filePath: String): Result<Unit> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "add", filePath).map { }
    }

    suspend fun unstageFile(directory: File, filePath: String): Result<Unit> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "reset", "HEAD", filePath).map { }
    }

    suspend fun stageAll(directory: File): Result<Unit> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "add", "-A").map { }
    }

    suspend fun commit(directory: File, message: String): Result<String> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "commit", "-m", message)
    }

    suspend fun pull(directory: File): Result<String> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "pull")
    }

    suspend fun push(directory: File): Result<String> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "push")
    }

    suspend fun checkout(directory: File, branchName: String): Result<String> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "checkout", branchName)
    }

    suspend fun createBranch(directory: File, branchName: String): Result<String> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "checkout", "-b", branchName)
    }

    suspend fun discardChanges(directory: File, filePath: String): Result<Unit> = withContext(Dispatchers.IO) {
        runGitCommand(directory, "checkout", "--", filePath).map { }
    }

    // --- Internal ---

    private fun runGitCommand(directory: File, vararg args: String): Result<String> {
        return try {
            val command = listOf("git") + args.toList()
            val process = ProcessBuilder(command)
                .directory(directory)
                .redirectErrorStream(false)
                .start()

            val stdout = BufferedReader(InputStreamReader(process.inputStream)).readText()
            val stderr = BufferedReader(InputStreamReader(process.errorStream)).readText()
            val exitCode = process.waitFor()

            if (exitCode == 0) {
                Result.success(stdout)
            } else {
                Result.failure(Exception(stderr.ifBlank { "Git komutu başarısız (çıkış: $exitCode)" }))
            }
        } catch (e: Exception) {
            Result.failure(Exception("Git çalıştırılamadı: ${e.message}"))
        }
    }

    private fun parseStatus(char: Char): FileStatus {
        return when (char) {
            'M' -> FileStatus.MODIFIED
            'A' -> FileStatus.ADDED
            'D' -> FileStatus.DELETED
            'R' -> FileStatus.RENAMED
            'U' -> FileStatus.CONFLICTED
            else -> FileStatus.MODIFIED
        }
    }

    private fun parseDiff(filePath: String, diffOutput: String): FileDiff {
        if (diffOutput.isBlank()) {
            return FileDiff(filePath, emptyList())
        }

        val lines = mutableListOf<DiffLine>()
        var additions = 0
        var deletions = 0
        var oldLine = 0
        var newLine = 0

        diffOutput.lines().forEach { line ->
            when {
                line.startsWith("diff --git") || line.startsWith("index ") ||
                        line.startsWith("---") || line.startsWith("+++") -> {
                    lines.add(DiffLine(line, DiffLineType.HEADER))
                }
                line.startsWith("@@") -> {
                    lines.add(DiffLine(line, DiffLineType.HUNK_HEADER))
                    val match = Regex("@@ -(\\d+)(?:,\\d+)? \\+(\\d+)(?:,\\d+)? @@").find(line)
                    oldLine = match?.groupValues?.get(1)?.toIntOrNull() ?: 0
                    newLine = match?.groupValues?.get(2)?.toIntOrNull() ?: 0
                }
                line.startsWith("+") -> {
                    lines.add(DiffLine(line, DiffLineType.ADDED, newLineNumber = newLine))
                    additions++
                    newLine++
                }
                line.startsWith("-") -> {
                    lines.add(DiffLine(line, DiffLineType.REMOVED, oldLineNumber = oldLine))
                    deletions++
                    oldLine++
                }
                else -> {
                    lines.add(DiffLine(line, DiffLineType.CONTEXT, oldLine, newLine))
                    oldLine++
                    newLine++
                }
            }
        }

        return FileDiff(filePath, lines, additions, deletions)
    }
}
