export const style = `*,
::after,
::before {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

main {
  max-height: 100vh;
  width: 100%;
  margin: auto;
  /* padding-top: 10%; */
  background-color: #fff;
}
.game-board {
  width: 80%;
  margin: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.box {
  position: relative;
  z-index: 0;
  width: 50px;
  height: 50px;
}
.winnerText {
  z-index: 0;
  text-align: center;
  padding: 5;
  padding-left: 8px;
  font-size: 50px;
  background-color: transparent;
}
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.line {
  border-color: transparent;
}

.line.horizontal {
  position: absolute;
  z-index: 5;
  background-color: rgb(150, 214, 216);
  opacity: 30%;
  width: 50px;
  height: 8px;
  cursor: pointer;
}
.line.vertical {
  position: absolute;
  z-index: 5;
  background-color: rgb(150, 214, 216);
  opacity: 30%;
  height: 50px;
  width: 8px;
  cursor: pointer;
}
.line.vertical:hover {
  opacity: 100%;
}
.line.horizontal:hover {
  opacity: 100%;
}
.dot {
  position: absolute;
  top: -3.5px;
  left: -3.5px;
  z-index: 10;
  width: 15px;
  height: 15px;
  border-radius: 8px;
  background-color: rgb(234, 91, 120);
}

/* header */

.room.title.header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  max-height: 200px;
  padding: 10px;
  background-color: rgb(239, 249, 255);
  box-shadow: 0px 0px 20px 0px #eee;
}
.room.title.header img {
  max-height: 70px;
}
.create-room.exit {
  margin: 0;
}

.players {
  padding: 40px 10px 40px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}

.center {
  text-align: center;
}

.players h1 {
  padding: 0 10px 0 10px;
  border-radius: 5px;
  background-color: rgb(217, 217, 217);
}
h1.my-score {
  background-color: pink;
}

.overlay-disable {
  position: absolute;
  top: 200px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.overlay-disable.hidden {
  display: none;
}

.game-state {
  display: flex;
  padding: 40px 10px 0px 10px;
  justify-content: center;
}
.home-row{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: flex-start;
    flex-wrap: wrap;
}
.home-row-hidden{
    display: none;
    flex-direction: row;
    justify-content: space-around;
    align-content: flex-start;
    flex-wrap: wrap;
}

.home-column{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    flex-wrap: nowrap;
    row-gap: 15px;
}

.create-room{
    font-size: 30px;
    max-width: 240px;
    border-radius: 20px;
    color: black;
    background-color: #ffffff;
    border-color: #cbeefd;
    border-bottom-width: thick;
    border-right-width: thick;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
}

.create-room:hover{
    background-color: #cbeefd;
}

.home-column input {
    font-size: 24px;
    border-radius: 10px;
    border: none;
    background-color: #cbeefd;
    padding: 5px 10px;
}

.home-column h2{
    font-size: 50px;
}

.title{
    display: flex;
    justify-content: center;
}

.title img{
    max-height: 110px;
}

.ChooseRoom {
    font-size: 30px;
    max-width: 240px;
    border-radius: 20px;
    color: black;
    background-color: #ffffff;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
    border-color: #cbeefd;
    min-width: 280px;
}
.ChooseRoom:hover{
    background-color: #cbeefd;
}

.ChooseRoomFull {
    font-size: 30px;
    max-width: 240px;
    border-radius: 20px;
    color: black;
    background-color: #e997ab;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
    border: none;
    min-width: 280px;
}
.ChooseRoomFull:hover{
    background-color: #ffffff;
    border-color: #cbeefd;
}`;
