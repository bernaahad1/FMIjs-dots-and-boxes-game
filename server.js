const express = require("express");
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 3000;
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
server.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Handle socket connection
let users = []; //{username, ownedGames = [], id}
const rooms = new Map(); //{owner, name, gridSize, players:[,]}

io.on("connection", (socket) => {
  console.log(`New WS Connection. Connection id: ${socket.id}`);
  let playerIndex = -1;
  let currentRoom = "";

  const clearPlayerGame = () => {
    const connectedRooms = Array.from(socket.rooms);
    console.log(connectedRooms);
    if (connectedRooms.length == 1) return;
    const room = connectedRooms.pop();
    rooms.get(room).players[playerIndex] = null;
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
    console.log(`from join server: ${rooms}`);
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
    socket.join(roomName);
    currentRoom = roomName;
    console.log(socket.rooms);
    const players = rooms.get(roomName).players;
    io.emit("update room", roomName, true);
    for (const i in players) {
      if (players[i] === null) {
        playerIndex = i;
        rooms.get(roomName).players[i] = true;
        break;
      }
    }
    cb(rooms.get(roomName), playerIndex);
  });

  socket.on("leave room", (cb) => {
    //you can leave the room
    console.log(socket.rooms);
    const players = rooms.get(currentRoom).players;
    if (players[playerIndex] !== null) {
      rooms.get(currentRoom).players[playerIndex] = null;
    }

    socket.leave(currentRoom);
    io.emit("update room", currentRoom, false);
    cb(rooms.get(currentRoom));
    playerIndex = -1;
    currentRoom = "";
    clearPlayerGame();
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
    };

    for (let i = 0; i < playerNum; i++) {
      room.players.push(null);
    }
    rooms.set(roomName, room);

    io.emit("new room", Array.from(rooms));
  });

  socket.on("delete room", () => {
    //you can delete it only if you are the user
    //or it should delete them if the user disconects

    io.emit("new room", rooms);
  });

  socket.on("selectLine", (target, initializer) => {
    console.log(
      `Select from player ${playerIndex} in room ${currentRoom} with target ${target}`
    );

    // Emit the move to the other players
    // TODO find way to emit the move only to players in the room
    //socket.broadcast.to(room).emit("select", room, target);
    io.to(currentRoom).emit("selectLine", target, playerIndex);
  });

  socket.on("user left", (room) => {
    io.to(room).emit("user left");
  });
});
