import "./gameRoom.css";
import "./home.css";
import { home } from "./home.js";
// import "./gameRoom.css";
// import "./home.css";

function createMainTemplate() {
  const templateString = `
        <main class="main-content">
        <home-page></home-page>
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
    // this.#_shadowRoot.appendChild(home);
  }
}

customElements.define("app-root", AppComponent);

export const app = new AppComponent();
document.body.appendChild(app);
