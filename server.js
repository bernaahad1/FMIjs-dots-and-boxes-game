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
const rooms = new Map(); //{owner, name, gridSize, players:[,]}

io.on('connection', socket =>{
    console.log(`New WS Connection. Connection id: ${socket.id}`)
    let playerIndex = -1;

    const clearPlayerGame = () => {
        const connectedRooms = Array.from(socket.rooms);
        if(connectedRooms.length == 1) return;
        rooms.get(connectedRooms.pop()).players[playerIndex] = null;
        playerIndex = -1;
    }

    socket.on("join server", (username) => {
        const user = {
            username,
            id: socket.id,
        }
        users.push(user);
        io.emit("new user", users);
    })

    socket.on("disconnecting", () => {
        clearPlayerGame();
    });

    socket.on("disconnect", () =>{
        users = users.filter(u => u.id !== socket.id);
        console.log("user disconected")
        io.emit("new user", users); // this will be emitted to all 
        //this is when the user leave
        //it should remove him from users
        //and to emit "delete room"
    })

    socket.on("join room", (roomName, cb) =>{
        clearPlayerGame();
        socket.join(roomName);
        const players = rooms.get(roomName).players;
        for(const i in players){
            if(players[i] === null){
                playerIndex = i;
                rooms.get(roomName).players[i] = true;
                break;
            }
        }
        cb(rooms.get(roomName), playerIndex);
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

        io.emit("new room", Array.from(rooms));
    })

    socket.on("delete room", () =>{
        //you can delete it only if you are the user
        //or it should delete them if the user disconects

        io.emit("new room", rooms);
    })
})

