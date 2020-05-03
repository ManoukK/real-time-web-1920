const socket = io();
socket.emit('connect', 1);

//https://www.youtube.com/watch?v=m4sioSqlXhQ
//part 1 en 2
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const radius = 5;
let dragging = false;

context.lineWidth = radius*2;

function putPoint(e, mouseValue = 'dragging'){
    if(dragging){
        context.lineTo(e.offsetX, e.offsetY);
        context.strokeStyle = "black";
        context.stroke();
        context.beginPath();
        context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI*2);
        context.fillStyle = "black";
        context.fill();
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);

        let data = {
            mouseValue,
            x: e.offsetX,
            y: e.offsetY
        }
        //https://www.youtube.com/watch?v=i6eP1Lw4gZk
        //canvas real time
        socket.emit('mouseMoving', data);
    }
};

function interact(e){
    // console.log(e);
    dragging = true;
    let mouseValue = 'start';
    putPoint(e, mouseValue);
};

function stopInteract(e){
    dragging = false;
    context.beginPath();
    let mouseValue = 'stop';
    let data = {
        mouseValue,
        x: e.offsetX,
        y: e.offsetY
    }
    // ook het eind punt mee sturen naar de server
    socket.emit('mouseMoving', data);
};

canvas.addEventListener('mousedown', interact);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', stopInteract);

socket.on('mouseMoving', whileDragging);
socket.on('mouseStop', stop);
socket.on('mouseStart', start);

function stop(stopPositionX, stopPositionY){
    context.beginPath();
    console.log("end point", stopPositionX, stopPositionY);
};

//van de server gebroadcast naar andere users
function start(startPositionX, startPositionY, randomColor) {
    console.log("start point", startPositionX, startPositionY);
    context.lineTo(startPositionX, startPositionY);
    context.strokeStyle = randomColor;
    context.stroke();
    context.beginPath();
    context.arc(startPositionX, startPositionY, radius, 0, Math.PI*2);
    context.fillStyle = randomColor;
    context.fill();
    context.beginPath();
    context.moveTo(startPositionX, ); 
}

function whileDragging(dragPositionX, dragPositionY, randomColor) {
    context.lineTo(dragPositionX, dragPositionY);
    context.strokeStyle = randomColor;
    context.stroke();
    context.beginPath();
    context.arc(dragPositionX, dragPositionY, radius, 0, Math.PI*2);
    context.fillStyle = randomColor;
    context.fill();
    context.beginPath();
    context.moveTo(dragPositionX, dragPositionY); 
};

// const usernameSend = document.getElementById("usernameForm");
// usernameSend.addEventListener('submit', usernameInput);


const usernameSend = document.getElementById('usernameButton')

usernameSend.addEventListener('click', function() {
    event.preventDefault();
    const username = document.getElementById('usernameInput')
    socket.emit('start game', username.value);
    document.getElementById('game').classList.remove('locked')
    document.getElementById('usernameForm').classList.add('locked')
  })

const msgForm = document.getElementById("messageForm");
msgForm.addEventListener('submit', inputText);

function inputText(event){
    event.preventDefault();
    const inputField = document.getElementById("m");
    console.log(inputField.value);
    socket.emit("chat message", inputField.value);
};

socket.on('server message', function(msg){
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML("beforeend", `<li class="serverMSG">${msg}</li>`);
});

socket.on('chat message', function(msg, randomColor){
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML("beforeend", `<li class="chatMSG" style="border: 5px solid ${randomColor};" >${msg}</li>`)
});

socket.on('player role', function(currantMovieTitle, currantMovieCover){
    if(currantMovieTitle === 'player role guesser'){
        const movieImages = document.getElementById('movielist');
        movieImages.insertAdjacentHTML("beforeend", `<h2>Guess the movie in the chat</h2>`)
        movieImages.insertAdjacentHTML("beforeend", `<p>The first one who guess the movie right wins this round! So be quick</p>`)
        movieImages.insertAdjacentHTML("beforeend", `<img src="https://lh3.googleusercontent.com/proxy/2holoyWbQotj033yGIjGiTE_uiEJ9w6geWd8Ksosm_lMtP3alNLxCidD3CAofyQucLAyQCyw89Dd91nuOgnYWEstnGB7aC_pVHoGBROdlA4d6Ljv58qVmX19v-ecp5Se" alt="Cover image of a questionmark" >`)
    } else {
        const movieImages = document.getElementById('movielist');
        movieImages.insertAdjacentHTML("beforeend", `<h1>Draw this movie:</h1>`)
        movieImages.insertAdjacentHTML("beforeend", `<h2>${currantMovieTitle}</h2>`)
        movieImages.insertAdjacentHTML("beforeend", `<p>Tip: if you don't know the movie, draw the poster</p>`)
        movieImages.insertAdjacentHTML("beforeend", `<img src="https://image.tmdb.org/t/p/w500${currantMovieCover}" alt="Cover image of the movie: ${currantMovieTitle}" >`)
    }
})

// saveDrawing();

socket.on('player guessed movie', function(currantMovieTitle, currantMovieCover, userName){
    const showMovie = document.getElementById('roundEnd');
    const showWinner = document.getElementById('informationTextAboutRound');
    showWinner.insertAdjacentHTML("beforeend", `<h1>The movie was: <br> ${currantMovieTitle}</h1>`)
    showWinner.insertAdjacentHTML("beforeend", `<h2>${userName} is the winner of this round!</h2>`)
    showWinner.insertAdjacentHTML("beforeend", `<p>${userName} gets 1 point</p>`)
    showMovie.insertAdjacentHTML("beforeend", `<img src="https://image.tmdb.org/t/p/w500${currantMovieCover}" alt="Cover image of the movie: ${currantMovieTitle}" >`)
    document.getElementById('roundEnd').classList.remove('locked')
    document.getElementById('game').classList.add('locked')
    click();
    // window.location = document.getElementById("canvas").toDataURL('image/png');
    // socket.emit("save game data of round", window.location);
    // alert("Hello! I am an alert box!!");
});

function click(){
    const buttonNextRound = document.getElementById('goToNextRound');
    buttonNextRound.addEventListener("click", function(){
        document.getElementById('game').classList.remove('locked')
        document.getElementById('roundEnd').classList.add('locked')
    })
}









