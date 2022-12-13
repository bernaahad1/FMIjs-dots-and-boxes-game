import { onLeaveRoom, socket } from "./connectToServer.js";

// TODO BERNA please make the code more understandable

export const board = document.getElementsByClassName("game-board")[0];
export const mainConatiner = document.getElementsByClassName("main-content")[0];

export const generateBoxes = (size) => {
  const bx = new Map([]);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      bx[i + "" + j] = 0;
    }
  }
  return bx;
};

export class GameBoard {
  constructor(name, size, players, playerIndex) {
    this.name = name;
    this.size = parseInt(size) + 1;
    this.players = players;
    this.playerScores = players.map((el) => 0);
    this.boxes = generateBoxes(parseInt(size) + 1);
    this.playerIndex = playerIndex;
  }

  createScoreTable() {
    return ``;
  }

  createBoard() {
    const gameRoom = document.createElement("section");
    gameRoom.className = "game-room";

    const gameBoard = document.createElement("section");
    gameBoard.className = "game-board";

    for (let i = 0; i < this.size; i++) {
      const section = document.createElement("section");
      section.className = "row";

      for (let j = 0; j < this.size; j++) {
        const box = document.createElement("div");
        box.className = "box";
        box.id = `${i}${j}`;

        box.innerHTML += `<div class="dot top-left"></div>`;

        //Do not render top line if box is from last coll
        if (j < this.size - 1) {
          box.innerHTML += `<button class="line horizontal top ${
            i - 1
          }${j} ${i}${j}"></button>`;
        }

        //Do not render left line if box is from last row
        if (i < this.size - 1) {
          box.innerHTML += `<button class="line vertical left ${i}${
            j - 1
          } ${i}${j}"></button>`;
        }

        section.appendChild(box);
      }

      gameBoard.appendChild(section);
    }

    const opponentIndex = this.playerIndex == 1 ? 0 : 1;
    // TODO just for now
    const gameState =
      this.playerIndex == 0 ? "Your turn" : "Waiting for opponent to play";

    //render header
    gameRoom.innerHTML += `<div class="room title header">
      <button class="create-room exit-room">Exit game</button>
          <img src="./logo_FMIJS.png" alt="Dots and Boxes"></img>
      </div>
      <div class="game-state"><h1 class="game-state-turn">${gameState}</h1></div>
      <div class="players">
        <h1 class="my-score">Your score: <span class="my-score player-${
          this.playerIndex
        }">${this.playerScores[this.playerIndex]}</span></h1>
        <h1>Opponent score: <span class="opponent-sore player-${opponentIndex}">${
      this.playerScores[opponentIndex]
    }</span></h1>
      </div>`;

    gameRoom.appendChild(gameBoard);
    gameRoom.innerHTML += `<h1 class="center">Room: ${this.name}</h1>`;

    const disableDiv = document.createElement("div");
    disableDiv.className = "overlay-disable";

    if (this.playerIndex == 0) {
      disableDiv.className += " hidden";
    }
    gameRoom.appendChild(disableDiv);
    mainConatiner.appendChild(gameRoom);

    const lines = [...document.querySelectorAll("button.line")];
    lines.forEach((el) => el.addEventListener("click", this.onLineClick));

    document
      .getElementsByClassName("exit-room")[0]
      .addEventListener("click", onLeaveRoom);
  }

  updateBoxState(id, color, playerIndex) {
    this.boxes[id]++;
    
    console.log(this.boxes);
    if (this.boxes[id] >= 4) {
      document.getElementById(`${id}`).style.backgroundColor = color;

      this.onScoreUpdate(playerIndex);
      return true;
      // document.getElementById(
      //   `${id}`
      // ).innerHTML += `<h1 class="winnerText">B<h1>`;
    }
    return false;
  }

  onLineClick(event) {
    socket.emit("selectLine", event.target.className, this.playerIndex);
  }

  onScoreUpdate(index) {
    this.playerScores[index] += 1;
    const myEl = document.getElementsByClassName(`player-${index}`)[0];
    myEl.innerHTML = this.playerScores[index];
  }

  onChangePlayTurn(myTurn) {
    const disableDiv = document.getElementsByClassName("overlay-disable")[0];

    if (myTurn) {
      document.getElementsByClassName("game-state-turn")[0].innerHTML =
        "Your turn";
      disableDiv.className = "overlay-disable hidden";
    } else {
      document.getElementsByClassName("game-state-turn")[0].innerHTML =
        "Waiting for opponent to play";
      disableDiv.className = "overlay-disable";
    }
  }
}
