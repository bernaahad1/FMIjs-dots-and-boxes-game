import { pathToRegexp } from 'path-to-regexp';
// import { UserList } from './user-list';
// import { EditUser } from './edit-user';
import { Home } from './home.js'

export class Router extends HTMLElement {
  #_shadowRoot = null;
  #currentPath = null;

  routes = {
    '/': Home,
    // '/edit/:id': EditUser,
  };

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: 'closed' });
  }

  render(path, skipStatePush = false) {
    let componentRoute = null;
    for (const [key, value] of Object.entries(this.routes)) {
      const keyRe = pathToRegexp(key);
      if (!keyRe.test(path)) { continue; }
      componentRoute = value;
      break;
    }

    if (!componentRoute) {
      console.error('Route not found!')
    }
    if (this.#currentPath === path) { return; }
    this.#currentPath = path;

    const instance = new componentRoute();
    if (this.#_shadowRoot.children[0]) {
      this.#_shadowRoot.removeChild(this.#_shadowRoot.children[0]);
    }
    this.#_shadowRoot.appendChild(instance);

    if (skipStatePush) { return; }
    history.pushState('', '', path);
  }

  popstateHandler = (e) => {
    e.preventDefault();
    this.render(location.pathname, true);
  }

  connectedCallback() {
    this.render(location.pathname);
    window.addEventListener('popstate', this.popstateHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.popstateHandler);
  }
}

customElements.define('app-router', Router)