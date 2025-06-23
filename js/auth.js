// js/auth.js
class AuthHandler {
    constructor(app) {
        this.app = app;
        this.user = null;
        this.isAuthenticated = false;
        this.loadUserFromStorage();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const profileForm = document.getElementById('profile-form');
        const logoutBtn = document.getElementById('logout-btn');
        const changeAvatarBtn = document.getElementById('change-avatar-btn');
        const avatarUpload = document.getElementById('avatar-upload');
        const profileAvatar = document.getElementById('profile-avatar-img');

        if (signinForm) signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
        if (profileForm) profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        
        // Avatar upload functionality
        if (changeAvatarBtn) changeAvatarBtn.addEventListener('click', () => avatarUpload.click());
        if (avatarUpload) avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
        if (profileAvatar) profileAvatar.addEventListener('click', () => avatarUpload.click());
        
        // Settings toggles
        this.setupSettingsToggles();
    }
    
    loadUserFromStorage() {
        const userData = localStorage.getItem('devchat_user');
        const token = localStorage.getItem('devchat_token');
        if (userData && token) {
            try {
                this.user = JSON.parse(userData);
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Error parsing user data from storage:', error);
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
            if (userName) userName.textContent = this.user.name || 'User';
        } else {
            if (navAuth) navAuth.style.display = 'flex';
            if (navUser) navUser.style.display = 'none';
        }
    }
    
    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        if (!email || !password) {
            this.app.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            await this.simulateApiCall(); // Mock API call
            this.user = { id: Date.now(), name: 'Test User', email };
            this.isAuthenticated = true;
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            localStorage.setItem('devchat_token', 'mock_jwt_token');
            this.app.showToast('Sign in successful!', 'success');
            this.updateUI();
            this.app.navigation.navigateToPage('chat');
        } catch (error) {
            this.app.showToast('Sign in failed. Please check your credentials.', 'error');
        }
    }

    async handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        if (!name || !email || !password) {
            this.app.showToast('Please fill in all fields', 'error');
            return;
        }

        try {
            await this.simulateApiCall(); // Mock API call
            this.user = { id: Date.now(), name, email };
            this.isAuthenticated = true;
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            localStorage.setItem('devchat_token', 'mock_jwt_token');
            this.app.showToast('Account created successfully!', 'success');
            this.updateUI();
            this.app.navigation.navigateToPage('chat');
        } catch (error) {
            this.app.showToast('Sign up failed. Please try again.', 'error');
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        if (!this.isAuthenticated) return;
        
        const username = document.getElementById('profile-username').value;
        const displayName = document.getElementById('profile-display-name').value;
        const email = document.getElementById('profile-email').value;
        const bio = document.getElementById('profile-bio').value;
        
        try {
            await this.simulateApiCall(); // Mock API call
            
            // Update user data
            this.user.username = username;
            this.user.displayName = displayName;
            this.user.email = email;
            this.user.bio = bio;
            
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            this.app.showToast('Profile updated successfully', 'success');
            this.updateUI();
        } catch (error) {
            this.app.showToast('Failed to update profile', 'error');
        }
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
        localStorage.removeItem('devchat_user');
        localStorage.removeItem('devchat_token');
        this.app.showToast('You have been logged out', 'info');
        this.updateUI();
        this.app.navigation.navigateToPage('index');
    }

    initSettingsPage() {
        if (!this.isAuthenticated) return;
        
        // Load user data into form
        const elements = {
            'profile-username': this.user.username || '',
            'profile-display-name': this.user.displayName || this.user.name || '',
            'profile-email': this.user.email || '',
            'profile-bio': this.user.bio || ''
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = elements[id];
        });
        
        // Load avatar
        const avatarImg = document.getElementById('profile-avatar-img');
        if (avatarImg && this.user.avatar) {
            avatarImg.src = this.user.avatar;
        }
        
        // Load settings
        this.loadSettings();
    }
    
    simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.app.showToast('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.app.showToast('Image size must be less than 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const avatarImg = document.getElementById('profile-avatar-img');
            const navAvatar = document.querySelector('.user-avatar');
            
            if (avatarImg) avatarImg.src = event.target.result;
            if (navAvatar) navAvatar.src = event.target.result;
            
            // Save to user data
            this.user.avatar = event.target.result;
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            
            this.app.showToast('Avatar updated successfully', 'success');
        };
        reader.readAsDataURL(file);
    }

    setupSettingsToggles() {
        // Appearance settings
        const darkMode = document.getElementById('dark-mode');
        const themeColor = document.getElementById('theme-color');
        
        // Notification settings
        const notifications = document.getElementById('notifications');
        const soundNotifications = document.getElementById('sound-notifications');
        const desktopNotifications = document.getElementById('desktop-notifications');
        
        // Privacy buttons
        const changeEmailBtn = document.getElementById('change-email-btn');
        const changePasswordBtn = document.getElementById('change-password-btn');
        
        // Load saved settings
        this.loadSettings();
        
        // Add event listeners
        if (darkMode) darkMode.addEventListener('change', (e) => this.updateSetting('darkMode', e.target.checked));
        if (themeColor) themeColor.addEventListener('change', (e) => this.updateSetting('themeColor', e.target.value));
        if (notifications) notifications.addEventListener('change', (e) => this.updateSetting('notifications', e.target.checked));
        if (soundNotifications) soundNotifications.addEventListener('change', (e) => this.updateSetting('soundNotifications', e.target.checked));
        if (desktopNotifications) desktopNotifications.addEventListener('change', (e) => this.updateSetting('desktopNotifications', e.target.checked));
        
        // Privacy button handlers
        if (changeEmailBtn) changeEmailBtn.addEventListener('click', () => this.showChangeEmailModal());
        if (changePasswordBtn) changePasswordBtn.addEventListener('click', () => this.showChangePasswordModal());
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('devchat_settings') || '{}');
        
        // Set form values
        const elements = {
            'darkMode': document.getElementById('dark-mode'),
            'themeColor': document.getElementById('theme-color'),
            'notifications': document.getElementById('notifications'),
            'soundNotifications': document.getElementById('sound-notifications'),
            'desktopNotifications': document.getElementById('desktop-notifications')
        };
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && settings[key] !== undefined) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
        
        // Apply theme
        this.applyTheme(settings.themeColor || 'purple');
    }

    updateSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem('devchat_settings') || '{}');
        settings[key] = value;
        localStorage.setItem('devchat_settings', JSON.stringify(settings));
        
        // Apply immediate effects
        if (key === 'themeColor') {
            this.applyTheme(value);
        }
        
        this.app.showToast(`${key} updated`, 'info');
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themes = {
            purple: { primary: '#8B5CF6', hover: '#7C3AED' },
            blue: { primary: '#3B82F6', hover: '#2563EB' },
            green: { primary: '#10B981', hover: '#059669' },
            red: { primary: '#EF4444', hover: '#DC2626' }
        };
        
        const colors = themes[theme] || themes.purple;
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--primary-hover', colors.hover);
    }
    
    showChangeEmailModal() {
        const newEmail = prompt('Enter your new email address:');
        if (newEmail && newEmail.trim()) {
            // In a real app, this would make an API call
            this.user.email = newEmail.trim();
            localStorage.setItem('devchat_user', JSON.stringify(this.user));
            this.app.showToast('Email updated successfully', 'success');
            this.updateUI();
        }
    }
    
    showChangePasswordModal() {
        const currentPassword = prompt('Enter your current password:');
        if (!currentPassword) return;
        
        const newPassword = prompt('Enter your new password:');
        if (!newPassword) return;
        
        const confirmPassword = prompt('Confirm your new password:');
        if (newPassword !== confirmPassword) {
            this.app.showToast('Passwords do not match', 'error');
            return;
        }
        
        // In a real app, this would make an API call
        this.app.showToast('Password updated successfully', 'success');
    }
} 