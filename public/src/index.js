import "./home.js";

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

  renderGameRoom(gameRoom) {
    this.#_shadowRoot.querySelector("home-page").setAttribute("hidden", true);
    this.#_shadowRoot.querySelector("main").appendChild(gameRoom);
  }

  resetToHome() {
    this.#_shadowRoot.innerHTML = "";
    this.#_shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("app-root", AppComponent);

export const app = new AppComponent();

document.body.appendChild(app);
