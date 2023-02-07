/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameRoom.css":
/*!**************************!*\
  !*** ./src/gameRoom.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://public/./src/gameRoom.css?");

/***/ }),

/***/ "./src/home.css":
/*!**********************!*\
  !*** ./src/home.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://public/./src/home.css?");

/***/ }),

/***/ "./src/gameBoard.js":
/*!**************************!*\
  !*** ./src/gameBoard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameBoard\": () => (/* binding */ GameBoard),\n/* harmony export */   \"generateBoxes\": () => (/* binding */ generateBoxes)\n/* harmony export */ });\n/* harmony import */ var _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoardActions.js */ \"./src/gameBoardActions.js\");\n/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.js */ \"./src/styles.js\");\n/* harmony import */ var _assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/logo_FMIJS.png */ \"./src/assets/logo_FMIJS.png\");\n\r\n\r\n\r\n\r\n\r\nconst generateBoxes = (size) => {\r\n  const bx = new Map();\r\n  for (let i = 0; i < size; i++) {\r\n    for (let j = 0; j < size; j++) {\r\n      bx.set(`${i}${j}`, { score: 0, owner: -1 });\r\n    }\r\n  }\r\n  return bx;\r\n};\r\n\r\nfunction createHomeTemplate() {\r\n  const templateString = `\r\n  <style>${_styles_js__WEBPACK_IMPORTED_MODULE_1__.style}</style>\r\n        <section class=\"game-room\">\r\n        </section>\r\n    `;\r\n\r\n  const templateElement = document.createElement(\"template\");\r\n  templateElement.innerHTML = templateString;\r\n  return templateElement;\r\n}\r\n\r\nconst template = createHomeTemplate();\r\n\r\nclass GameBoard extends HTMLElement {\r\n  #_shadowRoot = null;\r\n\r\n  constructor(\r\n    name,\r\n    size,\r\n    players,\r\n    playerIndex,\r\n    plTurn,\r\n    savedBoxes,\r\n    clickedLines\r\n  ) {\r\n    super();\r\n\r\n    this.#_shadowRoot = this.attachShadow({ mode: \"closed\" });\r\n    this.#_shadowRoot.appendChild(template.content.cloneNode(true));\r\n\r\n    this.name = name;\r\n    this.size = parseInt(size) + 1;\r\n    this.players = players;\r\n    this.playerScores = players.map((el) => 0);\r\n    this.boxes =\r\n      savedBoxes === \"\"\r\n        ? generateBoxes(parseInt(size) + 1)\r\n        : new Map(savedBoxes);\r\n    this.playerIndex = playerIndex;\r\n    this.savedBoxes = savedBoxes;\r\n    this.plTurn = plTurn;\r\n    this.clickedLines = clickedLines || [];\r\n\r\n    if (savedBoxes !== \"\") {\r\n      this.boxes.forEach((val, key) => {\r\n        if (val.owner !== -1) {\r\n          this.playerScores[val.owner]++;\r\n        }\r\n      });\r\n    }\r\n  }\r\n\r\n  connectedCallback() {\r\n    this.createBoard();\r\n\r\n    const lines = [...this.#_shadowRoot.querySelectorAll(\"button.line\")];\r\n    lines.forEach((el) => el.addEventListener(\"click\", this.onLineClick));\r\n\r\n    this.#_shadowRoot\r\n      .querySelector(\".exit-room\")\r\n      .addEventListener(\"click\", _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.onLeaveRoom);\r\n\r\n    //load clicked elements\r\n    this.clickedLines.forEach((cl) => {\r\n      const myEl = this.#_shadowRoot.querySelector(`#${cl}`)[0];\r\n      myEl.style.opacity = 100;\r\n      myEl.disabled = true;\r\n    });\r\n  }\r\n\r\n  createScoreTable() {\r\n    return ``;\r\n  }\r\n\r\n  createBoard() {\r\n    const gameRoom = this.#_shadowRoot.querySelector(\".game-room\");\r\n    // gameRoom.className = \"game-room\";\r\n\r\n    const gameBoard = document.createElement(\"section\");\r\n    gameBoard.className = \"game-board\";\r\n\r\n    for (let i = 0; i < this.size; i++) {\r\n      const section = document.createElement(\"section\");\r\n      section.className = \"row\";\r\n\r\n      for (let j = 0; j < this.size; j++) {\r\n        const box = document.createElement(\"div\");\r\n        box.className = \"box\";\r\n        box.id = `${i}${j}`;\r\n\r\n        box.innerHTML += `<div class=\"dot top-left\"></div>`;\r\n\r\n        //Do not render top line if box is from last coll\r\n        if (j < this.size - 1) {\r\n          box.innerHTML += `<button class=\"line horizontal top ${i - 1}${j} \r\n          ${i}${j}\"></button>`;\r\n        }\r\n\r\n        //Do not render left line if box is from last row\r\n        if (i < this.size - 1) {\r\n          box.innerHTML += `<button class=\"line vertical left ${i}${j - 1} \r\n          ${i}${j}\"></button>`;\r\n        }\r\n\r\n        section.appendChild(box);\r\n      }\r\n\r\n      gameBoard.appendChild(section);\r\n    }\r\n\r\n    let opponentIndex = this.playerIndex == 1 ? 0 : 1;\r\n    let gameState =\r\n      this.playerIndex == this.plTurn\r\n        ? \"Your turn\"\r\n        : \"Waiting for opponent to play\";\r\n\r\n    if (this.playerIndex === -1) {\r\n      opponentIndex = -1;\r\n      gameState = \"You can only watch\";\r\n    }\r\n\r\n    //render header\r\n    gameRoom.innerHTML += `<div class=\"room title header\">\r\n      <button class=\"create-room exit-room\">Exit game</button>\r\n          <img src=\"${_assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_2__}\" alt=\"Dots and Boxes\"></img>\r\n      </div>\r\n      <div class=\"game-state\"><h1 class=\"game-state-turn\">${gameState}</h1></div>`;\r\n\r\n    //render scores\r\n    if (this.playerIndex === -1) {\r\n      gameRoom.innerHTML += `<div class=\"players\">\r\n          <h1 class=\"my-score\">Player 1: <span class=\"my-score player-0\">${this.playerScores[0]}</span></h1>\r\n          <h1>Player 2: <span class=\"opponent-sore player-1\">${this.playerScores[1]}</span></h1>\r\n        </div>`;\r\n    } else {\r\n      gameRoom.innerHTML += `<div class=\"players\">\r\n          <h1 class=\"my-score\">Your score: <span class=\"my-score player-${\r\n            this.playerIndex\r\n          }\">${this.playerScores[this.playerIndex]}</span></h1>\r\n          <h1>Opponent score: <span class=\"opponent-sore player-${opponentIndex}\">${\r\n        this.playerScores[opponentIndex]\r\n      }</span></h1>\r\n        </div>`;\r\n    }\r\n    gameRoom.appendChild(gameBoard);\r\n    gameRoom.innerHTML += `<h1 class=\"center\">Room: ${this.name}</h1>`;\r\n\r\n    const disableDiv = document.createElement(\"div\");\r\n    disableDiv.className = \"overlay-disable\";\r\n\r\n    if (this.playerIndex == this.plTurn) {\r\n      disableDiv.className += \" hidden\";\r\n    }\r\n    gameRoom.appendChild(disableDiv);\r\n\r\n    // TODO load scored boxes\r\n  }\r\n\r\n  updateBoxState(id, color, playerIndex) {\r\n    if (this.boxes.get(id) === undefined) {\r\n      this.boxes.set(id, { score: NaN, owner: -1 });\r\n    } else this.boxes.get(id).score++;\r\n\r\n    console.log(this.boxes);\r\n    _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"save boxes\", this.name, Array.from(this.boxes));\r\n    if (this.boxes.get(id).score >= 4) {\r\n      document.getElementById(`${id}`).style.backgroundColor = color;\r\n      this.boxes.get(id).owner = playerIndex;\r\n      this.onScoreUpdate(playerIndex);\r\n      return true;\r\n      // document.getElementById(\r\n      //   `${id}`\r\n      // ).innerHTML += `<h1 class=\"winnerText\">B<h1>`;\r\n    }\r\n    return false;\r\n  }\r\n\r\n  onLineClick(event) {\r\n    _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"selectLine\", event.target.className, this.playerIndex);\r\n  }\r\n\r\n  onScoreUpdate(index) {\r\n    this.playerScores[index] += 1;\r\n    const myEl = document.getElementsByClassName(`player-${index}`)[0];\r\n    myEl.innerHTML = this.playerScores[index];\r\n  }\r\n\r\n  onChangePlayTurn(myTurn) {\r\n    const disableDiv = document.getElementsByClassName(\"overlay-disable\")[0];\r\n\r\n    if (myTurn && this.playerIndex !== -1) {\r\n      document.getElementsByClassName(\"game-state-turn\")[0].innerHTML =\r\n        \"Your turn\";\r\n      disableDiv.className = \"overlay-disable hidden\";\r\n    } else if (this.playerIndex !== -1) {\r\n      document.getElementsByClassName(\"game-state-turn\")[0].innerHTML =\r\n        \"Waiting for opponent to play\";\r\n      disableDiv.className = \"overlay-disable\";\r\n    }\r\n  }\r\n}\r\n\r\ncustomElements.define(\"game-board\", GameBoard);\r\n\n\n//# sourceURL=webpack://public/./src/gameBoard.js?");

/***/ }),

/***/ "./src/gameBoardActions.js":
/*!*********************************!*\
  !*** ./src/gameBoardActions.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"onChooseRoom\": () => (/* binding */ onChooseRoom),\n/* harmony export */   \"onLeaveRoom\": () => (/* binding */ onLeaveRoom),\n/* harmony export */   \"socket\": () => (/* binding */ socket)\n/* harmony export */ });\n/* harmony import */ var _gameBoard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard.js */ \"./src/gameBoard.js\");\n\r\n\r\nconst socket = io();\r\n\r\nlet username = \"user 1\";\r\nlet playerIndex = -1;\r\nlet currentRoom = \"\";\r\nlet gameBoard = undefined;\r\n\r\nconst onChooseRoom = (event) => {\r\n  const currentRoom = event.target.value;\r\n  console.log(`updated currentRoom to: ${currentRoom}`);\r\n  socket.emit(\"join room\", currentRoom, (r, index) => {\r\n    console.log(r);\r\n    playerIndex = index;\r\n    console.log(`Player ${playerIndex} has connected`);\r\n\r\n    gameBoard = new _gameBoard_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard(\r\n      r.name,\r\n      r.size,\r\n      r.players,\r\n      playerIndex,\r\n      r.plTurn,\r\n      r.savedBoxes,\r\n      r.clickedLines\r\n    );\r\n    console.log(gameBoard);\r\n\r\n    document.getElementsByTagName(\"app-root\")[0].renderGameRoom(gameBoard);\r\n\r\n    if (playerIndex === -1) {\r\n      //He should only watch, but not play\r\n    }\r\n  });\r\n};\r\n\r\nconst onLeaveRoom = (event) => {\r\n  socket.emit(\"leave room\", () => {\r\n    console.log(`Player ${playerIndex} has disconnected`);\r\n    gameBoard = undefined;\r\n    playerIndex = -1;\r\n\r\n    document.getElementsByTagName(\"app-root\")[0].resetToHome();\r\n  });\r\n};\r\n\r\nsocket.on(\"new user\", (users) => {\r\n  console.log(\"users change\");\r\n});\r\n\r\nsocket.on(\"user left\", (room) => {\r\n  if (room !== gameBoard.name) {\r\n    return;\r\n  }\r\n  const gameRoom = document.getElementsByClassName(\"game-room\")[0];\r\n  document.getElementsByClassName(\"main-content\")[0].removeChild(gameRoom);\r\n\r\n  //just for now\r\n  gameBoard = new _gameBoard_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard(\r\n    gameBoard.name,\r\n    gameBoard.size - 1,\r\n    gameBoard.players,\r\n    playerIndex\r\n  );\r\n  console.log(\"You win\");\r\n});\r\n\r\n//selecting lines\r\nsocket.on(\"selectLine\", (className, initializer) => {\r\n  const myEl = document.getElementsByClassName(className)[0];\r\n  console.log(`Start: ${initializer}; Element to update: ${myEl}`);\r\n  myEl.style.opacity = 100;\r\n  myEl.disabled = true;\r\n\r\n  if (initializer === playerIndex) {\r\n    const result1 = gameBoard.updateBoxState(\r\n      myEl.classList[3],\r\n      \"green\",\r\n      initializer\r\n    );\r\n    const result2 = gameBoard.updateBoxState(\r\n      myEl.classList[4],\r\n      \"green\",\r\n      initializer\r\n    );\r\n\r\n    if (!result1 && !result2) {\r\n      console.log(`other saved turn => ${playerIndex == 0 ? 1 : 0}`);\r\n      socket.emit(\"set turn\", playerIndex == 0 ? 1 : 0);\r\n      gameBoard.onChangePlayTurn(false);\r\n    }\r\n\r\n    return;\r\n  } else {\r\n    const result1 = gameBoard.updateBoxState(\r\n      myEl.classList[3],\r\n      \"red\",\r\n      initializer\r\n    );\r\n    const result2 = gameBoard.updateBoxState(\r\n      myEl.classList[4],\r\n      \"red\",\r\n      initializer\r\n    );\r\n\r\n    if (!result1 && !result2) {\r\n      console.log(\"my turn\");\r\n      gameBoard.onChangePlayTurn(true);\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://public/./src/gameBoardActions.js?");

/***/ }),

/***/ "./src/home.js":
/*!*********************!*\
  !*** ./src/home.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Home\": () => (/* binding */ Home),\n/* harmony export */   \"home\": () => (/* binding */ home)\n/* harmony export */ });\n/* harmony import */ var _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoardActions.js */ \"./src/gameBoardActions.js\");\n/* harmony import */ var _assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/logo_FMIJS.png */ \"./src/assets/logo_FMIJS.png\");\n/* harmony import */ var _styles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.js */ \"./src/styles.js\");\n/* harmony import */ var _gameRoom_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameRoom.css */ \"./src/gameRoom.css\");\n/* harmony import */ var _home_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home.css */ \"./src/home.css\");\n\r\n\r\n\r\n\r\n\r\n\r\nlet rooms = new Map();\r\nlet username = \"user 1\";\r\n\r\n_gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"new room\", (r) => {\r\n  rooms = new Map(r);\r\n  document\r\n    .getElementsByTagName(\"app-root\")[0]\r\n    .shadowRoot.querySelector(\"home-page\")\r\n    .generateAllExitingRooms();\r\n});\r\n\r\n_gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"update room\", (room) => {\r\n  document\r\n    .getElementsByTagName(\"app-root\")[0]\r\n    .shadowRoot.querySelector(\"home-page\")\r\n    .updateRoomButton(room);\r\n});\r\n\r\n_gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"fetch rooms\", (r) => {\r\n  rooms = new Map(r);\r\n\r\n  console.log(\"fetch rooms\");\r\n  document\r\n    .getElementsByTagName(\"app-root\")[0]\r\n    .shadowRoot.querySelector(\"home-page\")\r\n    .generateAllExitingRooms();\r\n});\r\n\r\nfunction createHomeTemplate() {\r\n  const templateString = `\r\n  <style>${_styles_js__WEBPACK_IMPORTED_MODULE_2__.style}</style>\r\n        <div class=\"home-row\" id=\"home-menu\">\r\n          <div class=\"home-column\">\r\n            <div class=\"title\">\r\n              <img src=\"${_assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_1__}\" alt=\"Dots and Boxes\" />\r\n            </div>\r\n            <button class=\"create-room\">Create Room</button>\r\n            <input type=\"text\" id=\"IRoomName\" placeholder=\"Room name\" maxlength=\"10\" required>\r\n            <input type=\"number\" id=\"IGridSize\" placeholder=\"Grid size(4-10)\" min=\"4\" max=\"10\" required>\r\n          </div>\r\n          <div class=\"home-column\">\r\n            <h2>All Rooms</h2>\r\n            <div id=\"home-all-rooms\" class=\"home-column\">\r\n\r\n            </div>\r\n          </div>\r\n        </div>\r\n    `;\r\n\r\n  const templateElement = document.createElement(\"template\");\r\n  templateElement.innerHTML = templateString;\r\n  return templateElement;\r\n}\r\n\r\nconst template = createHomeTemplate();\r\n\r\nclass Home extends HTMLElement {\r\n  #_shadowRoot = null;\r\n  newRoomName = \"\";\r\n  newRoomSize = 0;\r\n\r\n  constructor() {\r\n    super();\r\n\r\n    // TODO for later maybe create new component that is home-all-rooms\r\n    // save the instance of it in Home and use its methods for create room, reset room, and etc\r\n\r\n    this.#_shadowRoot = this.attachShadow({ mode: \"closed\" });\r\n    this.#_shadowRoot.appendChild(template.content.cloneNode(true));\r\n\r\n    this.#_shadowRoot\r\n      .querySelector(\".create-room\")\r\n      .addEventListener(\"click\", this.onCreateRoom);\r\n\r\n    this.#_shadowRoot\r\n      .querySelector(\"#IRoomName\")\r\n      .addEventListener(\"change\", this.changeRoomInput);\r\n\r\n    this.#_shadowRoot\r\n      .querySelector(\"#IGridSize\")\r\n      .addEventListener(\"change\", this.changeSizeInput);\r\n  }\r\n\r\n  connectedCallback() {\r\n    _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"join server\", username);\r\n  }\r\n\r\n  changeRoomInput = (e) => {\r\n    console.log(e.target.value);\r\n    this.newRoomName = e.target.value;\r\n  };\r\n\r\n  changeSizeInput = (e) => {\r\n    this.newRoomSize = e.target.value;\r\n  };\r\n\r\n  onCreateRoom = (e, roomName = \"defauty\", numPlayers = 2, gridSize = 4) => {\r\n    console.log(`${this.newRoomName} and ${this.newRoomSize}`);\r\n    if (this.newRoomName === \"\") {\r\n      alert(\"Add name\");\r\n      return;\r\n    }\r\n    if (\r\n      this.newRoomSize < 4 ||\r\n      this.newRoomSize > 10 ||\r\n      Number(this.newRoomSize) === NaN\r\n    ) {\r\n      alert(\"Wrong grid size!!!\");\r\n      return;\r\n    }\r\n    _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"create room\", this.newRoomName, this.newRoomSize, 2);\r\n    this.createRoomButton(this.newRoomName, numPlayers, 0, \"waiting\");\r\n  };\r\n\r\n  createRoomButton(roomName, numPlayers, playersConnected, _state) {\r\n    const allRooms = this.#_shadowRoot.querySelector(\"#home-all-rooms\");\r\n    let button = document.createElement(\"button\");\r\n    button.className = \"ChooseRoom\";\r\n    button.id = `${roomName}`;\r\n    button.value = `${roomName}`;\r\n\r\n    if (numPlayers === playersConnected) {\r\n      button.className = \"ChooseRoomFull\";\r\n    } else {\r\n      button.className = \"ChooseRoom\";\r\n    }\r\n\r\n    button.innerHTML += `${roomName} ${playersConnected}/${numPlayers} ${_state}`;\r\n    allRooms.appendChild(button);\r\n  }\r\n\r\n  resetRooms() {\r\n    this.#_shadowRoot.querySelector(\"#home-all-rooms\").innerHTML = \"\";\r\n  }\r\n\r\n  updateRoomButton = (room) => {\r\n    const button = this.#_shadowRoot.querySelector(`#${room.name}`);\r\n    const numPlayers = room.players.length;\r\n    let connected = room.connected;\r\n    const state = numPlayers === connected ? \"playing\" : \"pending\";\r\n\r\n    button.innerHTML = button.innerHTML.replace(/ [0-9]*?\\//, ` ${connected}/`);\r\n    button.innerHTML = button.innerHTML.replace(/ [a-z]*?$/, ` ${state}`);\r\n\r\n    console.log(`${numPlayers} ${connected}`);\r\n    if (numPlayers === connected) {\r\n      button.className = \"ChooseRoomFull\";\r\n    } else {\r\n      button.className = \"ChooseRoom\";\r\n    }\r\n  };\r\n\r\n  generateAllExitingRooms = () => {\r\n    this.resetRooms();\r\n\r\n    const allRooms = Array.from(rooms.values());\r\n    allRooms.forEach((r) => {\r\n      let connected = 0;\r\n      r.players.forEach((p) => {\r\n        if (p !== null) {\r\n          connected++;\r\n        }\r\n      });\r\n\r\n      this.createRoomButton(\r\n        r.name,\r\n        r.players.length,\r\n        connected,\r\n        connected === r.players.length ? \"ready\" : \"waiting\"\r\n      );\r\n    });\r\n\r\n    let roomButtons = this.#_shadowRoot.querySelectorAll(\".ChooseRoom\");\r\n    console.log(roomButtons);\r\n    for (let i = 0; i < roomButtons.length; i++) {\r\n      roomButtons[i].addEventListener(\"click\", _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.onChooseRoom);\r\n    }\r\n\r\n    roomButtons = this.#_shadowRoot.querySelectorAll(\".ChooseRoomFull\");\r\n    for (let i = 0; i < roomButtons.length; i++) {\r\n      roomButtons[i].addEventListener(\"click\", _gameBoardActions_js__WEBPACK_IMPORTED_MODULE_0__.onChooseRoom);\r\n    }\r\n  };\r\n}\r\n\r\ncustomElements.define(\"home-page\", Home);\r\n\r\nconst home = new Home();\r\n\n\n//# sourceURL=webpack://public/./src/home.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AppComponent\": () => (/* binding */ AppComponent),\n/* harmony export */   \"app\": () => (/* binding */ app)\n/* harmony export */ });\n/* harmony import */ var _gameRoom_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameRoom.css */ \"./src/gameRoom.css\");\n/* harmony import */ var _home_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home.css */ \"./src/home.css\");\n/* harmony import */ var _home_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home.js */ \"./src/home.js\");\n\r\n\r\n\r\n// import \"./gameRoom.css\";\r\n// import \"./home.css\";\r\n\r\nfunction createMainTemplate() {\r\n  const templateString = `\r\n        <main class=\"main-content\">\r\n        <home-page></home-page>\r\n        </main>\r\n    `;\r\n\r\n  const templateElement = document.createElement(\"template\");\r\n  templateElement.innerHTML = templateString;\r\n  return templateElement;\r\n}\r\n\r\nconst template = createMainTemplate();\r\n\r\nclass AppComponent extends HTMLElement {\r\n  #_shadowRoot = null;\r\n\r\n  constructor() {\r\n    super();\r\n    this.#_shadowRoot = this.attachShadow({ mode: \"open\" });\r\n    this.#_shadowRoot.appendChild(template.content.cloneNode(true));\r\n    // this.#_shadowRoot.appendChild(home);\r\n  }\r\n\r\n  renderGameRoom(gameRoom) {\r\n    this.#_shadowRoot.querySelector(\"home-page\").setAttribute(\"hidden\", true);\r\n    this.#_shadowRoot.querySelector(\"main\").appendChild(gameRoom);\r\n  }\r\n\r\n  resetToHome() {\r\n    this.#_shadowRoot.innerHTML = \"\";\r\n    this.#_shadowRoot.appendChild(template.content.cloneNode(true));\r\n\r\n    // this.#_shadowRoot.querySelector(\"home-page\").removeAttribute(\"hidden\");\r\n    // this.#_shadowRoot\r\n    //   .querySelector(\"main\").re\r\n    //   .appendChild(gameRoom)\r\n    //   .setAttribute(\"hidden\", true);\r\n  }\r\n}\r\n\r\ncustomElements.define(\"app-root\", AppComponent);\r\n\r\nconst app = new AppComponent();\r\n\r\ndocument.body.appendChild(app);\r\n\n\n//# sourceURL=webpack://public/./src/index.js?");

/***/ }),

/***/ "./src/styles.js":
/*!***********************!*\
  !*** ./src/styles.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"style\": () => (/* binding */ style)\n/* harmony export */ });\nconst style = `*,\r\n::after,\r\n::before {\r\n  box-sizing: border-box;\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\nmain {\r\n  max-height: 100vh;\r\n  width: 100%;\r\n  margin: auto;\r\n  /* padding-top: 10%; */\r\n  background-color: #fff;\r\n}\r\n.game-board {\r\n  width: 80%;\r\n  margin: auto;\r\n  align-items: center;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.box {\r\n  position: relative;\r\n  z-index: 0;\r\n  width: 50px;\r\n  height: 50px;\r\n}\r\n.winnerText {\r\n  z-index: 0;\r\n  text-align: center;\r\n  padding: 5;\r\n  padding-left: 8px;\r\n  font-size: 50px;\r\n  background-color: transparent;\r\n}\r\n.row {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex-wrap: nowrap;\r\n}\r\n.line {\r\n  border-color: transparent;\r\n}\r\n\r\n.line.horizontal {\r\n  position: absolute;\r\n  z-index: 5;\r\n  background-color: rgb(150, 214, 216);\r\n  opacity: 30%;\r\n  width: 50px;\r\n  height: 8px;\r\n  cursor: pointer;\r\n}\r\n.line.vertical {\r\n  position: absolute;\r\n  z-index: 5;\r\n  background-color: rgb(150, 214, 216);\r\n  opacity: 30%;\r\n  height: 50px;\r\n  width: 8px;\r\n  cursor: pointer;\r\n}\r\n.line.vertical:hover {\r\n  opacity: 100%;\r\n}\r\n.line.horizontal:hover {\r\n  opacity: 100%;\r\n}\r\n.dot {\r\n  position: absolute;\r\n  top: -3.5px;\r\n  left: -3.5px;\r\n  z-index: 10;\r\n  width: 15px;\r\n  height: 15px;\r\n  border-radius: 8px;\r\n  background-color: rgb(234, 91, 120);\r\n}\r\n\r\n/* header */\r\n\r\n.room.title.header {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  flex-direction: row;\r\n  flex-wrap: nowrap;\r\n  align-content: center;\r\n  align-items: center;\r\n  max-height: 200px;\r\n  padding: 10px;\r\n  background-color: rgb(239, 249, 255);\r\n  box-shadow: 0px 0px 20px 0px #eee;\r\n}\r\n.room.title.header img {\r\n  max-height: 70px;\r\n}\r\n.create-room.exit {\r\n  margin: 0;\r\n}\r\n\r\n.players {\r\n  padding: 40px 10px 40px 10px;\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: space-evenly;\r\n  align-items: center;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.center {\r\n  text-align: center;\r\n}\r\n\r\n.players h1 {\r\n  padding: 0 10px 0 10px;\r\n  border-radius: 5px;\r\n  background-color: rgb(217, 217, 217);\r\n}\r\nh1.my-score {\r\n  background-color: pink;\r\n}\r\n\r\n.overlay-disable {\r\n  position: absolute;\r\n  top: 200px;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  z-index: 1000;\r\n}\r\n\r\n.overlay-disable.hidden {\r\n  display: none;\r\n}\r\n\r\n.game-state {\r\n  display: flex;\r\n  padding: 40px 10px 0px 10px;\r\n  justify-content: center;\r\n}\r\n.home-row{\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-around;\r\n    align-content: flex-start;\r\n    flex-wrap: wrap;\r\n}\r\n.home-row-hidden{\r\n    display: none;\r\n    flex-direction: row;\r\n    justify-content: space-around;\r\n    align-content: flex-start;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.home-column{\r\n    display: flex;\r\n    justify-content: flex-start;\r\n    flex-direction: column;\r\n    flex-wrap: nowrap;\r\n    row-gap: 15px;\r\n}\r\n\r\n.create-room{\r\n    font-size: 30px;\r\n    max-width: 240px;\r\n    border-radius: 20px;\r\n    color: black;\r\n    background-color: #ffffff;\r\n    border-color: #cbeefd;\r\n    border-bottom-width: thick;\r\n    border-right-width: thick;\r\n    border-style: solid;\r\n    margin: 0px auto;\r\n    padding: 5px 20px;\r\n    transition-duration: 0.4s;\r\n    cursor: pointer;\r\n}\r\n\r\n.create-room:hover{\r\n    background-color: #cbeefd;\r\n}\r\n\r\n.home-column input {\r\n    font-size: 24px;\r\n    border-radius: 10px;\r\n    border: none;\r\n    background-color: #cbeefd;\r\n    padding: 5px 10px;\r\n}\r\n\r\n.home-column h2{\r\n    font-size: 50px;\r\n}\r\n\r\n.title{\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.title img{\r\n    max-height: 110px;\r\n}\r\n\r\n.ChooseRoom {\r\n    font-size: 30px;\r\n    max-width: 240px;\r\n    border-radius: 20px;\r\n    color: black;\r\n    background-color: #ffffff;\r\n    border-style: solid;\r\n    margin: 0px auto;\r\n    padding: 5px 20px;\r\n    transition-duration: 0.4s;\r\n    cursor: pointer;\r\n    border-color: #cbeefd;\r\n}\r\n.ChooseRoom:hover{\r\n    background-color: #cbeefd;\r\n}\r\n\r\n.ChooseRoomFull {\r\n    font-size: 30px;\r\n    max-width: 240px;\r\n    border-radius: 20px;\r\n    color: black;\r\n    background-color: #e997ab;\r\n    border-style: solid;\r\n    margin: 0px auto;\r\n    padding: 5px 20px;\r\n    transition-duration: 0.4s;\r\n    cursor: pointer;\r\n    border: none;\r\n}\r\n.ChooseRoomFull:hover{\r\n    background-color: #ffffff;\r\n    border-color: #cbeefd;\r\n}`;\r\n\n\n//# sourceURL=webpack://public/./src/styles.js?");

/***/ }),

/***/ "./src/assets/logo_FMIJS.png":
/*!***********************************!*\
  !*** ./src/assets/logo_FMIJS.png ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"e6545f41718edc006f6a.png\";\n\n//# sourceURL=webpack://public/./src/assets/logo_FMIJS.png?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;