const board = document.getElementsByClassName("game-board");
const mainConatiner = document.getElementsByClassName("main-content");
const verticalLines = [...document.querySelectorAll("button")];

const onLineClick = (event) => {
  event.preventDefault();
  event.target.style.opacity = 100;
};

verticalLines.forEach((el) => el.addEventListener("click", onLineClick));
