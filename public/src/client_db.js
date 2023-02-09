const { io } = require("socket.io-client");
export const socket = io("http://localhost:5000");

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
  const homePage = document.getElementsByTagName("app-root")[0].shadowRoot.querySelector("app-router").shadowRoot.querySelector("home-page");
  rooms = new Map(r);
  homePage.generateAllExitingRooms();
});

socket.on("update room", (room) => {
  const homePage = document.getElementsByTagName("app-root")[0].shadowRoot.querySelector("app-router").shadowRoot.querySelector("home-page");
  homePage.updateRoomButton(room);
});

socket.on("fetch rooms", (r) => {
  const homePage = document.getElementsByTagName("app-root")[0].shadowRoot.querySelector("app-router").shadowRoot.querySelector("home-page");
  rooms = new Map(r);

  console.log("fetch rooms");
  if(!document.getElementsByTagName("app-root")[0].shadowRoot.querySelector("app-router")){
    console.log(document.getElementsByTagName("app-root")[0].shadowRoot.querySelector("app-router"))
    return;
  }
  
  homePage.generateAllExitingRooms();
});

export { rooms, username, playerIndex, currentRoom };