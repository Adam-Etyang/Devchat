// Navigation and Routing Handler
class NavigationHandler {
    constructor() {
        this.currentPage = 'index';
        this.pageHistory = [];
        this.setupNavigation();
    }

    setupNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.navigateToPage(event.state.page, false);
            }
        });

        // Handle initial page load
        const path = window.location.pathname;
        const page = this.getPageFromPath(path);
        this.navigateToPage(page, false);
    }

    getPageFromPath(path) {
        const pathMap = {
            '/': 'index',
            '/chat': 'chat',
            '/settings': 'settings',
            '/signin': 'signin',
            '/signup': 'signup'
        };
        
        return pathMap[path] || 'index';
    }

    getPathFromPage(page) {
        const pageMap = {
            'index': '/',
            'chat': '/chat',
            'settings': '/settings',
            'signin': '/signin',
            'signup': '/signup'
        };
        
        return pageMap[page] || '/';
    }

    navigateToPage(page, updateHistory = true) {
        if (this.currentPage === page) return;

        // Update current page
        this.currentPage = page;
        
        // Update URL if needed
        if (updateHistory) {
            const path = this.getPathFromPage(page);
            window.history.pushState({ page }, '', path);
        }

        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation active state
        this.updateNavigationActiveState(page);

        // Close mobile menu
        this.closeMobileMenu();

        // Trigger page-specific events
        this.triggerPageEvent(page);
    }

    updateNavigationActiveState(activePage) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to current page link
        const activeLink = document.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }

    triggerPageEvent(page) {
        // Dispatch custom event for page change
        const event = new CustomEvent('pageChange', {
            detail: { page, previousPage: this.pageHistory[this.pageHistory.length - 1] }
        });
        document.dispatchEvent(event);

        // Add to history
        this.pageHistory.push(page);
        if (this.pageHistory.length > 10) {
            this.pageHistory.shift();
        }

        // Page-specific initialization
        switch (page) {
            case 'chat':
                this.initChatPage();
                break;
            case 'settings':
                this.initSettingsPage();
                break;
            case 'signin':
            case 'signup':
                this.initAuthPage();
                break;
        }
    }

    initChatPage() {
        // Initialize chat functionality
        if (window.app && window.app.initChatPage) {
            window.app.initChatPage();
        }
    }

    initSettingsPage() {
        // Initialize settings functionality
        if (window.app && window.app.initSettingsPage) {
            window.app.initSettingsPage();
        }
    }

    initAuthPage() {
        // Clear any existing form data
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }

    // Public method to navigate programmatically
    goToPage(page) {
        this.navigateToPage(page, true);
    }

    // Get current page
    getCurrentPage() {
        return this.currentPage;
    }

    // Check if user is on a specific page
    isOnPage(page) {
        return this.currentPage === page;
    }

    // Handle authentication-based navigation
    handleAuthNavigation() {
        const isAuthenticated = window.app && window.app.isAuthenticated;
        
        if (isAuthenticated) {
            // If user is authenticated and on auth pages, redirect to chat
            if (this.isOnPage('signin') || this.isOnPage('signup')) {
                this.navigateToPage('chat', true);
            }
        } else {
            // If user is not authenticated and on protected pages, redirect to signin
            const protectedPages = ['chat', 'settings'];
            if (protectedPages.includes(this.currentPage)) {
                this.navigateToPage('signin', true);
            }
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new NavigationHandler();
    
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            window.navigation.navigateToPage(page, true);
        }
    });

    // Handle mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}); 