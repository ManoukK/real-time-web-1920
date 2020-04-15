
const socket = io();
socket.emit('connect', 1);

const setUsername = document.getElementById("usernameForm");
setUsername.addEventListener('submit', usernameInput);

function usernameInput(event){
    event.preventDefault();
    const usernameInputField = document.getElementById("username");
    console.log(usernameInputField.value);

    //emit stuurt naar de server
    socket.emit('set user', usernameInputField.value);
};

socket.on('server message', function(msg){
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML("beforeend", `<li class="serverMSG">${msg}</li>`);
});

const msgForm = document.getElementById("messageForm");
msgForm.addEventListener('submit', inputText);

function inputText(event){
    event.preventDefault();
    const inputField = document.getElementById("m");
    console.log(inputField.value);

    //emit stuurt naar de server
    socket.emit("chat message", inputField.value);

    //luistert naar de server (berichten)
    socket.on('chat message', function(msg){
        const messages = document.getElementById("messages");
        messages.insertAdjacentHTML("beforeend", `<li class="chatMSG">${msg}</li>`);
    });
}
