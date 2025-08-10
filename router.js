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
        const path = window.location.pathname;
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