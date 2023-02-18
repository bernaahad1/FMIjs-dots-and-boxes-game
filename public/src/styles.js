import { style_bubble } from "./style_bubles";
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
  background-color: #F6F5F0;
}

a {
  text-align: center;
  text-decoration: none;
}

.game-board {
  width: 80%;
  margin: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-left: 43px;
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
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.center {
  text-align: center;
}

.players h1 {
  padding: 0 10px 0 10px;
  border-radius: 5px;
  background-color: rgb(217, 217, 217);
  margin-bottom: 10px;
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
  z-index: 200;
}

.overlay-disable.hidden {
  display: none;
}

.game-state {
  display: flex;
  padding: 40px 10px 0px 10px;
  justify-content: center;
}

.game-state h1{
    font-size: 36px;
    font-family: cursive;
}

.home-row{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
    flex-wrap: wrap;
    align-items: center;

}
#home-all-rooms{
  display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}

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
    padding: 0 20px;
  }

  .home-column.create{
    background-color: #f6eff0;
    padding:20px;
    border-radius:20px;
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

.exit-room{
  margin:0;
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
  margin-top:40px;
    font-size: 50px;
    align-self: center;
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
    width: 280px;
    overflow: hidden;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin: 0 10px;
    border-bottom-width: thick;
    border-right-width: thick;
}
.ChooseRoom:hover{
    background-color: #cbeefd;
}

.ChooseRoom img{
  width: 200px;
  border-radius: 20px;

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
}

.packman{
  font-size: 46px;
    border-radius: 24px;
    color: darkred;
    background-color: red;
    border-color: darkred;
    border-bottom-width: thick;
    border-right-width: thick;
    border-style: solid;
    margin: 0px auto;
    padding: 5px 20px;
    transition-duration: 0.4s;
    cursor: pointer;
    z-index:250;
    position: relative;
}

.packman:hover{
    background-color: #F6F5F0;
}

#packman-section{
  display: none;
    margin: 40px 0;
}


` + style_bubble;
