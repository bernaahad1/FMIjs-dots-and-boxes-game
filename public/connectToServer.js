const socket = io();

let rooms = new Map();
let username = "user 1";

socket.emit("join server", username);

//create server TOBE::button
socket.emit("create room", "Room 1", 4, 2);
socket.emit("create room", "Room 2", 4, 2);

const onCreateRoom = () =>{
    console.log("new room!!");
}

const onChooseRoom = (event) => {
    console.log(`${event.target.value}`)
}

const createElements = () => {
    const display = document.getElementsByClassName("rooms-content")[0];

    var content = document.createTextNode("All rooms");
    display.appendChild(content);

    display.innerHTML += `<button class="createButton">Create Room</button>`;
    document.getElementsByClassName("createButton")[0].addEventListener("click", onCreateRoom);

    const div = document.createElement("div");
    div.className = "rooms display";
    display.appendChild(div);
};
createElements();

const displayRooms = () => {
    const display = document.getElementsByClassName("rooms display")[0];
    display.innerHTML = ``;

    const allRooms = Array.from(rooms.values());
    allRooms.forEach(r => {
        display.innerHTML += `<button class="room" value="${r.name}">${r.name}</button>`
    })

    const roomButtons = document.getElementsByClassName("room");

    for(let i = 0; i < roomButtons.length; i++){
        roomButtons[i].addEventListener('click', onChooseRoom);
    }
}

//here is a example on subbmiting to all
//I think we can use it to change the current rooms :)
socket.on("new user", (users) => {
    console.log("users change")
})

socket.on("new room", r => {
    rooms = new Map(r);
    displayRooms();
})

//module.exports = {createElements,};
//export default createElements;