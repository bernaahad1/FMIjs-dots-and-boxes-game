const onCreateRoom = () => {
    alert("new room");
}

const createRoomButton = (roomName, numPlayers) => {
    const button = document.createElement("button");
    button.className = "ChooseRoom";
    button.id = `${roomName}`;

    const name = document.createElement("p");
    name.innerHTML = `${roomName} `;

    const players = document.createElement("p");
    players.innerHTML = `0/${numPlayers}`;

    const state = document.createElement("p"); //this can be check or X
    state.innerHTML = "waiting"

    button.appendChild(name);
    button.appendChild(players);
    button.appendChild(state);
    return button;
}

const createHome = () => {
    const mainConatiner = document.getElementsByClassName("main-content")[0];

    const row = document.createElement("div");
    row.className = "home-row";
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
    column2.appendChild(createRoomButton("Room 1", 2));

    //add elements to HTML
    row.appendChild(column1);
    row.appendChild(column2);
    mainConatiner.appendChild(row);

    mainConatiner.getElementsByClassName("create-room")[0]
    .addEventListener("click", onCreateRoom);
}

createHome();