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
io.on('connection', socket =>{
    console.log(`New WS Connection. Connection id: ${socket.id}`)
})