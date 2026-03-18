package com.codeflow.editor.ui.git

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codeflow.editor.data.git.FileDiff
import com.codeflow.editor.data.git.GitBranch
import com.codeflow.editor.data.git.GitCommit
import com.codeflow.editor.data.git.GitRepository
import com.codeflow.editor.data.git.GitStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

@HiltViewModel
class GitViewModel @Inject constructor(
    private val gitRepository: GitRepository
) : ViewModel() {

    private val _gitStatus = MutableStateFlow<GitStatus?>(null)
    val gitStatus: StateFlow<GitStatus?> = _gitStatus.asStateFlow()

    private val _branches = MutableStateFlow<List<GitBranch>>(emptyList())
    val branches: StateFlow<List<GitBranch>> = _branches.asStateFlow()

    private val _commits = MutableStateFlow<List<GitCommit>>(emptyList())
    val commits: StateFlow<List<GitCommit>> = _commits.asStateFlow()

    private val _isGitRepo = MutableStateFlow(false)
    val isGitRepo: StateFlow<Boolean> = _isGitRepo.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _currentDiff = MutableStateFlow<FileDiff?>(null)
    val currentDiff: StateFlow<FileDiff?> = _currentDiff.asStateFlow()

    private val _toastMessage = MutableSharedFlow<String>()
    val toastMessage = _toastMessage.asSharedFlow()

    private var rootDirectory: File? = null

    fun setRootDirectory(directory: File?) {
        rootDirectory = directory
        if (directory != null) {
            checkGitRepo(directory)
        } else {
            _isGitRepo.value = false
            _gitStatus.value = null
        }
    }

    private fun checkGitRepo(directory: File) {
        viewModelScope.launch {
            _isGitRepo.value = gitRepository.isGitRepo(directory)
            if (_isGitRepo.value) {
                refreshStatus()
            }
        }
    }

    fun refreshStatus() {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            _isLoading.value = true
            gitRepository.getStatus(dir).fold(
                onSuccess = { _gitStatus.value = it },
                onFailure = { _toastMessage.emit("Git durum hatası: ${it.message}") }
            )
            _isLoading.value = false
        }
    }

    fun refreshBranches() {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.getBranches(dir).fold(
                onSuccess = { _branches.value = it },
                onFailure = { _toastMessage.emit("Branch hatası: ${it.message}") }
            )
        }
    }

    fun refreshLog() {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.getLog(dir).fold(
                onSuccess = { _commits.value = it },
                onFailure = { _toastMessage.emit("Log hatası: ${it.message}") }
            )
        }
    }

    fun stageFile(path: String) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.stageFile(dir, path).fold(
                onSuccess = { refreshStatus() },
                onFailure = { _toastMessage.emit("Stage hatası: ${it.message}") }
            )
        }
    }

    fun unstageFile(path: String) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.unstageFile(dir, path).fold(
                onSuccess = { refreshStatus() },
                onFailure = { _toastMessage.emit("Unstage hatası: ${it.message}") }
            )
        }
    }

    fun stageAll() {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.stageAll(dir).fold(
                onSuccess = { refreshStatus() },
                onFailure = { _toastMessage.emit("Stage hatası: ${it.message}") }
            )
        }
    }

    fun commit(message: String) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            _isLoading.value = true
            gitRepository.commit(dir, message).fold(
                onSuccess = {
                    _toastMessage.emit("Commit başarılı")
                    refreshStatus()
                },
                onFailure = { _toastMessage.emit("Commit hatası: ${it.message}") }
            )
            _isLoading.value = false
        }
    }

    fun pull() {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            _isLoading.value = true
            gitRepository.pull(dir).fold(
                onSuccess = {
                    _toastMessage.emit("Pull başarılı")
                    refreshStatus()
                },
                onFailure = { _toastMessage.emit("Pull hatası: ${it.message}") }
            )
            _isLoading.value = false
        }
    }

    fun push() {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            _isLoading.value = true
            gitRepository.push(dir).fold(
                onSuccess = {
                    _toastMessage.emit("Push başarılı")
                    refreshStatus()
                },
                onFailure = { _toastMessage.emit("Push hatası: ${it.message}") }
            )
            _isLoading.value = false
        }
    }

    fun discardChanges(path: String) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.discardChanges(dir, path).fold(
                onSuccess = { refreshStatus() },
                onFailure = { _toastMessage.emit("Değişiklik iptal hatası: ${it.message}") }
            )
        }
    }

    fun viewDiff(path: String, staged: Boolean) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.getDiff(dir, path, staged).fold(
                onSuccess = { _currentDiff.value = it },
                onFailure = { _toastMessage.emit("Diff hatası: ${it.message}") }
            )
        }
    }

    fun closeDiff() {
        _currentDiff.value = null
    }

    fun checkout(branchName: String) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            _isLoading.value = true
            gitRepository.checkout(dir, branchName).fold(
                onSuccess = {
                    _toastMessage.emit("Branch değiştirildi: $branchName")
                    refreshStatus()
                    refreshBranches()
                },
                onFailure = { _toastMessage.emit("Checkout hatası: ${it.message}") }
            )
            _isLoading.value = false
        }
    }

    fun createBranch(branchName: String) {
        val dir = rootDirectory ?: return
        viewModelScope.launch {
            gitRepository.createBranch(dir, branchName).fold(
                onSuccess = {
                    _toastMessage.emit("Yeni branch: $branchName")
                    refreshStatus()
                    refreshBranches()
                },
                onFailure = { _toastMessage.emit("Branch oluşturma hatası: ${it.message}") }
            )
        }
    }
}
