import { GameBoard } from "./gameBoard.js";

import {
  socket,
  playerIndex,
  setPlayerIndex,
  currentRoom,
} from "./client_db.js";

let gameBoard = undefined;

// TODO reset the game when someone leaves

export const launchPackman = () => {
  gameBoard.chooseMaxRow()
}

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
      r.clickedLines,
      r.isReplay
    );

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
  console.log(gameBoard.isReplay);
  if (!gameBoard.isReplay) {
    socket.emit("user left", gameBoard.name, playerIndex);
  }

  // console.log("emit leave");

  socket.emit("leave room", () => {
    console.log(`Player ${playerIndex} has disconnected onLeaveRoom`);
    // gameBoard = undefined;
    // playerIndex = -1;
    // setPlayerIndex(-1);

    const router = document
      .getElementsByTagName("app-root")[0]
      .shadowRoot.querySelector("app-router");

    router.render(`/`);
    //document.getElementsByTagName("app-root")[0].resetToHome();
  });
};

export const onLeavePage = (event) => {
  console.log(gameBoard.isReplay);

  if (!gameBoard.isReplay) {
    socket.emit("user left", gameBoard.name, playerIndex);
  }

  socket.emit("leave room", () => {
    console.log(`Player ${playerIndex} has disconnected onLeavePage`);
    gameBoard = undefined;
    setPlayerIndex(-1);
  });
};

socket.on("user left", (room, playerLeftId) => {
  console.log("alooo, ", room, playerLeftId);
  if (
    room !== gameBoard.name ||
    playerLeftId < 0 ||
    playerIndex === playerLeftId
  ) {
    return;
  }

  console.log("playerLeftId: ", playerLeftId);
  gameBoard.userLeft(playerLeftId);

  gameBoard = new GameBoard(
    gameBoard.name,
    gameBoard.size - 1,
    gameBoard.players,
    playerIndex
  );

  console.log(gameBoard.players);

  console.log("You win");
});

//selecting lines
socket.on("selectLine", (className, id, initializer) => {
  gameBoard.updateLineState(id);

  console.log(
    `Start: ${initializer}; Element to update: ${className} , ${gameBoard}`
  );

  const { result1, result2 } = seclectedLineUpdateBox(className, initializer);
  if (playerIndex === -1) {
    gameBoard.onChangePlayTurn(true);
    return;
  }

  if (initializer === playerIndex) {
    if (!result1 && !result2) {
      socket.emit("set turn", playerIndex == 0 ? 1 : 0);
      gameBoard.onChangePlayTurn(false);
    }
    return;
  } else {
    if (!result1 && !result2) {
      gameBoard.onChangePlayTurn(true);
    }
  }
});

export const seclectedLineUpdateBox = (
  className,
  initializer,
  gB = gameBoard
) => {
  const pattern = /^\w+$/;

  const classList = className.split(" ").filter((str) => pattern.test(str));
  const colors = { 0: "pink", 1: "gray" };

  console.log(
    `clicked line from ${initializer} and current player ${playerIndex}`
  );

  // if user is only watching
  if (playerIndex === -1) {
    gB.updateBoxState(`${classList[3]}`, colors[initializer], initializer);
    gB.updateBoxState(`${classList[4]}`, colors[initializer], initializer);
    return;
  }

  const result1 = gB.updateBoxState(
    `${classList[3]}`,
    colors[initializer === playerIndex ? 0 : 1],
    initializer
  );
  const result2 = gB.updateBoxState(
    `${classList[4]}`,
    colors[initializer === playerIndex ? 0 : 1],
    initializer
  );

  return { result1, result2 };
};
