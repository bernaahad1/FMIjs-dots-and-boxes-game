import { boxes, GameBoard } from "./app.js";

export const socket = io();

let username = "user 1";
let playerIndex = -1;
let currentRoom = "";
let gameBoard = undefined;

socket.emit("join server", username);

export const onChooseRoom = (event) => {
  const currentRoom = event.target.value;
  console.log(`updated currentRoom to: ${currentRoom}`);
  socket.emit("join room", currentRoom, (r, index) => {
    console.log(r);
    playerIndex = index;
    console.log(`Player ${playerIndex} has connected`);

    //Just for now
    gameBoard = new GameBoard(r.name, r.size, r.players, playerIndex);
    gameBoard.createBoard();
    console.log(gameBoard);

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

socket.on("select", (className, initializer) => {
  const myEl = document.getElementsByClassName(className)[0];
  console.log(`Start: ${initializer}; Element to update: ${myEl}`);
  myEl.style.opacity = 100;
  myEl.disabled = true;

  if (initializer === playerIndex) {
    const result1 = gameBoard.updateBoxState(
      myEl.classList[3],
      "green",
      initializer
    );
    const result2 = gameBoard.updateBoxState(
      myEl.classList[4],
      "green",
      initializer
    );

    if (!(result1 && result2)) {
      console.log("other turn");
      gameBoard.onChangePlayTurn(false);
    }

    return;
  } else {
    const result1 = gameBoard.updateBoxState(
      myEl.classList[3],
      "red",
      initializer
    );
    const result2 = gameBoard.updateBoxState(
      myEl.classList[4],
      "red",
      initializer
    );

    if (!(result1 && result2)) {
      console.log("my turn");
      gameBoard.onChangePlayTurn(true);
    }
  }
});
