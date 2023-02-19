import { GameBoard } from "./gameBoard.js";
import { seclectedLineUpdateBox } from "./gameBoardActions.js";

const lineClick = 1000;

import {
  socket,
  playerIndex,
  setPlayerIndex,
  currentRoom,
} from "./client_db.js";

let gameBoard = undefined;

export const onReplayGame = (event) => {
  const currentRoom = event.target.value;
  console.log(`${currentRoom} is being replayed from player ${playerIndex}`);

  socket.emit("fetchCurrentRoomState", currentRoom, (r) => {
    gameBoard = new GameBoard(
      r.name,
      r.size,
      r.players,
      playerIndex,
      -2,
      "",
      [],
      true
    );

    const router = document
      .getElementsByTagName("app-root")[0]
      .shadowRoot.querySelector("app-router");
    router.render(`/roomReplay/${currentRoom}`, gameBoard);

    clickNextLine(r, r.clickedLines.length);
  });
};

export const onReplayAfterEnd = (currentRoom, playerIndex) => {
  console.log(`${currentRoom} is being replayed from player ${playerIndex}`);

  socket.emit("fetchCurrentRoomState", currentRoom, (r) => {
    gameBoard = new GameBoard(
      r.name,
      r.size,
      r.players,
      playerIndex,
      -2,
      "",
      [],
      true
    );

    const router = document
      .getElementsByTagName("app-root")[0]
      .shadowRoot.querySelector("app-router");
    router.render(`/roomReplay/${currentRoom}`, gameBoard);

    clickNextLine(r, r.clickedLines.length);
  });
};

export const clickNextLine = async (r, len) => {
  let i = 0;
  const timer = setInterval(() => {
    const line = r.clickedLines[i];
    const from = r.clickedFrom[i];
    const cName = r.linesClassName[i];

    gameBoard.updateLineState(line);
    gameBoard.updateLineColor(
      line,
      from == gameBoard.playerIndex ? "pink" : "lightgray"
    );
    seclectedLineUpdateBox(cName, from, gameBoard);
    i++;
    if (i === len) {
      clearInterval(timer);
    }
  }, lineClick);
};
