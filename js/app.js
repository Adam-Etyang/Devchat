// Main Application Class
class App {
    constructor() {
        this.navigation = null;
        this.auth = null;
        this.chat = null;
        this.init();
    }

    init() {
        // Initialize modules
        this.navigation = new NavigationHandler(this);
        this.auth = new AuthHandler(this);
        this.chat = new ChatHandler(this);
        
        // Initialize UI
        this.auth.updateUI();
        this.navigation.updateNavLinks();
        
        // Show initial page
        const currentPage = this.navigation.getPageFromPath(window.location.pathname);
        this.navigation.navigateToPage(currentPage, false);
        
        console.log('DevChat App initialized');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    // Utility methods
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 