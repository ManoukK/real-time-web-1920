const socket = io();

socket.on('connect', function(socket){

});

//naam veranderen
const inputForm = document.getElementById("messageForm");
inputForm.addEventListener('submit', inputText);

function inputText(event){
    event.preventDefault();
    const inputField = document.getElementById("m");
    console.log(inputField.value);

    //emit stuurt naar de server
    socket.emit("chat message", inputField.value);

    //luistert naar de server (berichten)
    socket.on('chat message', function(msg){
        const messages = document.getElementById("messages");
        messages.insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
        });
}
