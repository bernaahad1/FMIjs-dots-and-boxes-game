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

/***/ "./src/connectToServer.js":
/*!********************************!*\
  !*** ./src/connectToServer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"onChooseRoom\": () => (/* binding */ onChooseRoom),\n/* harmony export */   \"onLeaveRoom\": () => (/* binding */ onLeaveRoom),\n/* harmony export */   \"socket\": () => (/* binding */ socket)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./src/index.js\");\n\r\n\r\nconst socket = io();\r\n\r\nlet username = \"user 1\";\r\nlet playerIndex = -1;\r\nlet currentRoom = \"\";\r\nlet gameBoard = undefined;\r\n\r\nsocket.emit(\"join server\", username);\r\n\r\nconst onChooseRoom = (event) => {\r\n  const currentRoom = event.target.value;\r\n  console.log(`updated currentRoom to: ${currentRoom}`);\r\n  socket.emit(\"join room\", currentRoom, (r, index) => {\r\n    console.log(r);\r\n    playerIndex = index;\r\n    console.log(`Player ${playerIndex} has connected`);\r\n\r\n    gameBoard = new _index_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard(r.name, r.size, r.players, playerIndex, r.plTurn, r.savedBoxes, r.clickedLines);\r\n    gameBoard.createBoard();\r\n    console.log(gameBoard);\r\n\r\n    document.getElementById(\"home-menu\").className = \"home-row-hidden\";\r\n\r\n    if (playerIndex === -1) {\r\n      //He should only watch, but not play\r\n    }\r\n  });\r\n};\r\n\r\nconst onLeaveRoom = (event) => {\r\n  socket.emit(\"leave room\", () => {\r\n    console.log(`Player ${playerIndex} has disconnected`);\r\n    gameBoard = undefined;\r\n    playerIndex = -1;\r\n\r\n    document.getElementById(\"home-menu\").className = \"home-row\";\r\n    const gameRoom = document.getElementsByClassName(\"game-room\")[0];\r\n    document.getElementsByClassName(\"main-content\")[0].removeChild(gameRoom);\r\n  });\r\n};\r\n\r\nsocket.on(\"new user\", (users) => {\r\n  console.log(\"users change\");\r\n});\r\n\r\nsocket.on(\"user left\", (room) => {\r\n  if (room !== gameBoard.name) {\r\n    return;\r\n  }\r\n  const gameRoom = document.getElementsByClassName(\"game-room\")[0];\r\n  document.getElementsByClassName(\"main-content\")[0].removeChild(gameRoom);\r\n\r\n  //just for now\r\n  gameBoard = new _index_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard(\r\n    gameBoard.name,\r\n    gameBoard.size - 1,\r\n    gameBoard.players,\r\n    playerIndex\r\n  );\r\n  console.log(\"You win\");\r\n});\r\n\r\n//selecting lines\r\nsocket.on(\"selectLine\", (className, initializer) => {\r\n  const myEl = document.getElementsByClassName(className)[0];\r\n  console.log(`Start: ${initializer}; Element to update: ${myEl}`);\r\n  myEl.style.opacity = 100;\r\n  myEl.disabled = true;\r\n\r\n  if (initializer === playerIndex) {\r\n    const result1 = gameBoard.updateBoxState(\r\n      myEl.classList[3],\r\n      \"green\",\r\n      initializer\r\n    );\r\n    const result2 = gameBoard.updateBoxState(\r\n      myEl.classList[4],\r\n      \"green\",\r\n      initializer\r\n    );\r\n\r\n    if (!result1 && !result2) {\r\n      console.log(`other saved turn => ${playerIndex == 0 ? 1 : 0}`);\r\n      socket.emit(\"set turn\", playerIndex == 0 ? 1 : 0);\r\n      gameBoard.onChangePlayTurn(false);\r\n    }\r\n\r\n    return;\r\n  } else {\r\n    const result1 = gameBoard.updateBoxState(\r\n      myEl.classList[3],\r\n      \"red\",\r\n      initializer\r\n    );\r\n    const result2 = gameBoard.updateBoxState(\r\n      myEl.classList[4],\r\n      \"red\",\r\n      initializer\r\n    );\r\n\r\n    if (!result1 && !result2) {\r\n      console.log(\"my turn\");\r\n      gameBoard.onChangePlayTurn(true);\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://public/./src/connectToServer.js?");

/***/ }),

/***/ "./src/home.js":
/*!*********************!*\
  !*** ./src/home.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createHome\": () => (/* binding */ createHome)\n/* harmony export */ });\n/* harmony import */ var _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connectToServer.js */ \"./src/connectToServer.js\");\n/* harmony import */ var _assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/logo_FMIJS.png */ \"./src/assets/logo_FMIJS.png\");\n\r\n\r\n\r\nlet rooms = new Map();\r\nlet newRoomName = \"\";\r\nlet newRoomSize = 0;\r\n\r\n_connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"new room\", (r) => {\r\n  rooms = new Map(r);\r\n  generateAllExitingRooms();\r\n});\r\n_connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"fetch rooms\", (r) => {\r\n  rooms = new Map(r);\r\n  generateAllExitingRooms();\r\n});\r\n\r\n_connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"update room\", (room) => {\r\n  updateRoomButton(room);\r\n});\r\n\r\nconst onCreateRoom = (\r\n  e,\r\n  roomName = \"defauty\",\r\n  numPlayers = 2,\r\n  gridSize = 4\r\n) => {\r\n  console.log(`${newRoomName} and ${newRoomSize}`);\r\n  if (newRoomName === \"\") {\r\n    alert(\"Add name\");\r\n    return;\r\n  }\r\n  if (newRoomSize < 4 || newRoomSize > 10 || Number(newRoomSize) === NaN) {\r\n    alert(\"Wrong grid size!!!\");\r\n    return;\r\n  }\r\n  _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"create room\", newRoomName, newRoomSize, 2);\r\n  //createRoomButton(roomName, numPlayers,0,\"waiting\");\r\n};\r\n\r\nconst createRoomButton = (roomName, numPlayers, playersConnected, _state) => {\r\n  const allRooms = document.getElementById(\"home-all-rooms\");\r\n  let button = document.createElement(\"button\");\r\n  button.className = \"ChooseRoom\";\r\n  button.id = `${roomName}`;\r\n  button.value = `${roomName}`;\r\n\r\n  if (numPlayers === playersConnected) {\r\n    button.className = \"ChooseRoomFull\";\r\n  } else {\r\n    button.className = \"ChooseRoom\";\r\n  }\r\n\r\n  button.innerHTML += `${roomName} ${playersConnected}/${numPlayers} ${_state}`;\r\n  allRooms.appendChild(button);\r\n};\r\n\r\nconst updateRoomButton = (room) => {\r\n  const button = document.getElementById(`${room.name}`);\r\n  const numPlayers = room.players.length;\r\n  let connected = room.connected;\r\n  const state = numPlayers === connected ? \"playing\" : \"pending\";\r\n\r\n  button.innerHTML = button.innerHTML.replace(/ [0-9]*?\\//, ` ${connected}/`);\r\n  button.innerHTML = button.innerHTML.replace(/ [a-z]*?$/, ` ${state}`);\r\n\r\n  console.log(`${numPlayers} ${connected}`);\r\n  if (numPlayers === connected) {\r\n    button.className = \"ChooseRoomFull\";\r\n  } else {\r\n    button.className = \"ChooseRoom\";\r\n  }\r\n};\r\n\r\nconst generateAllExitingRooms = () => {\r\n  document.getElementById(\"home-all-rooms\").innerHTML = ``;\r\n\r\n  const allRooms = Array.from(rooms.values());\r\n  allRooms.forEach((r) => {\r\n    let connected = 0;\r\n    r.players.forEach((p) => {\r\n      if (p !== null) {\r\n        connected++;\r\n      }\r\n    });\r\n    createRoomButton(\r\n      r.name,\r\n      r.players.length,\r\n      connected,\r\n      connected === r.players.length ? \"ready\" : \"waiting\"\r\n    );\r\n  });\r\n\r\n  let roomButtons = document.getElementsByClassName(\"ChooseRoom\");\r\n  console.log(roomButtons);\r\n  for (let i = 0; i < roomButtons.length; i++) {\r\n    roomButtons[i].addEventListener(\"click\", _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.onChooseRoom);\r\n  }\r\n\r\n  roomButtons = document.getElementsByClassName(\"ChooseRoomFull\");\r\n  for (let i = 0; i < roomButtons.length; i++) {\r\n    roomButtons[i].addEventListener(\"click\", _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.onChooseRoom);\r\n  }\r\n};\r\n\r\nconst changeRoomInput = (e) => {\r\n  console.log(e.target.value);\r\n  newRoomName = e.target.value;\r\n};\r\nconst changeSizeInput = (e) => {\r\n  newRoomSize = e.target.value;\r\n};\r\n\r\nconst createHome = () => {\r\n  const mainConatiner = document.getElementsByClassName(\"main-content\")[0];\r\n\r\n  const row = document.createElement(\"div\");\r\n  row.className = \"home-row\";\r\n  row.id = \"home-menu\";\r\n  const column1 = document.createElement(\"div\");\r\n  column1.className = \"home-column\";\r\n  const column2 = document.createElement(\"div\");\r\n  column2.className = \"home-column\";\r\n\r\n  //create room colum\r\n  const title = document.createElement(\"div\");\r\n  title.className = \"title\";\r\n  title.innerHTML += `<img src=\"${_assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_1__}\" alt=\"Dots and Boxes\" />`;\r\n\r\n  column1.appendChild(title);\r\n  column1.innerHTML += `<button class=\"create-room\">Create Room</button>`;\r\n  column1.innerHTML += `<input type=\"text\" id=\"IRoomName\" placeholder=\"Room name\" maxlength=\"10\" required>`;\r\n  // column1.innerHTML += `<input type=\"number\" id=\"INumPlayers\" placeholder=\"Number players(2-4)\" required>`;\r\n  column1.innerHTML += `<input type=\"number\" id=\"IGridSize\" placeholder=\"Grid size(4-10)\" min=\"4\" max=\"10\" required>`;\r\n\r\n  //all rooms colum\r\n  column2.innerHTML += `<h2>All Rooms</h2>`;\r\n  const buttonsBox = document.createElement(\"div\");\r\n  buttonsBox.id = \"home-all-rooms\";\r\n  buttonsBox.className = \"home-column\";\r\n  column2.appendChild(buttonsBox);\r\n\r\n  //add elements to HTML\r\n  row.appendChild(column1);\r\n  row.appendChild(column2);\r\n  mainConatiner.appendChild(row);\r\n\r\n  mainConatiner\r\n    .getElementsByClassName(\"create-room\")[0]\r\n    .addEventListener(\"click\", onCreateRoom);\r\n  document\r\n    .getElementById(\"IRoomName\")\r\n    .addEventListener(\"change\", changeRoomInput);\r\n  document\r\n    .getElementById(\"IGridSize\")\r\n    .addEventListener(\"change\", changeSizeInput);\r\n\r\n  generateAllExitingRooms();\r\n};\r\n\r\n// createHome();\r\n\n\n//# sourceURL=webpack://public/./src/home.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameBoard\": () => (/* binding */ GameBoard),\n/* harmony export */   \"board\": () => (/* binding */ board),\n/* harmony export */   \"generateBoxes\": () => (/* binding */ generateBoxes),\n/* harmony export */   \"mainConatiner\": () => (/* binding */ mainConatiner)\n/* harmony export */ });\n/* harmony import */ var _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connectToServer.js */ \"./src/connectToServer.js\");\n/* harmony import */ var _home_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home.js */ \"./src/home.js\");\n/* harmony import */ var _assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/logo_FMIJS.png */ \"./src/assets/logo_FMIJS.png\");\n/* harmony import */ var _gameRoom_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameRoom.css */ \"./src/gameRoom.css\");\n/* harmony import */ var _home_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home.css */ \"./src/home.css\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// TODO BERNA please make the code more understandable\r\n\r\nconst board = document.getElementsByClassName(\"game-board\")[0];\r\nconst mainConatiner = document.getElementsByClassName(\"main-content\")[0];\r\n\r\nconst generateBoxes = (size) => {\r\n  const bx = new Map();\r\n  for (let i = 0; i < size; i++) {\r\n    for (let j = 0; j < size; j++) {\r\n      bx.set(`${i}${j}`, { score: 0, owner: -1 });\r\n    }\r\n  }\r\n  return bx;\r\n};\r\n\r\nclass GameBoard {\r\n  constructor(\r\n    name,\r\n    size,\r\n    players,\r\n    playerIndex,\r\n    plTurn,\r\n    savedBoxes,\r\n    clickedLines\r\n  ) {\r\n    this.name = name;\r\n    this.size = parseInt(size) + 1;\r\n    this.players = players;\r\n    this.playerScores = players.map((el) => 0);\r\n    this.boxes =\r\n      savedBoxes === \"\"\r\n        ? generateBoxes(parseInt(size) + 1)\r\n        : new Map(savedBoxes);\r\n    this.playerIndex = playerIndex;\r\n    this.savedBoxes = savedBoxes;\r\n    this.plTurn = plTurn;\r\n    this.clickedLines = clickedLines || [];\r\n\r\n    if (savedBoxes !== \"\") {\r\n      this.boxes.forEach((val, key) => {\r\n        if (val.owner !== -1) {\r\n          this.playerScores[val.owner]++;\r\n        }\r\n      });\r\n    }\r\n  }\r\n\r\n  createScoreTable() {\r\n    return ``;\r\n  }\r\n\r\n  createBoard() {\r\n    const gameRoom = document.createElement(\"section\");\r\n    gameRoom.className = \"game-room\";\r\n\r\n    const gameBoard = document.createElement(\"section\");\r\n    gameBoard.className = \"game-board\";\r\n\r\n    for (let i = 0; i < this.size; i++) {\r\n      const section = document.createElement(\"section\");\r\n      section.className = \"row\";\r\n\r\n      for (let j = 0; j < this.size; j++) {\r\n        const box = document.createElement(\"div\");\r\n        box.className = \"box\";\r\n        box.id = `${i}${j}`;\r\n\r\n        box.innerHTML += `<div class=\"dot top-left\"></div>`;\r\n\r\n        //Do not render top line if box is from last coll\r\n        if (j < this.size - 1) {\r\n          box.innerHTML += `<button class=\"line horizontal top ${i - 1}${j} \r\n          ${i}${j}\"></button>`;\r\n        }\r\n\r\n        //Do not render left line if box is from last row\r\n        if (i < this.size - 1) {\r\n          box.innerHTML += `<button class=\"line vertical left ${i}${j - 1} \r\n          ${i}${j}\"></button>`;\r\n        }\r\n\r\n        section.appendChild(box);\r\n      }\r\n\r\n      gameBoard.appendChild(section);\r\n    }\r\n\r\n    let opponentIndex = this.playerIndex == 1 ? 0 : 1;\r\n    let gameState =\r\n      this.playerIndex == this.plTurn\r\n        ? \"Your turn\"\r\n        : \"Waiting for opponent to play\";\r\n\r\n    if (this.playerIndex === -1) {\r\n      opponentIndex = -1;\r\n      gameState = \"You can only watch\";\r\n    }\r\n\r\n    //render header\r\n    gameRoom.innerHTML += `<div class=\"room title header\">\r\n      <button class=\"create-room exit-room\">Exit game</button>\r\n          <img src=\"${_assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_2__}\" alt=\"Dots and Boxes\"></img>\r\n      </div>\r\n      <div class=\"game-state\"><h1 class=\"game-state-turn\">${gameState}</h1></div>`;\r\n\r\n    //render scores\r\n    if (this.playerIndex === -1) {\r\n      gameRoom.innerHTML += `<div class=\"players\">\r\n          <h1 class=\"my-score\">Player 1: <span class=\"my-score player-0\">${this.playerScores[0]}</span></h1>\r\n          <h1>Player 2: <span class=\"opponent-sore player-1\">${this.playerScores[1]}</span></h1>\r\n        </div>`;\r\n    } else {\r\n      gameRoom.innerHTML += `<div class=\"players\">\r\n          <h1 class=\"my-score\">Your score: <span class=\"my-score player-${\r\n            this.playerIndex\r\n          }\">${this.playerScores[this.playerIndex]}</span></h1>\r\n          <h1>Opponent score: <span class=\"opponent-sore player-${opponentIndex}\">${\r\n        this.playerScores[opponentIndex]\r\n      }</span></h1>\r\n        </div>`;\r\n    }\r\n    gameRoom.appendChild(gameBoard);\r\n    gameRoom.innerHTML += `<h1 class=\"center\">Room: ${this.name}</h1>`;\r\n\r\n    const disableDiv = document.createElement(\"div\");\r\n    disableDiv.className = \"overlay-disable\";\r\n\r\n    if (this.playerIndex == this.plTurn) {\r\n      disableDiv.className += \" hidden\";\r\n    }\r\n    gameRoom.appendChild(disableDiv);\r\n    mainConatiner.appendChild(gameRoom);\r\n\r\n    const lines = [...document.querySelectorAll(\"button.line\")];\r\n    lines.forEach((el) => el.addEventListener(\"click\", this.onLineClick));\r\n\r\n    document\r\n      .getElementsByClassName(\"exit-room\")[0]\r\n      .addEventListener(\"click\", _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.onLeaveRoom);\r\n\r\n    //load clicked elements\r\n    this.clickedLines.forEach((cl) => {\r\n      const myEl = document.getElementsByClassName(cl)[0];\r\n      myEl.style.opacity = 100;\r\n      myEl.disabled = true;\r\n    });\r\n\r\n    //load scored boxes\r\n  }\r\n\r\n  updateBoxState(id, color, playerIndex) {\r\n    if (this.boxes.get(id) === undefined) {\r\n      this.boxes.set(id, { score: NaN, owner: -1 });\r\n    } else this.boxes.get(id).score++;\r\n\r\n    console.log(this.boxes);\r\n    _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"save boxes\", this.name, Array.from(this.boxes));\r\n    if (this.boxes.get(id).score >= 4) {\r\n      document.getElementById(`${id}`).style.backgroundColor = color;\r\n      this.boxes.get(id).owner = playerIndex;\r\n      this.onScoreUpdate(playerIndex);\r\n      return true;\r\n      // document.getElementById(\r\n      //   `${id}`\r\n      // ).innerHTML += `<h1 class=\"winnerText\">B<h1>`;\r\n    }\r\n    return false;\r\n  }\r\n\r\n  onLineClick(event) {\r\n    _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"selectLine\", event.target.className, this.playerIndex);\r\n  }\r\n\r\n  onScoreUpdate(index) {\r\n    this.playerScores[index] += 1;\r\n    const myEl = document.getElementsByClassName(`player-${index}`)[0];\r\n    myEl.innerHTML = this.playerScores[index];\r\n  }\r\n\r\n  onChangePlayTurn(myTurn) {\r\n    const disableDiv = document.getElementsByClassName(\"overlay-disable\")[0];\r\n\r\n    if (myTurn && this.playerIndex !== -1) {\r\n      document.getElementsByClassName(\"game-state-turn\")[0].innerHTML =\r\n        \"Your turn\";\r\n      disableDiv.className = \"overlay-disable hidden\";\r\n    } else if (this.playerIndex !== -1) {\r\n      document.getElementsByClassName(\"game-state-turn\")[0].innerHTML =\r\n        \"Waiting for opponent to play\";\r\n      disableDiv.className = \"overlay-disable\";\r\n    }\r\n  }\r\n}\r\n\r\n(0,_home_js__WEBPACK_IMPORTED_MODULE_1__.createHome)();\r\n\n\n//# sourceURL=webpack://public/./src/index.js?");

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
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;