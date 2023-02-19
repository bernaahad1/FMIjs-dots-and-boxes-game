import { Router } from "./router";

import { socket } from "./client_db.js";
import { onLeaveRoom } from "./gameBoardActions.js";
import { style } from "./styles.js";
import { bubble } from "./bubbles";
import { ModalComponent } from "./modalComponent.js";
import { AlertComponent } from "./alert.js";
import {
  onReplayGame,
  onReplayAfterEnd,
  clickNextLine,
} from "./gameBoardReplay";

import img from "./assets/logo_FMIJS.png";
import openMouth from "./assets/packman-mouth-open.png";
import closedMouth from "./assets/packman-mouth-closed.png";

export const generateBoxes = (size) => {
  const bx = new Map();
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      bx.set(`${i}${j}`, { score: 0, owner: -1 });
    }
  }
  return bx;
};

function createHomeTemplate() {
  const templateString = `
    <style>${style}</style>
    ${bubble}
     <section class="game-room"></section>
    <section id="packman-section">
      <button class="packman">Don't CLICK<button/>
    </section>
  `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const template = createHomeTemplate();

export class GameBoard extends HTMLElement {
  #_shadowRoot = null;
  winnerId = undefined;
  usedPackman = false;

  constructor(
    name,
    size,
    players,
    playerIndex,
    plTurn,
    savedBoxes,
    clickedLines,
    isReplay
  ) {
    super();

    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(template.content.cloneNode(true));

    this.name = name;
    this.size = parseInt(size) + 1;
    this.players = players;
    this.playerScores = players.map((el) => 0);
    this.boxes =
      savedBoxes === ""
        ? generateBoxes(parseInt(size) + 1)
        : new Map(savedBoxes);
    this.playerIndex = playerIndex;
    this.savedBoxes = savedBoxes;
    this.plTurn = plTurn;
    this.clickedLines = clickedLines || [];
    this.isReplay = isReplay;

    if (savedBoxes !== "") {
      this.boxes.forEach((val, key) => {
        if (val.owner !== -1) {
          this.playerScores[val.owner]++;
        }
      });
    }
  }

  updateSavedBoxColors() {
    const colors = { 0: "pink", 1: "lightgray" };

    this.savedBoxes.forEach((box) => {
      if (box[1].score >= 4) {
        this.#_shadowRoot.querySelector(
          `#box-${box[0]}`
        ).style.backgroundColor = colors[box[1].owner === 0 ? 0 : 1];
      }
    });
  }

  connectedCallback() {
    this.createBoard();

    const lines = [...this.#_shadowRoot.querySelectorAll("button.line")];
    lines.forEach((el) => el.addEventListener("click", this.onLineClick));

    this.#_shadowRoot
      .querySelector(".exit-room")
      .addEventListener("click", onLeaveRoom);

    this.#_shadowRoot
      .querySelector(".packman")
      .addEventListener("click", this.launchPackman);

    //load clicked elements
    this.clickedLines.forEach((lineId) => {
      const myEl = this.#_shadowRoot.querySelector(`#${lineId}`);
      myEl.style.opacity = 100;
      myEl.disabled = true;
    });

    console.log("playerIndex: ", this.playerIndex);
    if (this.playerIndex === -1) {
      console.log(this.playerScores, this.players);
    }
    if (this.savedBoxes !== "") {
      this.updateSavedBoxColors();
    }
  }

  createScoreTable() {
    return ``;
  }

  createBoard() {
    const gameRoom = this.#_shadowRoot.querySelector(".game-room");

    const gameBoard = document.createElement("section");
    gameBoard.className = "game-board";

    for (let i = 0; i < this.size; i++) {
      const section = document.createElement("section");
      section.className = "row";

      for (let j = 0; j < this.size; j++) {
        const box = document.createElement("div");
        box.className = "box";
        box.id = `box-${i}${j}`;

        box.innerHTML += `<div class="dot top-left"></div>`;

        //Do not render top line if box is from last coll
        if (j < this.size - 1) {
          box.innerHTML += `<button class="line horizontal top ${
            i - 1
          }${j} ${i}${j}" id="line${i - 1}${j}-${i}${j}"></button>`;
        }

        //Do not render left line if box is from last row
        if (i < this.size - 1) {
          box.innerHTML += `<button class="line vertical left ${i}${
            j - 1
          } ${i}${j}" id="line${i}${j - 1}-${i}${j}"></button>`;
        }

        section.appendChild(box);
      }

      gameBoard.appendChild(section);
    }

    let opponentIndex = this.playerIndex == 1 ? 0 : 1;
    let gameState =
      this.playerIndex == this.plTurn
        ? "Your turn"
        : "Waiting for opponent to play";

    if (this.playerIndex === -1) {
      opponentIndex = -1;
      gameState = "You can only watch";
    }
    if (this.plTurn === -2) {
      gameState = "You are watching replay";
    }

    //render header
    gameRoom.innerHTML += `<div class="room title header">
      <button class="create-room exit-room">Exit game</button>
          <img src="${img}" alt="Dots and Boxes"></img>
      </div>
      <div class="game-state"><h1 class="game-state-turn">${gameState}</h1></div>`;

    //render scores
    if (this.playerIndex === -1) {
      gameRoom.innerHTML += `<div class="players">
          <h1 class="my-score">Player 1: <span class="my-score player-0">${this.playerScores[0]}</span></h1>
          <h1>Player 2: <span class="opponent-sore player-1">${this.playerScores[1]}</span></h1>
        </div>`;
    } else {
      gameRoom.innerHTML += `<div class="players">
          <h1 class="my-score">Your score: <span class="my-score player-${
            this.playerIndex
          }">${this.playerScores[this.playerIndex]}</span></h1>
          <h1>Opponent score: <span class="opponent-sore player-${opponentIndex}">${
        this.playerScores[opponentIndex]
      }</span></h1>
        </div>`;
    }
    gameRoom.appendChild(gameBoard);
    gameRoom.innerHTML += `<h1 class="center">Room: ${this.name}</h1>`;

    const disableDiv = document.createElement("div");
    disableDiv.className = "overlay-disable";

    if (this.playerIndex == this.plTurn) {
      disableDiv.className += " hidden";
    }
    gameRoom.appendChild(disableDiv);

    // TODO load scored boxes
  }

  updateBoxState(id, color, playerIndex) {
    if (this.boxes.get(id) === undefined) {
      this.boxes.set(id, { score: NaN, owner: -1 });
    } else this.boxes.get(id).score++;

    //if(this.plTurn !== -2) {//-2 means replay
    socket.emit("save boxes", this.name, Array.from(this.boxes));
    //}

    if (this.boxes.get(id).score >= 4) {
      this.#_shadowRoot.querySelector(`#box-${id}`).style.backgroundColor =
        color;
      console.log(
        this.#_shadowRoot.querySelector(`#box-${id}`).style.backgroundColor
      );
      this.boxes.get(id).owner = playerIndex;
      this.onScoreUpdate(playerIndex);
      this.checkWinner();
      return true;
    }
    return false;
  }

  goToReplay() {
    console.log(
      `${this.name} is being replayed from player ${this.playerIndex}`
    );

    socket.emit("fetchCurrentRoomState", this.name, (r) => {
      gameBoard = new GameBoard(
        r.name,
        r.size,
        r.players,
        this.playerIndex,
        -2,
        "",
        []
      );

      const router = document
        .getElementsByTagName("app-root")[0]
        .shadowRoot.querySelector("app-router");
      router.render(`/roomReplay/${this.name}`, gameBoard);

      clickNextLine(r, r.clickedLines.length);
    });
  }

  updateLineState(id) {
    const line = this.#_shadowRoot.querySelector(`#${id}`);

    line.style.opacity = 100;
    line.disabled = true;
  }

  updateLineColor(id, color) {
    const line = this.#_shadowRoot.querySelector(`#${id}`);
    line.style.backgroundColor = color;
  }

  onLineClick(event) {
    console.log(event);
    socket.emit(
      "selectLine",
      event.target.className,
      event.target.id,
      this.playerIndex
    );
  }

  onScoreUpdate(index, add = 1) {
    this.playerScores[index] += add;
    const myEl = this.#_shadowRoot.querySelector(`.player-${index}`);
    myEl.innerHTML = this.playerScores[index];

    if (
      this.playerScores[0] + this.playerScores[1] === this.size - 1 &&
      !this.usedPackman &&
      this.plTurn != -2
    ) {
      this.#_shadowRoot.querySelector("#packman-section").style.display =
        "flex";
    }
  }

  checkWinner() {
    if (
      this.playerScores.length !== 2 ||
      this.playerScores[0] + this.playerScores[1] <
        (this.size - 1) * (this.size - 1)
    ) {
      return;
    }

    this.#_shadowRoot.querySelector("#packman-section").style.display = "none";

    const opponentIndex = parseInt(this.playerIndex) === 0 ? 1 : 0;

    const description =
      this.playerScores[opponentIndex] < this.playerScores[this.playerIndex]
        ? "You are the winner!"
        : this.playerScores[opponentIndex] ===
          this.playerScores[this.playerIndex]
        ? "Both are the winners"
        : "You lost!";

    this.winnerId =
      this.playerScores[opponentIndex] < this.playerScores[this.playerIndex]
        ? this.playerIndex
        : this.playerScores[opponentIndex] ===
          this.playerScores[this.playerIndex]
        ? 2
        : opponentIndex;

    const modal = document.createElement("modal-component");
    if (this.isReplay || this.usedPackman) {
      modal.callback = () => onLeaveRoom();
    } else {
      modal.callback = () => onReplayAfterEnd(this.name, this.playerIndex);
    }

    modal.setAttribute("path", `/roomReplay/${this.name}`);
    modal.innerHTML = `<alert-component title="End Game!" description="${description}" path="/roomReplay/${this.name}"/>`;
    setTimeout(() => {
      this.#_shadowRoot.appendChild(modal);
    }, 1000);

    // disable playing when game ends
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
    disableDiv.className = "overlay-disable";

    // socket.emit("winner", this.winnerId);
  }

  userLeft(playerLeftId) {
    console.log(this.playerIndex);

    if (this.#_shadowRoot.querySelector("modal-component") != null) {
      return;
    }

    if (this.winnerId >= 0 && this.playerIndex >= 0) {
      const modal = document.createElement("modal-component");

      modal.innerHTML = `<alert-component title="Your opponent left!" path="/" />`;
      this.#_shadowRoot.appendChild(modal);

      modal.callback = () => onLeaveRoom();

      const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
      disableDiv.className = "overlay-disable";
      return;
    }

    if (this.playerIndex === -1) {
      console.log(this.playerIndex);

      const modal = document.createElement("modal-component");
      modal.callback = () => onLeaveRoom();
      modal.innerHTML = `<alert-component title="Game Over!" description="One of the players left the game!" path="/"/>`;
      this.#_shadowRoot.appendChild(modal);
    } else {
      const modal = document.createElement("modal-component");
      modal.callback = () => onLeaveRoom();
      modal.innerHTML = `<alert-component title="Game Over!" description="The other player left the game!\nYou are the winner!" path="/" />`;
      this.#_shadowRoot.appendChild(modal);
    }

    // disable playing when someone lefts
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
    disableDiv.className = "overlay-disable";
  }

  showWinner(winnerId) {
    let title = "";
    let description = "";

    if (this.playerIndex === winnerId) {
      title = "Congratulations!";
      description = "You are the winner!";
    } else if (this.playerIndex !== -1) {
      title = "Game Over!";
      description = "You can be winner next time!";
    } else {
      title = "Game Over!";
      description = `Player ${winnerId} is the winner`;
    }

    const modal = document.createElement("modal-component");

    modal.callback = () => onReplayAfterEnd(this.name, this.playerIndex);

    modal.innerHTML = `<alert-component title="${title}" description="${description}" path="/roomReplay/${this.name}" />`;
    this.#_shadowRoot.appendChild(modal);

    // disable playing the game when someone lefts
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
    disableDiv.className = "overlay-disable";
  }

  onChangePlayTurn(myTurn) {
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");

    if (myTurn && this.playerIndex != -1) {
      this.#_shadowRoot.querySelector(".game-state-turn").innerHTML =
        "Your turn";
      disableDiv.className = "overlay-disable hidden";
      this.plTurn = this.playerIndex;
    } else if (this.playerIndex != -1) {
      this.#_shadowRoot.querySelector(".game-state-turn").innerHTML =
        "Waiting for opponent to play";
      disableDiv.className = "overlay-disable";
      this.plTurn = this.playerIndex == 0 ? 1 : 0;
    }
  }

  chooseMaxRow() {
    let numChosed = 0;
    let lines = [];
    let boxes = [];
    for (let i = 0; i < this.size - 1; i++) {
      let numCurrent = 0;
      let linesCurrent = [];
      let boxesCurrent = [];
      for (let j = 0; j < this.size - 1; j++) {
        boxesCurrent.push(`${i}${j}`);

        linesCurrent.push(`#line${i - 1}${j}-${i}${j}`);
        if (parseInt(this.boxes.get(`${i}${j}`).score) >= 4) {
          numCurrent++;
        }
      }
      if (numCurrent > numChosed) {
        numChosed = numCurrent;
        lines = [];
        lines = [...linesCurrent];
        boxes = [];
        boxes = [...boxesCurrent];
      }
    }

    socket.emit("start-packman", lines, boxes);
  }

  startPackman(lines, boxes) {
    // disable playing when packman starts alsa disable the packman button
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
    disableDiv.className = "overlay-disable";
    this.#_shadowRoot.querySelector(".packman").setAttribute("disabled", true);

    const rect = this.#_shadowRoot
      .querySelector(`${lines[0]}`)
      .getBoundingClientRect();

    let image = document.createElement("img");
    image.setAttribute("src", openMouth);
    image.setAttribute("id", "packman");
    image.style.position = "fixed";

    image.style.top = `${rect.top - 70}px`;

    this.#_shadowRoot.appendChild(image);
    let left = -150;
    image.style.left = `${left}px`;
    const windowWidth = window.innerWidth;

    let imageRect = image.getBoundingClientRect();

    // If 0 and 1 then open mouth if 2 and 3 then closed
    let currentImage = 0;
    const intervalId = setInterval(() => {
      if (imageRect.x > windowWidth) {
        // enable the game
        if (parseInt(this.playerIndex) == this.plTurn) {
          disableDiv.className = "overlay-disable hidden";
        }
        this.#_shadowRoot.querySelector(".packman").removeAttribute("disabled");

        clearInterval(intervalId);
      }
      left += 10;
      image.style.left = `${left}px`;

      image.setAttribute("src", currentImage <= 1 ? closedMouth : openMouth);

      currentImage = currentImage <= 3 ? currentImage + 1 : 0;
      imageRect = image.getBoundingClientRect();
      this.checkPackmanOverLine(imageRect.x + 30, lines, boxes);
    }, 100);
  }

  launchPackman = () => {
    this.chooseMaxRow();
    this.#_shadowRoot.querySelector("#packman-section").style.display = "none";
    this.usedPackman = true;
  };

  checkPackmanOverLine(x, lines, boxes) {
    for (let i = 0; i < lines.length; i++) {
      if (
        x >
        this.#_shadowRoot.querySelector(`${lines[i]}`).getBoundingClientRect()
          .left
      ) {
        this.removeRow(lines[i], boxes[i]);
      }
    }
  }

  removeRow(idRow) {
    if (this.#_shadowRoot.querySelector(`${idRow}`).style.opacity != 100) {
      return;
    }
    const twoBoxes = idRow.match(/-?[0-9]{2}/g);
    twoBoxes[1] = twoBoxes[1].match(/[0-9]{2}/g)[0];
    console.log(twoBoxes);

    twoBoxes.forEach((b) => {
      if (this.boxes.get(b) === undefined) {
        this.boxes.set(b, { score: NaN, owner: -1 });
      } else if (this.boxes.get(b).score >= 4) {
        console.log("remove owner score", parseInt(this.boxes.get(b).owner));
        this.onScoreUpdate(parseInt(this.boxes.get(b).owner), -1);

        this.#_shadowRoot.querySelector(`#box-${b}`).style.backgroundColor =
          null;
      }
      this.boxes.get(b).score--;
      this.#_shadowRoot.querySelector(`${idRow}`).style.opacity = "30%";
      this.#_shadowRoot.querySelector(`${idRow}`).removeAttribute("disabled");

      socket.emit("save boxes", this.name, Array.from(this.boxes));
    });
  }
}

customElements.define("game-board", GameBoard);
