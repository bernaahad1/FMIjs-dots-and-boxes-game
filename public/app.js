// const { io } = require("socket.io-client");
//const socket = io();


// TODO BERNA please make the code more understandable
import { onLineClick } from "./connectToServer.js";

export const board = document.getElementsByClassName("game-board")[0];
export const mainConatiner = document.getElementsByClassName("main-content")[0];

const boardSize = 10;

export const boxes = (() => {
  const bx = new Map([]);
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      bx[i + "" + j] = 0;
    }
  }
  return bx;
})();

export const createBoard = () => {
  const gameBoard = document.createElement("section");
  gameBoard.className = "game-board";

  for (let i = 0; i < boardSize; i++) {
    const section = document.createElement("section");
    section.className = "row";

    for (let j = 0; j < boardSize; j++) {
      const box = document.createElement("div");
      box.className = "box";
      box.id = `${i}${j}`;

      box.innerHTML += `<div class="dot top-left"></div>`;

      //Do not render top line if box is from last coll
      if (j < boardSize - 1) {
        box.innerHTML += `<button class="line horizontal top ${
          i - 1
        }${j} ${i}${j}"></button>`;
      }

      //Do not render left line if box is from last row
      if (i < boardSize - 1) {
        box.innerHTML += `<button class="line vertical left ${i}${
          j - 1
        } ${i}${j}"></button>`;
      }

      section.appendChild(box);
    }

    gameBoard.appendChild(section);
  }

  mainConatiner.appendChild(gameBoard);

  const lines = [...document.querySelectorAll("button")];
  lines.forEach((el) => el.addEventListener("click", onLineClick));
};

export const updateBoxState = (boxes, id, color) => {
  boxes[id]++;

  if (boxes[id] >= 4) {
    document.getElementById(`${id}`).style.backgroundColor = color;
    // document.getElementById(
    //   `${id}`
    // ).innerHTML += `<h1 class="winnerText">B<h1>`;
  }
};

// function onLineClick(event) {
//   event.preventDefault();
//   event.target.style.opacity = 100;
//   event.target.disabled = true;

//   const classList = event.target.classList;

//   updateBoxState(boxes, classList[3]);
//   updateBoxState(boxes, classList[4]);
// }
