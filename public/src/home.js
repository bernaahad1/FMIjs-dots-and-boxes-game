import { onChooseRoom } from "./gameBoardActions.js";
import { socket, rooms, username } from "./client_db.js";
import { ModalComponent } from "./modalComponent.js";
import { AlertComponent } from "./alert.js";

import img from "./assets/logo_FMIJS.png";
import roomImage from "./assets/room.png";

import { style } from "./styles.js";

function createHomeTemplate() {
  const templateString = `
  <style>${style}</style>
        <div class="home-row" id="home-menu">
          <div class="home-column create">
            <div class="title">
              <img src="${img}" alt="Dots and Boxes" />
            </div>
            <input type="text" id="IRoomName" placeholder="Room name" maxlength="10" required>
            <input type="number" id="IGridSize" placeholder="Grid size(2-10)" min="2" max="10" required>
            <button class="create-room">Create Room</button>
          </div>
          <div class="home-column">
            <h2>All Rooms</h2>
            <div id="home-all-rooms" class="home-column">
            </div>
          </div>
          
        </div>
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const template = createHomeTemplate();

export class Home extends HTMLElement {
  #_shadowRoot = null;
  newRoomName = "";
  newRoomSize = 0;

  constructor() {
    super();

    // TODO for later maybe create new component that is home-all-rooms
    // save the instance of it in Home and use its methods for create room, reset room, and etc

    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(template.content.cloneNode(true));

    this.#_shadowRoot
      .querySelector(".create-room")
      .addEventListener("click", this.onCreateRoom);

    this.#_shadowRoot
      .querySelector("#IRoomName")
      .addEventListener("input", this.changeRoomInput);

    this.#_shadowRoot
      .querySelector("#IGridSize")
      .addEventListener("input", this.changeSizeInput);
  }

  connectedCallback() {
    socket.emit("join server", username);
  }

  changeRoomInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]+/g, "");
    this.newRoomName = e.target.value;
  };

  changeSizeInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]+/g, "");
    this.newRoomSize = e.target.value;
  };

  onCreateRoom = (e, roomName = "defauty", numPlayers = 2, gridSize = 2) => {
    console.log(`Create ${this.newRoomName} with size ${this.newRoomSize}`);
    if (this.newRoomName === "") {
      if(this.#_shadowRoot.querySelector("modal-component") != null){
        return;
      }
      const modal = document.createElement("modal-component");
      modal.innerHTML = `<alert-component title="Wrong input!" description="Please enter room name"/>`;

      this.#_shadowRoot.appendChild(modal);
      return;
    }
    if (
      this.newRoomSize < 2 ||
      this.newRoomSize > 10 ||
      Number(this.newRoomSize) === NaN
    ) {
      if(this.#_shadowRoot.querySelector("modal-component") != null){
        return;
      }
      const modal = document.createElement("modal-component");

      modal.innerHTML = `<alert-component title="Wrong grid size!" description="Size must be between 2 and 10"></alert-component>`;
      this.#_shadowRoot.appendChild(modal);
      return;
    }
    if (rooms.has(this.newRoomName)) {
      if(this.#_shadowRoot.querySelector("modal-component") != null){
        return;
      }
      const modal = document.createElement("modal-component");

      modal.innerHTML = `<alert-component title="Aready exist!" description="Please select unique room name"></alert-component>`;
      this.#_shadowRoot.appendChild(modal);
      return;
    }
    socket.emit("create room", this.newRoomName, this.newRoomSize, 2);
  };

  createRoomButton(roomName, numPlayers, playersConnected, _state) {
    const allRooms = this.#_shadowRoot.querySelector("#home-all-rooms");
    let button = document.createElement("button");
    button.className = "ChooseRoom";
    button.id = `${roomName}`;
    button.value = `${roomName}`;

    if (numPlayers === playersConnected) {
      button.className = "ChooseRoomFull";
    } else {
      button.className = "ChooseRoom";
    }

    button.innerHTML += `<img src="${roomImage}" id="${roomName}">`;

    button.innerHTML += `${roomName} ${playersConnected}/${numPlayers} ${_state}`;
    allRooms.appendChild(button);

    const b = this.#_shadowRoot.querySelector(`#${roomName}`);
  }

  resetRooms() {
    this.#_shadowRoot.querySelector("#home-all-rooms").innerHTML = "";
  }

  updateRoomButton = (room) => {
    const button = this.#_shadowRoot.querySelector(`#${room.name}`);
    if (!button) {
      return; // if the UI is not loaded
    }
    const numPlayers = room.players.length;
    let connected = room.connected;
    const state = numPlayers === connected ? "playing" : "pending";

    button.innerHTML = button.innerHTML.replace(/ [0-9]*?\//, ` ${connected}/`);
    button.innerHTML = button.innerHTML.replace(/ [a-z]*?$/, ` ${state}`);

    console.log(`${numPlayers} ${connected}`);
    if (numPlayers === connected) {
      button.className = "ChooseRoomFull";
    } else {
      button.className = "ChooseRoom";
    }
  };

  generateAllExitingRooms = () => {
    this.resetRooms();

    const allRooms = Array.from(rooms.values());
    allRooms.forEach((r) => {
      let connected = 0;
      r.players.forEach((p) => {
        if (p !== null) {
          connected++;
        }
      });

      this.createRoomButton(
        r.name,
        r.players.length,
        connected,
        connected === r.players.length ? "ready" : "waiting"
      );
    });

    let roomButtons = this.#_shadowRoot.querySelectorAll(".ChooseRoom");
    console.log(roomButtons);
    for (let i = 0; i < roomButtons.length; i++) {
      roomButtons[i].addEventListener("click", onChooseRoom);
    }

    roomButtons = this.#_shadowRoot.querySelectorAll(".ChooseRoomFull");
    for (let i = 0; i < roomButtons.length; i++) {
      roomButtons[i].addEventListener("click", onChooseRoom);
    }
  };
}

customElements.define("home-page", Home);

export const home = new Home();
