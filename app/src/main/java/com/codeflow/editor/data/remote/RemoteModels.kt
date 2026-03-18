package com.codeflow.editor.data.remote

import java.util.UUID

// --- SSH Connection ---

data class SSHConnection(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val host: String,
    val port: Int = 22,
    val username: String,
    val authMethod: SSHAuthMethod = SSHAuthMethod.PASSWORD,
    val password: String = "",
    val privateKeyPath: String = "",
    val passphrase: String = "",
    val remotePath: String = "~",
    val isConnected: Boolean = false,
    val lastConnected: Long = 0L
)

enum class SSHAuthMethod {
    PASSWORD,
    PRIVATE_KEY
}

data class SSHConnectionState(
    val connectionId: String = "",
    val status: ConnectionStatus = ConnectionStatus.DISCONNECTED,
    val errorMessage: String? = null,
    val remotePath: String = "",
    val serverInfo: String = ""
)

enum class ConnectionStatus {
    DISCONNECTED,
    CONNECTING,
    AUTHENTICATING,
    CONNECTED,
    ERROR
}

// --- Port Forwarding ---

data class PortForward(
    val id: String = UUID.randomUUID().toString(),
    val localPort: Int,
    val remotePort: Int,
    val remoteHost: String = "localhost",
    val isActive: Boolean = false
)

// --- Cloud Sync ---

data class CloudSyncConfig(
    val enabled: Boolean = false,
    val provider: CloudProvider = CloudProvider.NONE,
    val lastSyncTime: Long = 0L,
    val syncSettings: Boolean = true,
    val syncSnippets: Boolean = true,
    val syncExtensions: Boolean = true,
    val syncKeybindings: Boolean = true
)

enum class CloudProvider(val displayName: String) {
    NONE("Kapalı"),
    GITHUB("GitHub Gist"),
    GOOGLE_DRIVE("Google Drive"),
    CUSTOM("Özel Sunucu")
}

// --- Collaboration ---

data class CollaborationSession(
    val id: String = UUID.randomUUID().toString(),
    val hostName: String = "",
    val participants: List<Participant> = emptyList(),
    val isHost: Boolean = false,
    val shareLink: String = "",
    val isActive: Boolean = false
)

data class Participant(
    val id: String,
    val name: String,
    val color: Long,
    val cursorPosition: CursorPosition? = null,
    val isFollowing: Boolean = false
)

data class CursorPosition(
    val filePath: String,
    val line: Int,
    val character: Int
)

// --- Dev Container ---

data class DevContainerConfig(
    val name: String = "",
    val image: String = "",
    val forwardPorts: List<Int> = emptyList(),
    val postCreateCommand: String = "",
    val extensions: List<String> = emptyList(),
    val settings: Map<String, Any> = emptyMap()
)
