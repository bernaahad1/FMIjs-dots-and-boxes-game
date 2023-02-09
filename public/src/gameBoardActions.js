import { GameBoard } from "./gameBoard.js";

import {
  socket,
  playerIndex,
  setPlayerIndex,
  currentRoom,
} from "./client_db.js";

let gameBoard = undefined;

export const onChooseRoom = (event) => {
  const currentRoom = event.target.value;
  console.log(`updated currentRoom to: ${currentRoom}`);

  socket.emit("join room", currentRoom, (r, index) => {
    console.log(r);
    setPlayerIndex(index);
    console.log(`Player ${playerIndex} has connected`);

    gameBoard = new GameBoard(
      r.name,
      r.size,
      r.players,
      playerIndex,
      r.plTurn,
      r.savedBoxes,
      r.clickedLines
    );
    console.log(gameBoard);

    const router = document
      .getElementsByTagName("app-root")[0]
      .shadowRoot.querySelector("app-router");
    router.render(`/room/${currentRoom}`, gameBoard);

    //document.getElementsByTagName("app-root")[0].renderGameRoom(gameBoard);

    if (playerIndex === -1) {
      //He should only watch, but not play
    }
  });
};

export const onLeaveRoom = (event) => {
  socket.emit("leave room", () => {
    console.log(`Player ${playerIndex} has disconnected`);
    gameBoard = undefined;
    // playerIndex = -1;
    setPlayerIndex(-1);

    const router = document
      .getElementsByTagName("app-root")[0]
      .shadowRoot.querySelector("app-router");

    router.render(`/`);
    //document.getElementsByTagName("app-root")[0].resetToHome();
  });
};

export const onLeavePage = (event) => {
  socket.emit("leave room", () => {
    console.log(`Player ${playerIndex} has disconnected`);
    gameBoard = undefined;
    setPlayerIndex(-1);
  });
};

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
socket.on("selectLine", (className, id, initializer) => {
  gameBoard.updateLineState(id);

  console.log(
    `Start: ${initializer}; Element to update: ${className} , ${gameBoard}`
  );

  const pattern = /^\w+$/;

  const classList = className.split(" ").filter((str) => pattern.test(str));
  const colors = { 0: "pink", 1: "gray" };

  // if user is only watching
  if (playerIndex === -1) {
    const result1 = gameBoard.updateBoxState(
      `${classList[3]}`,
      colors[initializer],
      initializer
    );
    const result2 = gameBoard.updateBoxState(
      `${classList[4]}`,
      colors[initializer],
      initializer
    );
    gameBoard.onChangePlayTurn(true);
    return;
  }

  if (initializer === playerIndex) {
    const result1 = gameBoard.updateBoxState(
      `${classList[3]}`,
      colors[0],
      initializer
    );
    const result2 = gameBoard.updateBoxState(
      `${classList[4]}`,
      colors,
      initializer
    );

    if (!result1 && !result2) {
      socket.emit("set turn", playerIndex == 0 ? 1 : 0);
      gameBoard.onChangePlayTurn(false);
    }

    return;
  } else {
    const result1 = gameBoard.updateBoxState(
      `${classList[3]}`,
      colors[1],
      initializer
    );
    const result2 = gameBoard.updateBoxState(
      `${classList[4]}`,
      colors[1],
      initializer
    );

    if (!result1 && !result2) {
      gameBoard.onChangePlayTurn(true);
    }
  }
});
