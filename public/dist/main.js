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

/***/ "./src/connectToServer.js":
/*!********************************!*\
  !*** ./src/connectToServer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"onChooseRoom\": () => (/* binding */ onChooseRoom),\n/* harmony export */   \"onLeaveRoom\": () => (/* binding */ onLeaveRoom),\n/* harmony export */   \"socket\": () => (/* binding */ socket)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./src/index.js\");\n\n\nconst socket = io();\n\nlet username = \"user 1\";\nlet playerIndex = -1;\nlet currentRoom = \"\";\nlet gameBoard = undefined;\n\nsocket.emit(\"join server\", username);\n\nconst onChooseRoom = (event) => {\n  const currentRoom = event.target.value;\n  console.log(`updated currentRoom to: ${currentRoom}`);\n  socket.emit(\"join room\", currentRoom, (r, index) => {\n    console.log(r);\n    playerIndex = index;\n    console.log(`Player ${playerIndex} has connected`);\n\n    gameBoard = new _index_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard(r.name, r.size, r.players, playerIndex, r.plTurn, r.savedBoxes, r.clickedLines);\n    gameBoard.createBoard();\n    console.log(gameBoard);\n\n    document.getElementById(\"home-menu\").className = \"home-row-hidden\";\n\n    if (playerIndex === -1) {\n      //He should only watch, but not play\n    }\n  });\n};\n\nconst onLeaveRoom = (event) => {\n  socket.emit(\"leave room\", () => {\n    console.log(`Player ${playerIndex} has disconnected`);\n    gameBoard = undefined;\n    playerIndex = -1;\n\n    document.getElementById(\"home-menu\").className = \"home-row\";\n    const gameRoom = document.getElementsByClassName(\"game-room\")[0];\n    document.getElementsByClassName(\"main-content\")[0].removeChild(gameRoom);\n  });\n};\n\nsocket.on(\"new user\", (users) => {\n  console.log(\"users change\");\n});\n\nsocket.on(\"user left\", (room) => {\n  if (room !== gameBoard.name) {\n    return;\n  }\n  const gameRoom = document.getElementsByClassName(\"game-room\")[0];\n  document.getElementsByClassName(\"main-content\")[0].removeChild(gameRoom);\n\n  //just for now\n  gameBoard = new _index_js__WEBPACK_IMPORTED_MODULE_0__.GameBoard(\n    gameBoard.name,\n    gameBoard.size - 1,\n    gameBoard.players,\n    playerIndex\n  );\n  console.log(\"You win\");\n});\n\n//selecting lines\nsocket.on(\"selectLine\", (className, initializer) => {\n  const myEl = document.getElementsByClassName(className)[0];\n  console.log(`Start: ${initializer}; Element to update: ${myEl}`);\n  myEl.style.opacity = 100;\n  myEl.disabled = true;\n\n  if (initializer === playerIndex) {\n    const result1 = gameBoard.updateBoxState(\n      myEl.classList[3],\n      \"green\",\n      initializer\n    );\n    const result2 = gameBoard.updateBoxState(\n      myEl.classList[4],\n      \"green\",\n      initializer\n    );\n\n    if (!result1 && !result2) {\n      console.log(`other saved turn => ${playerIndex == 0 ? 1 : 0}`);\n      socket.emit(\"set turn\", playerIndex == 0 ? 1 : 0);\n      gameBoard.onChangePlayTurn(false);\n    }\n\n    return;\n  } else {\n    const result1 = gameBoard.updateBoxState(\n      myEl.classList[3],\n      \"red\",\n      initializer\n    );\n    const result2 = gameBoard.updateBoxState(\n      myEl.classList[4],\n      \"red\",\n      initializer\n    );\n\n    if (!result1 && !result2) {\n      console.log(\"my turn\");\n      gameBoard.onChangePlayTurn(true);\n    }\n  }\n});\n\n\n//# sourceURL=webpack://public/./src/connectToServer.js?");

/***/ }),

/***/ "./src/home.js":
/*!*********************!*\
  !*** ./src/home.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createHome\": () => (/* binding */ createHome)\n/* harmony export */ });\n/* harmony import */ var _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connectToServer.js */ \"./src/connectToServer.js\");\n/* harmony import */ var _assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/logo_FMIJS.png */ \"./src/assets/logo_FMIJS.png\");\n\n\n\nlet rooms = new Map();\nlet newRoomName = \"\";\nlet newRoomSize = 0;\n\n_connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"new room\", (r) => {\n  rooms = new Map(r);\n  generateAllExitingRooms();\n});\n_connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"fetch rooms\", (r) => {\n  rooms = new Map(r);\n  generateAllExitingRooms();\n});\n\n_connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.on(\"update room\", (room) => {\n  updateRoomButton(room);\n});\n\nconst onCreateRoom = (\n  e,\n  roomName = \"defauty\",\n  numPlayers = 2,\n  gridSize = 4\n) => {\n  console.log(`${newRoomName} and ${newRoomSize}`);\n  if (newRoomName === \"\") {\n    alert(\"Add name\");\n    return;\n  }\n  if (newRoomSize < 4 || newRoomSize > 10 || Number(newRoomSize) === NaN) {\n    alert(\"Wrong grid size!!!\");\n    return;\n  }\n  _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"create room\", newRoomName, newRoomSize, 2);\n  //createRoomButton(roomName, numPlayers,0,\"waiting\");\n};\n\nconst createRoomButton = (roomName, numPlayers, playersConnected, _state) => {\n  const allRooms = document.getElementById(\"home-all-rooms\");\n  let button = document.createElement(\"button\");\n  button.className = \"ChooseRoom\";\n  button.id = `${roomName}`;\n  button.value = `${roomName}`;\n\n  if (numPlayers === playersConnected) {\n    button.className = \"ChooseRoomFull\";\n  } else {\n    button.className = \"ChooseRoom\";\n  }\n\n  button.innerHTML += `${roomName} ${playersConnected}/${numPlayers} ${_state}`;\n  allRooms.appendChild(button);\n};\n\nconst updateRoomButton = (room) => {\n  const button = document.getElementById(`${room.name}`);\n  const numPlayers = room.players.length;\n  let connected = room.connected;\n  const state = numPlayers === connected ? \"playing\" : \"pending\";\n\n  button.innerHTML = button.innerHTML.replace(/ [0-9]*?\\//, ` ${connected}/`);\n  button.innerHTML = button.innerHTML.replace(/ [a-z]*?$/, ` ${state}`);\n\n  console.log(`${numPlayers} ${connected}`);\n  if (numPlayers === connected) {\n    button.className = \"ChooseRoomFull\";\n  } else {\n    button.className = \"ChooseRoom\";\n  }\n};\n\nconst generateAllExitingRooms = () => {\n  document.getElementById(\"home-all-rooms\").innerHTML = ``;\n\n  const allRooms = Array.from(rooms.values());\n  allRooms.forEach((r) => {\n    let connected = 0;\n    r.players.forEach((p) => {\n      if (p !== null) {\n        connected++;\n      }\n    });\n    createRoomButton(\n      r.name,\n      r.players.length,\n      connected,\n      connected === r.players.length ? \"ready\" : \"waiting\"\n    );\n  });\n\n  let roomButtons = document.getElementsByClassName(\"ChooseRoom\");\n  console.log(roomButtons);\n  for (let i = 0; i < roomButtons.length; i++) {\n    roomButtons[i].addEventListener(\"click\", _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.onChooseRoom);\n  }\n\n  roomButtons = document.getElementsByClassName(\"ChooseRoomFull\");\n  for (let i = 0; i < roomButtons.length; i++) {\n    roomButtons[i].addEventListener(\"click\", _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.onChooseRoom);\n  }\n};\n\nconst changeRoomInput = (e) => {\n  console.log(e.target.value);\n  newRoomName = e.target.value;\n};\nconst changeSizeInput = (e) => {\n  newRoomSize = e.target.value;\n};\n\nconst createHome = () => {\n  const mainConatiner = document.getElementsByClassName(\"main-content\")[0];\n\n  const row = document.createElement(\"div\");\n  row.className = \"home-row\";\n  row.id = \"home-menu\";\n  const column1 = document.createElement(\"div\");\n  column1.className = \"home-column\";\n  const column2 = document.createElement(\"div\");\n  column2.className = \"home-column\";\n\n  //create room colum\n  const title = document.createElement(\"div\");\n  title.className = \"title\";\n  title.innerHTML += `<img src=\"${_assets_logo_FMIJS_png__WEBPACK_IMPORTED_MODULE_1__}\" alt=\"Dots and Boxes\" />`;\n\n  column1.appendChild(title);\n  column1.innerHTML += `<button class=\"create-room\">Create Room</button>`;\n  column1.innerHTML += `<input type=\"text\" id=\"IRoomName\" placeholder=\"Room name\" maxlength=\"10\" required>`;\n  // column1.innerHTML += `<input type=\"number\" id=\"INumPlayers\" placeholder=\"Number players(2-4)\" required>`;\n  column1.innerHTML += `<input type=\"number\" id=\"IGridSize\" placeholder=\"Grid size(4-10)\" min=\"4\" max=\"10\" required>`;\n\n  //all rooms colum\n  column2.innerHTML += `<h2>All Rooms</h2>`;\n  const buttonsBox = document.createElement(\"div\");\n  buttonsBox.id = \"home-all-rooms\";\n  buttonsBox.className = \"home-column\";\n  column2.appendChild(buttonsBox);\n\n  //add elements to HTML\n  row.appendChild(column1);\n  row.appendChild(column2);\n  mainConatiner.appendChild(row);\n\n  mainConatiner\n    .getElementsByClassName(\"create-room\")[0]\n    .addEventListener(\"click\", onCreateRoom);\n  document\n    .getElementById(\"IRoomName\")\n    .addEventListener(\"change\", changeRoomInput);\n  document\n    .getElementById(\"IGridSize\")\n    .addEventListener(\"change\", changeSizeInput);\n\n  generateAllExitingRooms();\n};\n\n// createHome();\n\n\n//# sourceURL=webpack://public/./src/home.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameBoard\": () => (/* binding */ GameBoard),\n/* harmony export */   \"board\": () => (/* binding */ board),\n/* harmony export */   \"generateBoxes\": () => (/* binding */ generateBoxes),\n/* harmony export */   \"mainConatiner\": () => (/* binding */ mainConatiner)\n/* harmony export */ });\n/* harmony import */ var _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connectToServer.js */ \"./src/connectToServer.js\");\n/* harmony import */ var _home_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home.js */ \"./src/home.js\");\n\n\n// import \"./gameRoom.css\";\n// import \"./home.css\";\n\n// TODO BERNA please make the code more understandable\n\nconst board = document.getElementsByClassName(\"game-board\")[0];\nconst mainConatiner = document.getElementsByClassName(\"main-content\")[0];\n\nconst generateBoxes = (size) => {\n  const bx = new Map();\n  for (let i = 0; i < size; i++) {\n    for (let j = 0; j < size; j++) {\n      bx.set(`${i}${j}`, { score: 0, owner: -1 });\n    }\n  }\n  return bx;\n};\n\nclass GameBoard {\n  constructor(\n    name,\n    size,\n    players,\n    playerIndex,\n    plTurn,\n    savedBoxes,\n    clickedLines\n  ) {\n    this.name = name;\n    this.size = parseInt(size) + 1;\n    this.players = players;\n    this.playerScores = players.map((el) => 0);\n    this.boxes =\n      savedBoxes === \"\"\n        ? generateBoxes(parseInt(size) + 1)\n        : new Map(savedBoxes);\n    this.playerIndex = playerIndex;\n    this.savedBoxes = savedBoxes;\n    this.plTurn = plTurn;\n    this.clickedLines = clickedLines || [];\n\n    if (savedBoxes !== \"\") {\n      this.boxes.forEach((val, key) => {\n        if (val.owner !== -1) {\n          this.playerScores[val.owner]++;\n        }\n      });\n    }\n  }\n\n  createScoreTable() {\n    return ``;\n  }\n\n  createBoard() {\n    const gameRoom = document.createElement(\"section\");\n    gameRoom.className = \"game-room\";\n\n    const gameBoard = document.createElement(\"section\");\n    gameBoard.className = \"game-board\";\n\n    for (let i = 0; i < this.size; i++) {\n      const section = document.createElement(\"section\");\n      section.className = \"row\";\n\n      for (let j = 0; j < this.size; j++) {\n        const box = document.createElement(\"div\");\n        box.className = \"box\";\n        box.id = `${i}${j}`;\n\n        box.innerHTML += `<div class=\"dot top-left\"></div>`;\n\n        //Do not render top line if box is from last coll\n        if (j < this.size - 1) {\n          box.innerHTML += `<button class=\"line horizontal top ${i - 1}${j} \n          ${i}${j}\"></button>`;\n        }\n\n        //Do not render left line if box is from last row\n        if (i < this.size - 1) {\n          box.innerHTML += `<button class=\"line vertical left ${i}${j - 1} \n          ${i}${j}\"></button>`;\n        }\n\n        section.appendChild(box);\n      }\n\n      gameBoard.appendChild(section);\n    }\n\n    let opponentIndex = this.playerIndex == 1 ? 0 : 1;\n    let gameState =\n      this.playerIndex == this.plTurn\n        ? \"Your turn\"\n        : \"Waiting for opponent to play\";\n\n    if (this.playerIndex === -1) {\n      opponentIndex = -1;\n      gameState = \"You can only watch\";\n    }\n\n    //render header\n    gameRoom.innerHTML += `<div class=\"room title header\">\n      <button class=\"create-room exit-room\">Exit game</button>\n          <img src=\"./logo_FMIJS.png\" alt=\"Dots and Boxes\"></img>\n      </div>\n      <div class=\"game-state\"><h1 class=\"game-state-turn\">${gameState}</h1></div>`;\n\n    //render scores\n    if (this.playerIndex === -1) {\n      gameRoom.innerHTML += `<div class=\"players\">\n          <h1 class=\"my-score\">Player 1: <span class=\"my-score player-0\">${this.playerScores[0]}</span></h1>\n          <h1>Player 2: <span class=\"opponent-sore player-1\">${this.playerScores[1]}</span></h1>\n        </div>`;\n    } else {\n      gameRoom.innerHTML += `<div class=\"players\">\n          <h1 class=\"my-score\">Your score: <span class=\"my-score player-${\n            this.playerIndex\n          }\">${this.playerScores[this.playerIndex]}</span></h1>\n          <h1>Opponent score: <span class=\"opponent-sore player-${opponentIndex}\">${\n        this.playerScores[opponentIndex]\n      }</span></h1>\n        </div>`;\n    }\n    gameRoom.appendChild(gameBoard);\n    gameRoom.innerHTML += `<h1 class=\"center\">Room: ${this.name}</h1>`;\n\n    const disableDiv = document.createElement(\"div\");\n    disableDiv.className = \"overlay-disable\";\n\n    if (this.playerIndex == this.plTurn) {\n      disableDiv.className += \" hidden\";\n    }\n    gameRoom.appendChild(disableDiv);\n    mainConatiner.appendChild(gameRoom);\n\n    const lines = [...document.querySelectorAll(\"button.line\")];\n    lines.forEach((el) => el.addEventListener(\"click\", this.onLineClick));\n\n    document\n      .getElementsByClassName(\"exit-room\")[0]\n      .addEventListener(\"click\", _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.onLeaveRoom);\n\n    //load clicked elements\n    this.clickedLines.forEach((cl) => {\n      const myEl = document.getElementsByClassName(cl)[0];\n      myEl.style.opacity = 100;\n      myEl.disabled = true;\n    });\n\n    //load scored boxes\n  }\n\n  updateBoxState(id, color, playerIndex) {\n    if (this.boxes.get(id) === undefined) {\n      this.boxes.set(id, { score: NaN, owner: -1 });\n    } else this.boxes.get(id).score++;\n\n    console.log(this.boxes);\n    _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"save boxes\", this.name, Array.from(this.boxes));\n    if (this.boxes.get(id).score >= 4) {\n      document.getElementById(`${id}`).style.backgroundColor = color;\n      this.boxes.get(id).owner = playerIndex;\n      this.onScoreUpdate(playerIndex);\n      return true;\n      // document.getElementById(\n      //   `${id}`\n      // ).innerHTML += `<h1 class=\"winnerText\">B<h1>`;\n    }\n    return false;\n  }\n\n  onLineClick(event) {\n    _connectToServer_js__WEBPACK_IMPORTED_MODULE_0__.socket.emit(\"selectLine\", event.target.className, this.playerIndex);\n  }\n\n  onScoreUpdate(index) {\n    this.playerScores[index] += 1;\n    const myEl = document.getElementsByClassName(`player-${index}`)[0];\n    myEl.innerHTML = this.playerScores[index];\n  }\n\n  onChangePlayTurn(myTurn) {\n    const disableDiv = document.getElementsByClassName(\"overlay-disable\")[0];\n\n    if (myTurn && this.playerIndex !== -1) {\n      document.getElementsByClassName(\"game-state-turn\")[0].innerHTML =\n        \"Your turn\";\n      disableDiv.className = \"overlay-disable hidden\";\n    } else if (this.playerIndex !== -1) {\n      document.getElementsByClassName(\"game-state-turn\")[0].innerHTML =\n        \"Waiting for opponent to play\";\n      disableDiv.className = \"overlay-disable\";\n    }\n  }\n}\n\n(0,_home_js__WEBPACK_IMPORTED_MODULE_1__.createHome)();\n\n\n//# sourceURL=webpack://public/./src/index.js?");

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