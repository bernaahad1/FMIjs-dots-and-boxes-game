const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
server.listen(PORT, () => console.log(`Server running on ${PORT}`));


// Handle socket connection
let users = []; //{username, ownedGames = [], id}
const rooms = new Map(); //{owner, name, gridSize, playerNum}

io.on('connection', socket =>{
    console.log(`New WS Connection. Connection id: ${socket.id}`)
    socket.on("join server", (username) => {
        const user = {
            username,
            id: socket.id,
        }
        users.push(user);
        io.emit("new user", users);
    })

    socket.on("disconect", () =>{
        //this is when the user leave
        //it should remove him from users
        //and to emit "delete room"
    })

    socket.on("join room", (roomName, cb) =>{
        socket.join(roomName);
        cb(rooms[roomName]);//?
        socket.emit("connected",rooms[roomName]);//?
    })

    socket.on("leave room", () =>{
        //you can leave the room
    })

    socket.on("create room",(roomName, gridSize, playerNum) =>{
        const room = {
            owner: socket.id,
            name: roomName,
            size: gridSize,
            players: []
        };

        for(let i = 0; i < playerNum; i++){
            room.players.push(null);
        }
        rooms.set(roomName, room);
    })

    socket.on("delete room", () =>{
        //you can delete it only if you are the user
        //or it should delete them if the user disconects
    })
})