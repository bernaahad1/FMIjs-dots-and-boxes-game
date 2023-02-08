export const socket = io();

let rooms = new Map();
let username = "user 1";
let playerIndex = -1;
let currentRoom = "";

export const setPlayerIndex = (index) => {
  playerIndex = index;
}

socket.on("new user", (users) => {
  console.log("users change");
});

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

export { rooms, username, playerIndex, currentRoom };