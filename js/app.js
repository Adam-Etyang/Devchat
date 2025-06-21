// Main Application JavaScript
class DevChatApp {
    constructor() {
        this.currentPage = 'index';
        this.isAuthenticated = false;
        this.user = null;
        this.chatHistory = [];
        this.currentChatId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserFromStorage();
        this.updateUI();
        this.showPage('index');
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            }
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Form submissions
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }

        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }

        // Settings
        const darkModeToggle = document.getElementById('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        const notificationsToggle = document.getElementById('notifications');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', (e) => {
                this.toggleNotifications(e.target.checked);
            });
        }

        // Chat functionality
        const newChatBtn = document.getElementById('new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                this.startNewChat();
            });
        }

        const sendButton = document.getElementById('send-button');
        const chatInput = document.getElementById('chat-input');
        
        if (sendButton && chatInput) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });

            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
            });
        }
    }

    showPage(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Update navigation
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            
            const activeLink = document.querySelector(`[data-page="${pageName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Close mobile menu
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }

            // Page-specific initialization
            if (pageName === 'chat') {
                this.initChatPage();
            } else if (pageName === 'settings') {
                this.initSettingsPage();
            }
        }
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('devchat_user');
        const token = localStorage.getItem('devchat_token');
        
        if (userData && token) {
            try {
                this.user = JSON.parse(userData);
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    updateUI() {
        const navAuth = document.getElementById('nav-auth');
        const navUser = document.getElementById('nav-user');
        const userName = document.querySelector('.user-name');

        if (this.isAuthenticated && this.user) {
            if (navAuth) navAuth.style.display = 'none';
            if (navUser) navUser.style.display = 'flex';
            if (userName) userName.textContent = this.user.name || this.user.email;
        } else {
            if (navAuth) navAuth.style.display = 'flex';
            if (navUser) navUser.style.display = 'none';
        }
    }

    async handleSignIn() {
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Mock successful login
            this.user = {
                id: 1,
                name: 'John Doe',
                email: email
            };
            
            this.isAuthenticated = true;
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            localStorage.setItem('devchat_token', 'mock-jwt-token');
            
            this.updateUI();
            this.showToast('Successfully signed in!', 'success');
            this.showPage('chat');
            
        } catch (error) {
            this.showToast('Invalid email or password', 'error');
        }
    }

    async handleSignUp() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Mock successful registration
            this.user = {
                id: 1,
                name: name,
                email: email
            };
            
            this.isAuthenticated = true;
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            localStorage.setItem('devchat_token', 'mock-jwt-token');
            
            this.updateUI();
            this.showToast('Account created successfully!', 'success');
            this.showPage('chat');
            
        } catch (error) {
            this.showToast('Error creating account', 'error');
        }
    }

    async handleProfileUpdate() {
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;

        if (!name || !email) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Update user data
            this.user.name = name;
            this.user.email = email;
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            
            this.updateUI();
            this.showToast('Profile updated successfully!', 'success');
            
        } catch (error) {
            this.showToast('Error updating profile', 'error');
        }
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('devchat_user');
        localStorage.removeItem('devchat_token');
        
        this.updateUI();
        this.showToast('Logged out successfully', 'info');
        this.showPage('index');
    }

    toggleDarkMode(enabled) {
        document.body.classList.toggle('dark-mode', enabled);
        localStorage.setItem('devchat_dark_mode', enabled);
        this.showToast(`Dark mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    toggleNotifications(enabled) {
        localStorage.setItem('devchat_notifications', enabled);
        this.showToast(`Notifications ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    // Chat-specific methods
    initChatPage() {
        this.loadChatHistory();
        this.renderChatHistory();
    }

    startNewChat() {
        this.currentChatId = Date.now().toString();
        this.chatHistory.push({
            id: this.currentChatId,
            title: 'New Chat',
            messages: [],
            timestamp: new Date()
        });
        
        this.renderChatHistory();
        this.clearChatMessages();
        this.showToast('New chat started', 'info');
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;

        if (!this.isAuthenticated) {
            this.showToast('Please sign in to chat', 'error');
            return;
        }

        // Add user message
        this.addMessageToChat('user', message);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateMockResponse(message);
            this.addMessageToChat('assistant', response);
        }, 1500);
    }

    addMessageToChat(sender, content) {
        if (!this.currentChatId) {
            this.startNewChat();
        }

        const message = {
            id: Date.now().toString(),
            sender,
            content,
            timestamp: new Date()
        };

        const currentChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
        if (currentChat) {
            currentChat.messages.push(message);
            if (currentChat.messages.length === 1) {
                currentChat.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
            }
        }

        this.renderMessage(message);
        this.renderChatHistory();
    }

    renderMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        
        const timestamp = message.timestamp.toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span>${message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                <span>${timestamp}</span>
            </div>
            <div class="message-content">${this.formatMessageContent(message.content)}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessageContent(content) {
        // Simple markdown-like formatting
        return content
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            AI is typing
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateMockResponse(userMessage) {
        const responses = [
            "I can help you with that! Here's a solution:\n\n```javascript\nconsole.log('Hello, World!');\n```",
            "That's a great question. Let me explain:\n\n**Key Points:**\n- Point 1\n- Point 2\n- Point 3\n\nWould you like me to elaborate on any of these?",
            "Here's how you can approach this problem:\n\n1. First, understand the requirements\n2. Break it down into smaller tasks\n3. Implement step by step\n4. Test thoroughly",
            "I understand what you're asking about. This is a common pattern in programming. Here's an example:\n\n```python\ndef example_function():\n    return 'Hello from Python!'\n```"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    loadChatHistory() {
        const savedHistory = localStorage.getItem('devchat_chat_history');
        if (savedHistory) {
            try {
                this.chatHistory = JSON.parse(savedHistory);
            } catch (error) {
                console.error('Error loading chat history:', error);
                this.chatHistory = [];
            }
        }
    }

    renderChatHistory() {
        const chatHistoryContainer = document.getElementById('chat-history');
        if (!chatHistoryContainer) return;

        chatHistoryContainer.innerHTML = '';
        
        this.chatHistory.forEach(chat => {
            const chatElement = document.createElement('div');
            chatElement.className = `chat-history-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            chatElement.innerHTML = `
                <div class="chat-title">${chat.title}</div>
                <div class="chat-timestamp">${chat.timestamp.toLocaleDateString()}</div>
            `;
            
            chatElement.addEventListener('click', () => {
                this.loadChat(chat.id);
            });
            
            chatHistoryContainer.appendChild(chatElement);
        });

        // Save to localStorage
        localStorage.setItem('devchat_chat_history', JSON.stringify(this.chatHistory));
    }

    loadChat(chatId) {
        this.currentChatId = chatId;
        this.renderChatHistory();
        this.clearChatMessages();
        
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (chat) {
            chat.messages.forEach(message => {
                this.renderMessage(message);
            });
        }
    }

    clearChatMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="welcome-message">
                    <h2>Welcome to DevChat!</h2>
                    <p>Ask me anything about programming, and I'll help you out.</p>
                </div>
            `;
        }
    }

    initSettingsPage() {
        // Load saved settings
        const darkMode = localStorage.getItem('devchat_dark_mode') === 'true';
        const notifications = localStorage.getItem('devchat_notifications') === 'true';
        
        const darkModeToggle = document.getElementById('dark-mode');
        const notificationsToggle = document.getElementById('notifications');
        
        if (darkModeToggle) darkModeToggle.checked = darkMode;
        if (notificationsToggle) notificationsToggle.checked = notifications;
        
        // Load user data into form
        if (this.user) {
            const nameInput = document.getElementById('profile-name');
            const emailInput = document.getElementById('profile-email');
            
            if (nameInput) nameInput.value = this.user.name || '';
            if (emailInput) emailInput.value = this.user.email || '';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DevChatApp();
}); 