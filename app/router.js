// Simple vanilla JavaScript router
class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || '/software';
    const route = this.routes.find(r => r.path === hash);

    if (route) {
      this.currentRoute = route;
      await this.loadTemplate(route);
      if (route.controller) {
        route.controller();
      }
      this.updateActiveNav(hash);
    }
  }

  async loadTemplate(route) {
    const viewContainer = document.querySelector('[data-view]');
    if (!viewContainer) return;

    try {
      const response = await fetch(route.template);
      const html = await response.text();
      viewContainer.innerHTML = html;
    } catch (error) {
      console.error('Error loading template:', error);
      viewContainer.innerHTML = '<p>Error loading content</p>';
    }
  }

  updateActiveNav(path) {
    // Remove active class from all nav items
    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));

    // Add active class to current nav item
    const section = path.replace('/', '');
    const navItem = document.querySelector(`nav li.${section}`);
    if (navItem) {
      navItem.classList.add('active');
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}

// Define routes
const routes = [
  {
    path: '/software',
    template: 'myWork/software/software.html',
    controller: () => {
      console.log('Software section loaded');
    }
  },
  {
    path: '/design',
    template: 'myWork/design/design.html',
    controller: () => {
      console.log('Design section loaded');
    }
  },
  {
    path: '/photography',
    template: 'myWork/photography/photography.html',
    controller: () => {
      console.log('Photography section loaded');
    }
  },
  {
    path: '/writing',
    template: 'myWork/writing/writing.html',
    controller: () => {
      console.log('Writing section loaded');
    }
  }
];

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const router = new Router(routes);

  // Initialize mobile side nav
  const sidenavTrigger = document.querySelector('.button-collapse');
  const sidenav = document.getElementById('mobile-demo');

  if (sidenavTrigger && sidenav) {
    sidenavTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      sidenav.classList.toggle('active');

      // Add overlay
      let overlay = document.querySelector('.sidenav-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidenav-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
          sidenav.classList.remove('active');
          overlay.remove();
        });
      }
    });
  }

  // Handle nav link clicks
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#/')) {
        e.preventDefault();
        router.navigate(href.slice(1));

        // Close mobile nav if open
        const sidenav = document.getElementById('mobile-demo');
        if (sidenav) {
          sidenav.classList.remove('active');
          const overlay = document.querySelector('.sidenav-overlay');
          if (overlay) overlay.remove();
        }
      }
    });
  });
});
