import { authFetch } from './api.js';

let stompClient = null;
let currentUsername = 'DemoUser';
let messageCount = { sent: 0, received: 0 };
let onlineUsers = new Set(['Alex', 'DemoUser', 'Sara']); // Initial users

// Initialize WebSocket connection when page loads
window.addEventListener('load', function() {
    connect();
});

function connect() {
    try {
        console.log('Attempting to connect to WebSocket...');
        const socket = new SockJS('http://localhost:8080/chat-websocket');
        stompClient = Stomp.over(socket);
        
        stompClient.connect({}, function(frame) {
            console.log('Connected to WebSocket:', frame);
            
            // Subscribe to public messages
            stompClient.subscribe('/topic/public', function(message) {
                console.log('Received message:', message);
                messageCount.received++;
                const chatMessage = JSON.parse(message.body);
                showMessage(chatMessage);
            });
            
            // Send join notification
            const joinMessage = {
                sender: currentUsername,
                receiver: 'public',
                content: 'joined the chat',
                type: 'JOIN',
                timestamp: new Date().toISOString()
            };
            stompClient.send('/app/chat.addUser', {}, JSON.stringify(joinMessage));
            messageCount.sent++;
            
        }, function(error) {
            console.error('WebSocket connection error:', error);
            // Fallback to local chat if WebSocket fails
            console.log('Falling back to local chat mode');
        });
        
    } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        // Fallback to local chat if WebSocket fails
        console.log('Falling back to local chat mode');
    }
}

function appendMessage(innerHtml) {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = 'message';
    message.innerHTML = innerHtml;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function showMessage(chatMessage) {
    let avatarColor = '#c084fc'; // Default color
    let displayName = chatMessage.sender;
    
    // Set avatar color based on user
    if (chatMessage.sender === 'Alex') avatarColor = '#6b7280';
    else if (chatMessage.sender === 'DemoUser') avatarColor = '#c084fc';
    else if (chatMessage.sender === 'Sara') avatarColor = '#facc15';
    
    if (chatMessage.sender === currentUsername) {
        displayName = 'You';
    }

    let messageContent = chatMessage.content;
    if (chatMessage.type === 'JOIN') {
        messageContent = 'joined the chat! 👋';
        onlineUsers.add(chatMessage.sender);
    } else if (chatMessage.type === 'LEAVE') {
        messageContent = 'left the chat 👋';
        onlineUsers.delete(chatMessage.sender);
    }

    // Format timestamp
    let timeDisplay = 'Just now';
    if (chatMessage.timestamp) {
        const messageTime = new Date(chatMessage.timestamp);
        const now = new Date();
        const diffMs = now - messageTime;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) {
            timeDisplay = 'Just now';
        } else if (diffMins < 60) {
            timeDisplay = `${diffMins}m ago`;
        } else {
            timeDisplay = messageTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }

    const msgHtml = `
        <div class="avatar" style="background-color:${avatarColor};">${chatMessage.sender.charAt(0).toUpperCase()}</div>
        <div class="msg-content">
            <div><span class="msg-user">${displayName}</span><span class="msg-time">${timeDisplay}</span></div>
            <div>${messageContent}</div>
        </div>`;
    
    appendMessage(msgHtml);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (text === '') return;

    if (stompClient && stompClient.connected) {
        // Send via WebSocket
        const chatMessage = {
            sender: currentUsername,
            receiver: 'public',
            content: text,
            type: 'CHAT',
            timestamp: new Date().toISOString()
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageCount.sent++;
    } else {
        // Fallback to local display
        const msgHtml = `
            <div class="avatar" style="background-color:#c084fc;">Y</div>
            <div class="msg-content">
                <div><span class="msg-user">You</span><span class="msg-time">Just now</span></div>
                <div>${text}</div>
            </div>`;
        appendMessage(msgHtml);
    }
    
    input.value = '';
}

// Handle Enter key in chat input
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Image upload handler
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function(ev) {
        const imgSrc = ev.target.result;
        const imgHtml = `
            <div class="avatar" style="background-color:#c084fc;">Y</div>
            <div class="msg-content">
                <div><span class="msg-user">You</span><span class="msg-time">Just now</span></div>
                <img src="${imgSrc}" alt="shared image" class="shared-img" />
            </div>`;
        appendMessage(imgHtml);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
});

// File upload handler
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const fileHtml = `
        <div class="avatar" style="background-color:#c084fc;">Y</div>
        <div class="msg-content">
            <div><span class="msg-user">You</span><span class="msg-time">Just now</span></div>
            <a href="${url}" download="${file.name}" class="file-link">📄 ${file.name}</a>
        </div>`;
    appendMessage(fileHtml);
    e.target.value = '';
});