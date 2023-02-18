function createHomeTemplate() {
  const templateString = `
    <style>
        .alert {
         width: 30vw;
        }

        h2 {
          margin: 0;
          font-size: 30px;

        }

        p {
          margin: 10px 0;
          font-size: 20px;

        }

        button {
          font-size: 20px;
          width:100%;
          border-radius: 20px;
          color: black;
          background-color: #cbeefd; 
          border-style: solid;
          margin: 20px 0 0 0;
          padding: 5px 20px;
          transition-duration: 0.4s;
          cursor: pointer;
          border-color: #cbeefd;
        }

         button:hover{
           background-color: #ffffff;
        }

      </style>
      <div class="alert">
        <h2 id="title"></h2>
        <p id="description"></p>
        <button id="button" ></button>
      </div>
  `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const template = createHomeTemplate();

class AlertComponent extends HTMLElement {
  #_shadowRoot = null;

  _path = "";
  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(template.content.cloneNode(true));

    this._title = this.#_shadowRoot.querySelector("#title");
    this._title.style.display = "none";
    this._description = this.#_shadowRoot.querySelector("#description");
    this._description.style.display = "none";
    this._button = this.#_shadowRoot.querySelector("#button");
    this._button.style.display = "none";
  }

  static get observedAttributes() {
    return ["title", "description", "button-text", "path"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "title":
        this._title.textContent = newValue;
        this._title.style.display = "block";
        break;
      case "description":
        this._description.textContent = newValue;
        this._description.style.display = "block";

        break;
      case "button-text":
        this._button.textContent = newValue;
        this._button.style.display = "block";

      case "path":
        this._path = newValue;

        break;
    }
  }

  connectedCallback() {
    this._button.addEventListener("click", () => this.closeModal());
  }

  disconnectedCallback() {
    this._button.removeEventListener("click", () => this.closeModal());
  }

  closeModal() {
    if (this._path !== "") {
      const router = document
        .getElementsByTagName("app-root")[0]
        .shadowRoot.querySelector("app-router");

      router.render("/");
    }
    
    this.remove();
  }
}

customElements.define("alert-component", AlertComponent);
