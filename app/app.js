const board = document.getElementsByClassName("game-board")[0];
const mainConatiner = document.getElementsByClassName("main-content")[0];

const boardSize = 4;

const boxes = (() => {
  const bx = new Map([]);
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      bx[i + "" + j] = 0;
    }
  }
  return bx;
})();

createBoard = () => {
  board.innerHTML = `<section class="row">
          <div id="00" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 00"></button>
            <button class="line vertical left 00"></button>
          </div>
          <div id="01" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 01"></button>
            <button class="line vertical left 00 01"></button>
          </div>
          <div id="02" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 02"></button>
            <button class="line vertical left 01 02"></button>
          </div>
          <div id="03" class="box last">
            <div class="dot top-left"></div>
            <!-- <div class="line horizontal top"></div> -->
            <button class="line vertical left 02 03"></button>
          </div>
        </section>
        <section class="row">
          <div id="10" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 10 00"></button>
            <button class="line vertical left 10"></button>
          </div>
          <div id="11" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 11 01"></button>
            <button class="line vertical left 10 11"></button>
          </div>
          <div id="12" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 12 02"></button>
            <button class="line vertical left 11 12"></button>
          </div>
          <div id="13" class="box last">
            <div class="dot top-left"></div>
            <!-- <div class="line horizontal top"></div> -->
            <button class="line vertical left 12 13"></button>
          </div>
        </section>
        <section class="row">
          <div id="20" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 20 10"></button>
            <button class="line vertical left 20"></button>
          </div>
          <div id="21" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 21 11"></button>
            <button class="line vertical left 20 21"></button>
          </div>
          <div id="22" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 22 12"></button>
            <button class="line vertical left 21 22"></button>
          </div>
          <div id="23" class="box last">
            <div class="dot top-left"></div>
            <!-- <div class="line horizontal top"></div> -->
            <button class="line vertical left 22 23"></button>
          </div>
        </section>
        <section class="row last">
          <div id="30" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 30 20"></button>
            <!-- <div class="line vertical left"></div> -->
          </div>
          <div id="31" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 31 21"></button>
            <!-- <div class="line vertical left"></div> -->
          </div>
          <div id="32" class="box">
            <div class="dot top-left"></div>
            <button class="line horizontal top 32 22"></button>
            <!-- <div class="line vertical left"></div> -->
          </div>
          <div id="33" class="box last">
            <div class="dot top-left"></div>
            <!-- <div class="line horizontal top"></div> -->
            <!-- <div class="line vertical left"></div> -->
          </div>
        </section>`;

  const lines = [...document.querySelectorAll("button")];
  lines.forEach((el) => el.addEventListener("click", onLineClick));
};

createBoard();

const updateBoxState = (boxes, id) => {
  boxes[id]++;
  if (boxes[id] >= 4) {
    // document.getElementById(`${id}`).style.backgroundColor =
    //   "green";
    document.getElementById(
      `${id}`
    ).innerHTML += `<h1 class="winnerText">B<h1>`;
  }
};

function onLineClick(event) {
  event.preventDefault();
  event.target.style.opacity = 100;

  const classList = event.target.classList;
  if (classList.length === 4) {
    updateBoxState(boxes, classList[3]);
  } else if (classList.length > 4) {
    updateBoxState(boxes, classList[3]);
    updateBoxState(boxes, classList[4]);
  }
}
