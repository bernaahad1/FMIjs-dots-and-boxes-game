import "./home.js";
import { Router } from "./router.js";

function createMainTemplate() {
  const templateString = `
        <main class="main-content">
        </main>
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const template = createMainTemplate();

export class AppComponent extends HTMLElement {
  #_shadowRoot = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "open" });
    this.#_shadowRoot.appendChild(template.content.cloneNode(true));
    const router = new Router();
    this.#_shadowRoot.appendChild(router);
  }

  renderGameRoom(gameRoom) {
    this.#_shadowRoot.querySelector("home-page").setAttribute("hidden", true);
    this.#_shadowRoot.querySelector("main").appendChild(gameRoom);
  }
}

customElements.define("app-root", AppComponent);

export const app = new AppComponent();

document.body.appendChild(app);
