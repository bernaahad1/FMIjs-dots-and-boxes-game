import { boxes, updateBoxState, createBoard } from "./app.js";

export const socket = io();

let username = "user 1";
let playerIndex = -1;
let currentRoom = "";

socket.emit("join server", username);

export const onChooseRoom = (event) => {
  const currentRoom = event.target.value;
  console.log(`updated currentRoom to: ${currentRoom}`)
  socket.emit("join room", currentRoom, (r, index) => {
    console.log(r);
    playerIndex = index;
    console.log(`Player ${playerIndex} has connected`);
    //Just for now
    createBoard();
    document.getElementById("home-menu").className = "home-row-hidden";

    if (playerIndex === -1) {
      //He should only watch, but not play
    }
  });
};

socket.on("new user", (users) => {
  console.log("users change");
});

//selecting lines
export function onLineClick(event) {
  socket.emit("select", event.target.className, playerIndex);
}

socket.on("select", (className, initializer) => {
  const myEl = document.getElementsByClassName(className)[0];
  console.log(`Start: ${initializer}; Element to update: ${myEl}`)
  myEl.style.opacity = 100;
  myEl.disabled = true;

  if(initializer === playerIndex){
    updateBoxState(boxes, myEl.classList[3], "green");
    updateBoxState(boxes, myEl.classList[4], "green");
    return;
  }
  updateBoxState(boxes, myEl.classList[3], "red");
  updateBoxState(boxes, myEl.classList[4], "red");
});
