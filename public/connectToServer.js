// const { io } = require("socket.io-client");
import { boxes, updateBoxState, createBoard } from "./app.js";

const socket = io();

let rooms = new Map();
let username = "user 1";
let playerIndex = -1;

let currentRoom = "";

socket.emit("join server", username);

//create server TOBE::button
socket.emit("create room", "Room 1", 4, 2);
socket.emit("create room", "Room 2", 4, 2);

const onCreateRoom = () => {
  console.log("new room!!");
};

const onChooseRoom = (event) => {
  const room = event.target.value;
  currentRoom = room;
  socket.emit("join room", room, (r, index) => {
    console.log(r);
    playerIndex = index;
    console.log(`Player ${playerIndex} has connected`);
    createBoard();

    if (playerIndex === -1) {
      //He should only watch, but not play
    }
  });
};

const createElements = () => {
  const display = document.getElementsByClassName("rooms-content")[0];

  var content = document.createTextNode("All rooms");
  display.appendChild(content);

  display.innerHTML += `<button class="createButton">Create Room</button>`;
  document
    .getElementsByClassName("createButton")[0]
    .addEventListener("click", onCreateRoom);

  const div = document.createElement("div");
  div.className = "rooms display";
  display.appendChild(div);
};
createElements();

const displayRooms = () => {
  const display = document.getElementsByClassName("rooms display")[0];
  display.innerHTML = ``;

  const allRooms = Array.from(rooms.values());
  allRooms.forEach((r) => {
    display.innerHTML += `<button class="room" value="${r.name}">${r.name}</button>`;
  });

  const roomButtons = document.getElementsByClassName("room");

  for (let i = 0; i < roomButtons.length; i++) {
    roomButtons[i].addEventListener("click", onChooseRoom);
  }
};

//here is a example on subbmiting to all
//I think we can use it to change the current rooms :)
socket.on("new user", (users) => {
  console.log("users change");
});

socket.on("new room", (r) => {
  rooms = new Map(r);
  displayRooms();
});

//module.exports = {createElements,};
//export default createElements;

//selecting lines
export function onLineClick(event) {
  event.preventDefault();

  event.target.style.opacity = 100;
  event.target.disabled = true;

  const classList = event.target.classList;

  updateBoxState(boxes, classList[3], "green");
  updateBoxState(boxes, classList[4], "green");

  socket.emit("select", currentRoom, event.target.className);
}

socket.on("select", (currentRoom, className) => {
  const myEl = document.getElementsByClassName(className)[0];
  console.log(myEl);

  myEl.style.opacity = 100;
  myEl.disabled = true;

  updateBoxState(boxes, myEl.classList[3], "red");
  updateBoxState(boxes, myEl.classList[4], "red");
});
