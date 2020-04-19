const socket = io();
socket.emit('connect', 1);

//https://www.youtube.com/watch?v=m4sioSqlXhQ
//part 1 en 2
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const radius = 5;
let dragging = false;

context.lineWidth = radius*2;

function putPoint(e){
    if(dragging){
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        context.beginPath();
        context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
        context.fill();
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
    }
}

function interact(e){
    dragging = true;
    putPoint(e);
}

function stopInteract(){
    dragging = false;
    // schoont het pad op zodat je niet het 1 streep effect krijgt.
    context.beginPath();
}

canvas.addEventListener('mousedown', interact);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', stopInteract);


const setUsername = document.getElementById("usernameForm");
setUsername.addEventListener('submit', usernameInput);

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


//https://www.youtube.com/watch?v=m4sioSqlXhQ
// deze tutorial volgen













// var canvas = document.getElementById('canvas');
// var canvasContext = canvas.getContext('2d');
// var mouseClicked = false;
// var mouseResleased = true;

// var height = canvas.height = window.innerHeight;
// var width = canvas.width = window.innerWidth;

// canvas.addEventListener("click", onMouseClick, false);
// canvas.addEventListener("mousemove", onMouseMove, false);

// function onMouseClick(e) {
//     mouseClicked = !mouseClicked;
// }

// function onMouseMove(e) {
//     if (mouseClicked) {
//         context.beginPath();
//         context.arc(e.clientX, e.clientY, 7.5, 0, Math.PI * 2, false);
//         context.lineWidth = 5;
//         context.strokeStyle = "#fff";
//         context.stroke();
//     }
// }

// draw();
// function draw() {
//     const canvas = document.getElementById('canvas');

//     const canvasContext = canvas.getContext('2d');

//     const mouseClicked = false;
//     const mouseResleased = true;

//     document.addEventListener("click", onMouseClick, false);

//     document.addEventListener("mousemove", onMouseMove, false);

//     // canvasContext.fillRect(x, y, width, height)

//     // if (canvas.getContext){
//     //     let ctx = canvas.getContext('2d');

//         // ctx.fillStyle = 'orange';
//         // ctx.fillStyle = '#FFA500';
//         // ctx.fillStyle = 'rgb(255, 165, 0)';
//         // ctx.fillStyle = 'rgba(255, 165, 0, 1)';

//         // ctx.beginPath();
//         // ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
//         // ctx.moveTo(110, 75);
//         // ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
//         // ctx.moveTo(65, 65);
//         // ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
//         // ctx.moveTo(95, 65);
//         // ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
//         // ctx.stroke();
//     // }
// };
