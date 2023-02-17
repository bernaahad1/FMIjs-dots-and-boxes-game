import { Router } from "./router";

import { socket } from "./client_db.js";
import { onLeaveRoom } from "./gameBoardActions.js";
import { style } from "./styles.js";
import { ModalComponent } from "./modalComponent.js";
import { AlertComponent } from "./alert.js";
import { onReplayGame } from "./gameBoardReplay";

import img from "./assets/logo_FMIJS.png";

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
        <section class="game-room">
    </section>
    <button class="replay-game-button">Click for replay (I am going to be shown at the end of the game!)<button/>
  `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const template = createHomeTemplate();

export class GameBoard extends HTMLElement {
  #_shadowRoot = null;

  constructor(
    name,
    size,
    players,
    playerIndex,
    plTurn,
    savedBoxes,
    clickedLines
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

    if (savedBoxes !== "") {
      this.boxes.forEach((val, key) => {
        if (val.owner !== -1) {
          this.playerScores[val.owner]++;
        }
      });
    }
  }

  updateSavedBoxColors() {
    const colors = { 0: "pink", 1: "gray" };

    this.savedBoxes.forEach((box) => {
      if (box[1].score >= 4) {
        this.#_shadowRoot.querySelector(
          `#box-${box[0]}`
        ).style.backgroundColor = colors[box[1].owner === this.playerIndex ? 0 : 1];
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

    this.#_shadowRoot.querySelector(".replay-game-button").addEventListener('click',onReplayGame);
    this.#_shadowRoot.querySelector(".replay-game-button").value = this.name;

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
    if(this.savedBoxes !== ''){
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

    console.log(this.boxes);

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
      this.chechWinner();
      return true;
      // document.getElementById(
      //   `${id}`
      // ).innerHTML += `<h1 class="winnerText">B<h1>`;
    }
    return false;
  }

  updateLineState(id) {
    const line = this.#_shadowRoot.querySelector(`#${id}`);

    line.style.opacity = 100;
    line.disabled = true;
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

  

  onScoreUpdate(index) {
    this.playerScores[index] += 1;
    const myEl = this.#_shadowRoot.querySelector(`.player-${index}`);
    myEl.innerHTML = this.playerScores[index];
  }

  chechWinner() {
    if (
      this.playerScores.length !== 2 ||
      this.playerScores[0] + this.playerScores[1] <
        (this.size - 1) * (this.size - 1)
    ) {
      return;
    }

    const opponentIndex = this.playerIndex === 0 ? 1 : 0;
    const description =
      this.playerScores[opponentIndex] < this.playerScores[this.playerIndex]
        ? "You are the winner!"
        : this.playerScores[opponentIndex] ===
          this.playerScores[this.playerIndex]
        ? "Both are the winners"
        : "You lost!";

    const modal = document.createElement("modal-component");
    modal.innerHTML = `<alert-component title="End Game!" description="${description}"/>`;
    this.#_shadowRoot.appendChild(modal);

    // disable playing when someone lefts
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
    disableDiv.className = "overlay-disable";
  }

  userLeft(playerLeftId) {
    console.log(this.playerIndex);

    if (this.playerIndex === -1) {
      console.log(this.playerIndex);

      const modal = document.createElement("modal-component");
      modal.innerHTML = `<alert-component title="Game Over!" description="One of the players left the game!"/>`;
      this.#_shadowRoot.appendChild(modal);
    } else {
      const modal = document.createElement("modal-component");
      modal.innerHTML = `<alert-component title="Game Over!" description="The other player left the game!\nYou are the winner!"/>`;
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
    } else {
      title = "Game Over!";
      description = "You can be winner next time!";
    }

    const modal = document.createElement("modal-component");
    modal.innerHTML = `<alert-component title="${title}" description="${description}" />`;
    this.#_shadowRoot.appendChild(modal);

    // disable playing the game when someone lefts
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");
    disableDiv.className = "overlay-disable";
  }

  onChangePlayTurn(myTurn) {
    const disableDiv = this.#_shadowRoot.querySelector(".overlay-disable");

    if (myTurn && this.playerIndex !== -1) {
      this.#_shadowRoot.querySelector(".game-state-turn").innerHTML =
        "Your turn";
      disableDiv.className = "overlay-disable hidden";
    } else if (this.playerIndex !== -1) {
      this.#_shadowRoot.querySelector(".game-state-turn").innerHTML =
        "Waiting for opponent to play";
      disableDiv.className = "overlay-disable";
    }
  }
}

customElements.define("game-board", GameBoard);
