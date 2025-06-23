// Navigation and Routing Handler
class NavigationHandler {
    constructor(app) {
        this.app = app;
        this.currentPage = 'index';
        this.pageHistory = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateToPage(e.state.page, false);
            }
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) {
                    navMenu.classList.toggle('active');
                }
            });
        }
    }

    getPageFromPath(path) {
        const pageMap = {
            '/': 'index',
            '/chat': 'chat',
            '/settings': 'settings',
            '/signin': 'signin',
            '/signup': 'signup'
        };
        return pageMap[path] || 'index';
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

    navigateToPage(pageName, addToHistory = true) {
        if (!pageName) return;

        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Set body class for page-specific styling
            document.body.className = `page-${pageName}`;

            if (addToHistory) {
                const path = this.getPathFromPage(pageName);
                window.history.pushState({ page: pageName }, '', path);
            }
            
            this.updateNavLinks();
            this.pageHistory.push(pageName);
            
            // Trigger page-specific initializations
            if (pageName === 'chat' && this.app.chat) {
                this.app.chat.init();
            }
            if (pageName === 'settings' && this.app.auth) {
                this.app.auth.initSettingsPage();
            }
        } else {
            this.navigateToPage('notfound');
        }
    }

    updateNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
} 