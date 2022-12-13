import { GameBoard } from "./app.js";

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

    gameBoard = new GameBoard(r.name, r.size, r.players, playerIndex);
    gameBoard.createBoard();
    console.log(gameBoard);

    document.getElementById("home-menu").className = "home-row-hidden";

    if (playerIndex === -1) {
      //He should only watch, but not play
    }
  });
};

export const onLeaveRoom = (event) => {
  socket.emit("leave room", () => {
    console.log(`Player ${playerIndex} has disconnected`);
    gameBoard = undefined;
    playerIndex = -1;

    document.getElementById("home-menu").className = "home-row";
    const gameRoom = document.getElementsByClassName("game-room")[0];
    document.getElementsByClassName("main-content")[0].removeChild(gameRoom);
  });
};

socket.on("new user", (users) => {
  console.log("users change");
});

socket.on("user left", (room) => {
  if (room !== gameBoard.name) {
    return;
  }
  const gameRoom = document.getElementsByClassName("game-room")[0];
  document.getElementsByClassName("main-content")[0].removeChild(gameRoom);

  //just for now
  gameBoard = new GameBoard(
    gameBoard.name,
    gameBoard.size - 1,
    gameBoard.players,
    playerIndex
  );
  console.log("You win");
});

//selecting lines
socket.on("selectLine", (className, initializer) => {
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

    if (!result1 && !result2) {
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

    if (!result1 && !result2) {
      console.log("my turn");
      gameBoard.onChangePlayTurn(true);
    }
  }
});
