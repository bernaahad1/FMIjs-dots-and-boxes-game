import { onChooseRoom, socket } from "./connectToServer.js";
import img from "./assets/logo_FMIJS.png";

let rooms = new Map();
let newRoomName = "";
let newRoomSize = 0;

socket.on("new room", (r) => {
  rooms = new Map(r);
  generateAllExitingRooms();
});
socket.on("fetch rooms", (r) => {
  rooms = new Map(r);
  generateAllExitingRooms();
});

socket.on("update room", (room) => {
  updateRoomButton(room);
});

const onCreateRoom = (
  e,
  roomName = "defauty",
  numPlayers = 2,
  gridSize = 4
) => {
  console.log(`${newRoomName} and ${newRoomSize}`);
  if (newRoomName === "") {
    alert("Add name");
    return;
  }
  if (newRoomSize < 4 || newRoomSize > 10 || Number(newRoomSize) === NaN) {
    alert("Wrong grid size!!!");
    return;
  }
  socket.emit("create room", newRoomName, newRoomSize, 2);
  //createRoomButton(roomName, numPlayers,0,"waiting");
};

const createRoomButton = (roomName, numPlayers, playersConnected, _state) => {
  const allRooms = document.getElementById("home-all-rooms");
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
};

const updateRoomButton = (room) => {
  const button = document.getElementById(`${room.name}`);
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

const generateAllExitingRooms = () => {
  document.getElementById("home-all-rooms").innerHTML = ``;

  const allRooms = Array.from(rooms.values());
  allRooms.forEach((r) => {
    let connected = 0;
    r.players.forEach((p) => {
      if (p !== null) {
        connected++;
      }
    });
    createRoomButton(
      r.name,
      r.players.length,
      connected,
      connected === r.players.length ? "ready" : "waiting"
    );
  });

  let roomButtons = document.getElementsByClassName("ChooseRoom");
  console.log(roomButtons);
  for (let i = 0; i < roomButtons.length; i++) {
    roomButtons[i].addEventListener("click", onChooseRoom);
  }

  roomButtons = document.getElementsByClassName("ChooseRoomFull");
  for (let i = 0; i < roomButtons.length; i++) {
    roomButtons[i].addEventListener("click", onChooseRoom);
  }
};

const changeRoomInput = (e) => {
  console.log(e.target.value);
  newRoomName = e.target.value;
};
const changeSizeInput = (e) => {
  newRoomSize = e.target.value;
};

export const createHome = () => {
  const mainConatiner = document.getElementsByClassName("main-content")[0];

  const row = document.createElement("div");
  row.className = "home-row";
  row.id = "home-menu";
  const column1 = document.createElement("div");
  column1.className = "home-column";
  const column2 = document.createElement("div");
  column2.className = "home-column";

  //create room colum
  const title = document.createElement("div");
  title.className = "title";
  title.innerHTML += `<img src="${img}" alt="Dots and Boxes" />`;

  column1.appendChild(title);
  column1.innerHTML += `<button class="create-room">Create Room</button>`;
  column1.innerHTML += `<input type="text" id="IRoomName" placeholder="Room name" maxlength="10" required>`;
  // column1.innerHTML += `<input type="number" id="INumPlayers" placeholder="Number players(2-4)" required>`;
  column1.innerHTML += `<input type="number" id="IGridSize" placeholder="Grid size(4-10)" min="4" max="10" required>`;

  //all rooms colum
  column2.innerHTML += `<h2>All Rooms</h2>`;
  const buttonsBox = document.createElement("div");
  buttonsBox.id = "home-all-rooms";
  buttonsBox.className = "home-column";
  column2.appendChild(buttonsBox);

  //add elements to HTML
  row.appendChild(column1);
  row.appendChild(column2);
  mainConatiner.appendChild(row);

  mainConatiner
    .getElementsByClassName("create-room")[0]
    .addEventListener("click", onCreateRoom);
  document
    .getElementById("IRoomName")
    .addEventListener("change", changeRoomInput);
  document
    .getElementById("IGridSize")
    .addEventListener("change", changeSizeInput);

  generateAllExitingRooms();
};

// createHome();
