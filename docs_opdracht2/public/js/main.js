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
    const chatForm = document.getElementById("messageForm");
    chatForm.reset();
};

socket.on('server message', function(msg){
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML("beforeend", `<li class="serverMSG">${msg}</li>`);
});

socket.on('chat message', function(msg, randomColor, gameResults){
    // console.log(gameResults)
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML("beforeend", `<li class="chatMSG" style="border: 5px solid ${randomColor};" >${msg}</li>`)
});

socket.on('player role', function(currantMovieTitle, currantMovieCover){
    const movieInfomation = document.getElementById('drawRole');
    while(movieInfomation.firstChild) movieInfomation.firstChild.remove();
    movieInfomation.insertAdjacentHTML("beforeend", `<h1>It is your turn to draw</h1>`)
    movieInfomation.insertAdjacentHTML("beforeend", `<h2>${currantMovieTitle}</h2>`)
    movieInfomation.insertAdjacentHTML("beforeend", `<p>Tip: if you don't know how to draw it, draw the poster</p>`)
    movieInfomation.insertAdjacentHTML("beforeend", `<img src="https://image.tmdb.org/t/p/w500${currantMovieCover}" alt="Cover image of the movie: ${currantMovieTitle}" >`)

    document.getElementById('drawRole').classList.remove('locked')
    document.getElementById('quessRole').classList.add('locked')
});

socket.on('player guessed movie', function(currantMovieTitle, currantMovieCover, userName){
    const showMovie = document.getElementById('informationAboutMovie');
    const showWinner = document.getElementById('informationTextAboutRound');

    //Hoe je een html element leeg maakt in javascript: 
    //https://stackoverflow.com/questions/5744233/how-to-empty-the-content-of-a-div
    while(showWinner.firstChild) showWinner.firstChild.remove();
    while(showMovie.firstChild) showMovie.firstChild.remove();

    showWinner.insertAdjacentHTML("beforeend", `<h1>The movie was: <br> ${currantMovieTitle}</h1>`);
    showWinner.insertAdjacentHTML("beforeend", `<h2>${userName} is the winner of this round!</h2>`);
    showWinner.insertAdjacentHTML("beforeend", `<p>${userName} gets 1 point</p>`);
    showMovie.insertAdjacentHTML("beforeend", `<img src="https://image.tmdb.org/t/p/w500${currantMovieCover}" alt="Cover image of the movie: ${currantMovieTitle}" >`);
    
    document.getElementById('roundEnd').classList.remove('locked');
    document.getElementById('game').classList.add('locked');

    document.getElementById('quessRole').classList.remove('locked');
    document.getElementById('drawRole').classList.add('locked');

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scoreBoard = document.getElementById("scoreBoard");
    while(scoreBoard.firstChild) scoreBoard.firstChild.remove();

    clickNextRound();
});

function clickNextRound(){
    const buttonNextRound = document.getElementById('goToNextRound');
    buttonNextRound.addEventListener("click", function(){
        document.getElementById('game').classList.remove('locked');
        document.getElementById('roundEnd').classList.add('locked');
    });
};

socket.on('score board', function(gameResults){
    const scoreBoard = document.getElementById("scoreBoard");
    while(scoreBoard.firstChild) scoreBoard.firstChild.remove();
    scoreBoard.insertAdjacentHTML("beforeend", `<h2>Scoreboard</h2>`);
    const score = new Map(
        Object.entries(gameResults).map(
            ([key, value]) => [key, value["wins"], 
            console.log("test", key, value),
            scoreBoard.insertAdjacentHTML("beforeend", `<p>${key}: ${value.wins}</p>`),
        ])
    );
});

socket.on('choose mode', function(){
    document.getElementById('gameMode').classList.remove('locked');
    document.getElementById('usernameForm').classList.add('locked');
    document.getElementById('game').classList.add('locked');

    const chooseMovie = document.getElementById('gameModeMovie')
    chooseMovie.addEventListener('click', function() {
        document.getElementById('game').classList.remove('locked');
        document.getElementById('gameMode').classList.add('locked');
        socket.emit("game mode", "movie");
    })
    
    const chooseSerie = document.getElementById('gameModeSerie')
    chooseSerie.addEventListener('click', function() {
        document.getElementById('game').classList.remove('locked');
        document.getElementById('gameMode').classList.add('locked');
        socket.emit("game mode", "serie");
    })
})
