import { onChooseRoom, socket } from "./connectToServer.js";

let rooms = new Map();

socket.on("new room", (r) => {
    rooms = new Map(r);
    generateAllExitingRooms();
});
socket.on("fetch rooms", r => {
    rooms = new Map(r);
    generateAllExitingRooms();
});

const onCreateRoom = (e, roomName = "defauty", numPlayers = 2, gridSize = 4) => {
    socket.emit("create room", roomName, gridSize, numPlayers);
    //createRoomButton(roomName, numPlayers,0,"waiting");
}

const createRoomButton = (roomName, numPlayers, playersConnected, _state) => {
    const allRooms = document.getElementById("home-all-rooms");
    let button = document.createElement("button");
    button.className = "ChooseRoom";
    button.id = `${roomName}`;
    button.value = `${roomName}`;

    //I tried to make it cool
    // const name = document.createElement("p");
    // name.innerHTML = `${roomName} `;
    // name.disabled = true;

    // const players = document.createElement("p");
    // players.innerHTML = `${playersConnected}/${numPlayers}`;

    // const state = document.createElement("p"); //this can be check or X
    // state.innerHTML = `${_state}`

    // button.appendChild(name);
    // button.appendChild(players);
    // button.appendChild(state);
    button.innerHTML += `${roomName} ${playersConnected}/${numPlayers} ${_state}`
    allRooms.appendChild(button);
}

const updateRoomButton = (roomName) => {
    const button = document.getElementById(`${roomName}`);
    button.innerHTML = ``;
}

const generateAllExitingRooms = () => {
    document.getElementById("home-all-rooms").innerHTML = ``;

    const allRooms = Array.from(rooms.values());
    allRooms.forEach((r) => {
        let connected = 0;
        r.players.forEach(p => {
            if(p !== null)
                connected++;
        })
        createRoomButton(r.name, r.players.length, connected,
             connected === r.players.length ? "ready" : "waiting");
    });

    const roomButtons = document.getElementsByClassName("ChooseRoom");

  for (let i = 0; i < rooms.size; i++) {
    //console.log(roomButtons[i])
    roomButtons[i].addEventListener("click", onChooseRoom);
  }

}

const createHome = () => {
    const mainConatiner = document.getElementsByClassName("main-content")[0];

    const row = document.createElement("div");
    row.className = "home-row";
    row.id = "home-menu";
    const column1 = document.createElement("div");
    column1.className = "home-column";
    const column2 = document.createElement("div");
    column2.className = "home-column";

    //create room colum
    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML += `<img src="./logo_FMIJS.png" alt="Dots and Boxes"></img>`;

    column1.appendChild(title);
    column1.innerHTML += `<button class="create-room">Create Room</button>`;
    column1.innerHTML += `<input type="text" id="IRoomName" placeholder="Room name" required>`;
    column1.innerHTML += `<input type="number" id="IRoomName" placeholder="Number players(2-4)" required>`;
    column1.innerHTML += `<input type="number" id="IRoomName" placeholder="Grid size(4-10)" required>`;

    //all rooms colum
    column2.innerHTML += `<h2>All Rooms</h2>`;
    const buttonsBox = document.createElement("div");
    buttonsBox.id = "home-all-rooms";
    column2.appendChild(buttonsBox);

    //add elements to HTML
    row.appendChild(column1);
    row.appendChild(column2);
    mainConatiner.appendChild(row);

    mainConatiner.getElementsByClassName("create-room")[0]
    .addEventListener("click", onCreateRoom);

    generateAllExitingRooms();
}

createHome();

//just for testing, in reality ignore the e
onCreateRoom("a","1", 2, 4);
onCreateRoom("a","2", 2, 4);