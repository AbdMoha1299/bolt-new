export type Route = 'home' | 'create-cv' | 'templates' | 'preview' | 'create-letter' | 'letter-preview' | 'dashboard' | 'login' | 'register' | 'profile';

export class Router {
  private static instance: Router;
  private currentRoute: Route = 'home';
  private listeners: Array<(route: Route) => void> = [];

  static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  constructor() {
    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();
  }

  private handleHashChange(): void {
    const hash = window.location.hash.slice(1);
    const route = this.parseRoute(hash);
    this.setRoute(route);
  }

  private parseRoute(hash: string): Route {
    // Handle query parameters
    const [routePart] = hash.split('?');
    
    switch (routePart) {
      case 'create-cv':
        return 'create-cv';
      case 'templates':
        return 'templates';
      case 'preview':
        return 'preview';
      case 'create-letter':
        return 'create-letter';
      case 'letter-preview':
        return 'letter-preview';
      case 'dashboard':
        return 'dashboard';
      case 'login':
        return 'login';
      case 'register':
        return 'register';
      case 'profile':
        return 'profile';
      default:
        return 'home';
    }
  }

  navigate(route: Route): void {
    window.location.hash = route === 'home' ? '' : route;
  }

  setRoute(route: Route): void {
    this.currentRoute = route;
    this.notifyListeners();
  }

  getCurrentRoute(): Route {
    return this.currentRoute;
  }

  subscribe(listener: (route: Route) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentRoute));
  }
}