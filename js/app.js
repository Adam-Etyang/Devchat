// Main Application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DevChatApp();
});

class DevChatApp {
    constructor() {
        this.navigation = new NavigationHandler(this);
        this.auth = new AuthHandler(this);
        this.chat = new ChatHandler(this);
        this.init();
    }

    init() {
        console.log('DevChat App Initialized');
        this.auth.updateUI();
        this.navigation.navigateToPage(this.navigation.getPageFromPath(window.location.pathname), false);
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
} 