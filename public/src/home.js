import { onChooseRoom, socket } from "./gameBoard.js";
import img from "./assets/logo_FMIJS.png";
import "./gameRoom.css";
import "./home.css";

const style = `.home-row{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: flex-start;
    flex-wrap: wrap;
}
.home-row-hidden{
    display: none;
    flex-direction: row;
    justify-content: space-around;
    align-content: flex-start;
    flex-wrap: wrap;
}

.home-column{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-wrap: nowrap;
    row-gap: 15px;
}

.create-room{
    font-size: 30px;
    max-width: 240px;
    border-radius: 20px;
    color: black;
    background-color: #ffffff;
    border-color: #cbeefd;
    border-bottom-width: thick;
    border-right-width: thick;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
}

.create-room:hover{
    background-color: #cbeefd;
}

.home-column input {
    font-size: 24px;
    border-radius: 10px;
    border: none;
    background-color: #cbeefd;
    padding: 5px 10px;
}

.home-column h2{
    font-size: 50px;
}

.title{
    display: flex;
    justify-content: center;
}

.title img{
    max-height: 110px;
}

.ChooseRoom {
    font-size: 30px;
    max-width: 240px;
    border-radius: 20px;
    color: black;
    background-color: #ffffff;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-color: #cbeefd;
}
.ChooseRoom:hover{
    background-color: #cbeefd;
}

.ChooseRoomFull {
    font-size: 30px;
    max-width: 240px;
    border-radius: 20px;
    color: black;
    background-color: #e997ab;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
    border: none;
}
.ChooseRoomFull:hover{
    background-color: #ffffff;
    border-color: #cbeefd;
}`;

let rooms = new Map();
let username = "user 1";

socket.on("new room", (r) => {
  rooms = new Map(r);
  document
    .getElementsByTagName("app-root")[0]
    .shadowRoot.querySelector("home-page")
    .generateAllExitingRooms();
});

socket.on("update room", (room) => {
  document
    .getElementsByTagName("app-root")[0]
    .shadowRoot.querySelector("home-page")
    .updateRoomButton(room);
});

socket.on("fetch rooms", (r) => {
  rooms = new Map(r);

  console.log("fetch rooms");
  document
    .getElementsByTagName("app-root")[0]
    .shadowRoot.querySelector("home-page")
    .generateAllExitingRooms();
});

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
    console.log(`${this.newRoomName} and ${this.newRoomSize}`);
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
    this.createRoomButton(this.newRoomName, numPlayers, 0, "waiting");
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
