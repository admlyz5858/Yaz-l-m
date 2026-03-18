package com.codeflow.editor.ui.remote

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.LinkOff
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codeflow.editor.data.remote.ConnectionStatus
import com.codeflow.editor.data.remote.SSHAuthMethod
import com.codeflow.editor.data.remote.SSHConnection
import com.codeflow.editor.data.remote.SSHConnectionState
import com.codeflow.editor.ui.theme.EditorTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RemoteConnectionPanel(
    connections: List<SSHConnection>,
    connectionState: SSHConnectionState,
    onConnect: (SSHConnection) -> Unit,
    onDisconnect: () -> Unit,
    onAddConnection: (SSHConnection) -> Unit,
    onDeleteConnection: (String) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = EditorTheme.colors
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Uzak Bağlantılar", color = colors.editorForeground) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Geri", tint = colors.editorForeground)
                    }
                },
                actions = {
                    IconButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Default.Add, "Yeni Bağlantı", tint = colors.editorForeground)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = colors.activityBarBackground)
            )
        },
        containerColor = colors.editorBackground
    ) { paddingValues ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Connection status
            if (connectionState.status != ConnectionStatus.DISCONNECTED) {
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(colors.accent.copy(alpha = 0.1f))
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Cloud, null, tint = colors.accent, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = when (connectionState.status) {
                                    ConnectionStatus.CONNECTING -> "Bağlanıyor..."
                                    ConnectionStatus.AUTHENTICATING -> "Kimlik doğrulanıyor..."
                                    ConnectionStatus.CONNECTED -> "Bağlandı"
                                    ConnectionStatus.ERROR -> "Bağlantı Hatası"
                                    else -> ""
                                },
                                color = colors.editorForeground,
                                fontSize = 13.sp
                            )
                            if (connectionState.serverInfo.isNotBlank()) {
                                Text(connectionState.serverInfo, color = colors.onSurfaceVariant, fontSize = 11.sp)
                            }
                            connectionState.errorMessage?.let {
                                Text(it, color = colors.error, fontSize = 11.sp)
                            }
                        }
                        if (connectionState.status == ConnectionStatus.CONNECTED) {
                            TextButton(onClick = onDisconnect) {
                                Icon(Icons.Default.LinkOff, null, modifier = Modifier.size(14.dp))
                                Text(" Kes", fontSize = 12.sp)
                            }
                        }
                    }
                    HorizontalDivider(color = colors.border)
                }
            }

            // Saved connections
            item {
                Text(
                    text = "KAYITLI BAĞLANTILAR",
                    style = MaterialTheme.typography.labelSmall,
                    color = colors.onSurfaceVariant,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                )
            }

            if (connections.isEmpty()) {
                item {
                    Box(modifier = Modifier.fillMaxWidth().padding(24.dp), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.Cloud, null, tint = colors.onSurfaceVariant.copy(alpha = 0.3f), modifier = Modifier.size(40.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Henüz bağlantı yok", color = colors.onSurfaceVariant, fontSize = 13.sp)
                            Text("SSH ile uzak sunucuya bağlanın", color = colors.onSurfaceVariant.copy(alpha = 0.5f), fontSize = 11.sp)
                        }
                    }
                }
            }

            items(connections, key = { it.id }) { conn ->
                ConnectionItem(
                    connection = conn,
                    isConnected = connectionState.connectionId == conn.id && connectionState.status == ConnectionStatus.CONNECTED,
                    onConnect = { onConnect(conn) },
                    onDelete = { onDeleteConnection(conn.id) }
                )
            }
        }
    }

    if (showAddDialog) {
        AddConnectionDialog(
            onConfirm = { conn ->
                onAddConnection(conn)
                showAddDialog = false
            },
            onDismiss = { showAddDialog = false }
        )
    }
}

@Composable
private fun ConnectionItem(
    connection: SSHConnection,
    isConnected: Boolean,
    onConnect: () -> Unit,
    onDelete: () -> Unit
) {
    val colors = EditorTheme.colors

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onConnect)
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .background(
                    if (isConnected) colors.success.copy(alpha = 0.15f) else colors.sidebarBackground,
                    RoundedCornerShape(8.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                if (isConnected) Icons.Default.Link else Icons.Default.Cloud,
                null,
                tint = if (isConnected) colors.success else colors.onSurfaceVariant,
                modifier = Modifier.size(18.dp)
            )
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(connection.name, color = colors.editorForeground, fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(
                "${connection.username}@${connection.host}:${connection.port}",
                color = colors.onSurfaceVariant,
                fontSize = 11.sp
            )
        }
        IconButton(onClick = onDelete, modifier = Modifier.size(28.dp)) {
            Icon(Icons.Default.Delete, "Sil", tint = colors.error.copy(alpha = 0.6f), modifier = Modifier.size(16.dp))
        }
    }
}

@Composable
private fun AddConnectionDialog(
    onConfirm: (SSHConnection) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var host by remember { mutableStateOf("") }
    var port by remember { mutableStateOf("22") }
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Yeni SSH Bağlantısı") },
        text = {
            Column {
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Bağlantı Adı") }, singleLine = true, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(value = host, onValueChange = { host = it }, label = { Text("Host") }, placeholder = { Text("192.168.1.100") }, singleLine = true, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(6.dp))
                Row {
                    OutlinedTextField(value = port, onValueChange = { port = it }, label = { Text("Port") }, singleLine = true, modifier = Modifier.width(80.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    OutlinedTextField(value = username, onValueChange = { username = it }, label = { Text("Kullanıcı") }, singleLine = true, modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Şifre") }, singleLine = true, modifier = Modifier.fillMaxWidth())
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    onConfirm(SSHConnection(
                        name = name.ifBlank { "$username@$host" },
                        host = host,
                        port = port.toIntOrNull() ?: 22,
                        username = username,
                        password = password
                    ))
                },
                enabled = host.isNotBlank() && username.isNotBlank()
            ) { Text("Ekle") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("İptal") } }
    )
}
