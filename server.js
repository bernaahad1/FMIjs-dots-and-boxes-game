const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

//app.use(express.static("public/dist"));
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Handle socket connection
let users = []; //{username, ownedGames = [], id}
const rooms = new Map(); //{owner, name, gridSize, players:[,], plTurn:1, savedBoxes:[], gameWinnerId}

io.on("connection", (socket) => {
  console.log(`New WS Connection. Connection id: ${socket.id}`);
  let playerIndex = -1;
  let currentRoom = "";

  const clearPlayerGame = () => {
    const connectedRooms = Array.from(socket.rooms);
    if (connectedRooms.length == 1) return;
    const room = connectedRooms.pop();
    if (playerIndex !== -1) {
      rooms.get(room).players[playerIndex] = null;
      rooms.get(room).connected--;
      rooms.get(room).gameWinnerId = playerIndex === 0 ? 1 : 0;
      io.emit("update room", rooms.get(room));

      // Todo fix but works
      let room3 = rooms.get(room);

      if (
        room3.players &&
        room3.players[0] === null &&
        room3.players[1] === null &&
        rooms.get(room).connected === 0
      ) {
        room3.savedBoxes = "";
        room3.gameWinnerId = -1;
        room3.clickedLines = [];
        room3.linesClassName = [];
        room3.clickedFrom = [];
        room3.plTurn = 0;
        room3.connected = 0;
      }
    }
    socket.leave(room);
    playerIndex = -1;
    currentRoom = "";
  };

  socket.on("join server", (username) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit("new user", users);
    socket.emit("fetch rooms", Array.from(rooms));
  });

  socket.on("disconnecting", () => {
    clearPlayerGame();
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    console.log("user disconected");
    io.emit("new user", users); // this will be emitted to all
    //this is when the user leave
    //it should remove him from users
    //and to emit "delete room"
  });

  socket.on("join room", (roomName, cb) => {
    clearPlayerGame();
    if (rooms.get(roomName).gameWinnerId > -1) {
      return;
    }
    socket.join(roomName);
    currentRoom = roomName;
    const players = rooms.get(roomName).players;
    for (const i in players) {
      if (players[i] === null) {
        playerIndex = i;
        rooms.get(roomName).players[i] = true;
        rooms.get(roomName).connected++;
        io.emit("update room", rooms.get(roomName));
        break;
      }
    }
    cb(rooms.get(roomName), playerIndex);
  });

  socket.on("leave room", (cb) => {
    //you can leave the room
    clearPlayerGame();
    cb();
  });

  socket.on("create room", (roomName, gridSize, playerNum) => {
    if (rooms.get(roomName)) {
      return;
    }

    const room = {
      owner: socket.id,
      name: roomName,
      size: gridSize,
      players: [],
      savedBoxes: "",
      plTurn: 0,
      connected: 0,
      clickedLines: [],
      linesClassName: [],
      clickedFrom: [],
      // -1 no one 0 and 1 are ids and 2 means that both are winners
      gameWinnerId: -1,
    };

    for (let i = 0; i < playerNum; i++) {
      room.players.push(null);
    }
    rooms.set(roomName, room);
    io.emit("new room", Array.from(rooms));
  });

  socket.on("fetchCurrentRoomState", (roomName, cb) => {
    cb(rooms.get(roomName));
  });

  socket.on("delete room", () => {
    //you can delete it only if you are the user
    //or it should delete them if the user disconects

    io.emit("new room", rooms);
  });

  socket.on("selectLine", (className, id, initializer) => {
    console.log(
      `Select from player ${playerIndex} in room ${currentRoom} with target ${className}`
    );

    rooms.get(currentRoom).clickedLines.push(id);
    rooms.get(currentRoom).clickedFrom.push(playerIndex);
    rooms.get(currentRoom).linesClassName.push(className);

    io.to(currentRoom).emit("selectLine", className, id, playerIndex);
  });

  socket.on("save boxes", (roomName, boxes) => {
    rooms.get(roomName).savedBoxes = boxes;
  });

  socket.on("set turn", (turn) => {
    rooms.get(currentRoom).plTurn = turn;
  });

  socket.on("user left", (roomName, playerLeftId) => {
    console.log("user left server", roomName, playerLeftId);
    io.to(roomName).emit("user left", roomName, playerLeftId);
  });

  socket.on("winner", (roomName, winnerId) => {
    console.log("Winner is", roomName, winnerId);
    rooms.get(currentRoom).gameWinnerId = winnerId;
  });

  socket.on("start-packman", (lines, boxes) => {
    io.to(currentRoom).emit("start-packman", lines, boxes);
  });
});
