import { onChooseRoom } from "./gameBoardActions.js";
import { socket, rooms, username } from "./client_db.js";

import img from "./assets/logo_FMIJS.png";
import { style } from "./styles.js";

function createHomeTemplate() {
  const templateString = `
  <style>${style}</style>
        <div class="home-row" id="home-menu">
          <div class="home-column">
            <div class="title">
              <img src="${img}" alt="Dots and Boxes" />
            </div>
            <button class="create-room">Create Room</button>
            <input type="text" id="IRoomName" placeholder="Room name" maxlength="10" required>
            <input type="number" id="IGridSize" placeholder="Grid size(4-10)" min="4" max="10" required>
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
      .addEventListener("change", this.changeRoomInput);

    this.#_shadowRoot
      .querySelector("#IGridSize")
      .addEventListener("change", this.changeSizeInput);
  }

  connectedCallback() {
    socket.emit("join server", username);
  }

  changeRoomInput = (e) => {
    console.log(e.target.value);
    this.newRoomName = e.target.value;
  };

  changeSizeInput = (e) => {
    this.newRoomSize = e.target.value;
  };

  onCreateRoom = (e, roomName = "defauty", numPlayers = 2, gridSize = 4) => {
    console.log(`Create ${this.newRoomName} with size ${this.newRoomSize}`);
    if (this.newRoomName === "") {
      alert("Add name");
      return;
    }
    if (
      this.newRoomSize < 4 ||
      this.newRoomSize > 10 ||
      Number(this.newRoomSize) === NaN
    ) {
      alert("Wrong grid size!!!");
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

    button.innerHTML += `${roomName} ${playersConnected}/${numPlayers} ${_state}`;
    allRooms.appendChild(button);
  }

  resetRooms() {
    this.#_shadowRoot.querySelector("#home-all-rooms").innerHTML = "";
  }

  updateRoomButton = (room) => {
    const button = this.#_shadowRoot.querySelector(`#${room.name}`);
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
