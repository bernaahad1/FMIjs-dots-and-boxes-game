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

    socket.emit("fetchCurrentRoomState", currentRoom, ((r) => {
        //console.log(r)

    gameBoard = new GameBoard(
      r.name,
      r.size,
      r.players,
      playerIndex,
      -2,
      '',
      []
    );
    //console.log(gameBoard);

    const router = document
      .getElementsByTagName("app-root")[0]
      .shadowRoot.querySelector("app-router");
    router.render(`/roomReplay/${currentRoom}`, gameBoard);

    clickNextLine(r, r.clickedLines.length);
}))
};

const clickNextLine = async(r, len) => {
  let i = 0;
  const timer = setInterval(() => {
      const line = r.clickedLines[i];
      const from = r.clickedFrom[i];
      const cName = r.linesClassName[i];
      
      //console.log(`clicked ${line} from ${from} with className ${cName}`);
      gameBoard.updateLineState(line);
      seclectedLineUpdateBox(cName, from, gameBoard);
      i++;
      if(i === len){
        clearInterval(timer);
      }
  }, lineClick);
}
