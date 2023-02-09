import { GameBoard } from "./gameBoard.js";

import { socket, playerIndex, setPlayerIndex, currentRoom } from "./client_db.js";

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

    const router = document.getElementsByTagName("app-root")[0].shadowRoot.querySelector("app-router");
    router.render(`/${currentRoom}`,gameBoard);

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

    document.getElementsByTagName("app-root")[0].resetToHome();
  });
};

// socket.on("new user", (users) => {
//   console.log("users change");
// });

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
      console.log(`other saved turn => ${playerIndex == 0 ? 1 : 0}`);
      socket.emit("set turn", playerIndex == 0 ? 1 : 0);
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
