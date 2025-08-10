// Simple SPA Router
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = '';
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    init() {
        // Handle initial load
        this.handleRoute();
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    }

    navigate(path) {
        if (path !== this.currentPath) {
            history.pushState(null, null, path);
            this.handleRoute();
        }
    }

    handleRoute() {
        let path = window.location.pathname;
        
        // Handle GitHub Pages paths (remove /workout-tracker prefix)
        if (path.startsWith('/workout-tracker')) {
            path = path.replace('/workout-tracker', '') || '/';
        }
        
        this.currentPath = path;
        
        const handler = this.routes[path] || this.routes['/'];
        if (handler) {
            handler();
        }
    }

    getCurrentPath() {
        return this.currentPath;
    }
}