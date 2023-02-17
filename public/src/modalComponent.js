function createHomeTemplate() {
  const templateString = `
    <style>
        .modal-overlay {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 300;
        }

        .modal-content {
         position: absolute;
          background-color: white;
          border-radius: 10px;
          display:flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 0 10px #ccc;

        }


        .close-button {
          font-size: 20px;
          margin:5px;
          position: relative;
          top: 0;
          align-self: end;
          cursor: pointer;
          background-color: transparent;
          border-color: transparent;
          z-index: 301;
        }

        .content {
         margin: 0 20px 20px 20px;
        }
      </style>

      <div class="modal-overlay">
        <div class="modal-content">
        <button class="close-button">X</button>
          <div class="content">
          <slot></slot>
          </div>
        </div>
      </div>
  `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const template = createHomeTemplate();

class ModalComponent extends HTMLElement {
  #_shadowRoot = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.#_shadowRoot
      .querySelector(".modal-overlay")
      .addEventListener("click", () => this.closeModal());
  }

  disconnectedCallback() {
    this.#_shadowRoot
      .querySelector(".modal-overlay")
      .removeEventListener("click", () => this.closeModal());
  }

  closeModal() {
    this.remove();
  }
}

customElements.define("modal-component", ModalComponent);
