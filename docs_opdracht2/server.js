require('dotenv').config();
const express = require('express');
const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 2000;
const fetch = require('node-fetch');

const server = app.listen(port, host, function() {
    console.log(`Example app listening on port ${port}!`);
});

const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

//user bijhouden
//https://stackoverflow.com/questions/18335028/socket-io-how-to-prompt-for-username-and-save-the-username-in-an-array
let connectedUsers = [];
let gameResults = {};
let apiResults = [];
let leftoversToDraw = [];
let titleToDrawThisRound = [];
let drawingRole = 0;

io.on('connection', function(socket){ 
  //https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
  const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
  let userName = "ANONYMOUS";

  socket.on('game mode', async function(gameMode){
    if (gameMode === "movie"){
        apiResults = await getMovieData();
        leftoversToDraw = apiResults;
        showTitle(drawingRole);

    }else if (gameMode === "serie"){
      apiResults = await getSerieData();
      leftoversToDraw = apiResults;
      showTitle(drawingRole);
    }
  })

  socket.on('start game', function(id){

      const upperCaseUsername = id.toUpperCase();

      if(upperCaseUsername === ""){
        userName = "ANONYMOUS";
      } else  {
        userName = upperCaseUsername;
      }

      let dubbleNameCheck = connectedUsers.includes(userName);

      if(dubbleNameCheck === true){
        newUsername = userName + "0" + connectedUsers.length;
        userName = newUsername;
        connectedUsers.push(userName);
      } else {
        connectedUsers.push(userName);
      }

      gameResults[userName] = { 	
        userId: socket.id,
        wins: 0,
        drawn: [],
      };

      io.emit('score board', gameResults, randomColor);

      if(connectedUsers.length === 1){
        const playerDrawId = Object.values(gameResults)[drawingRole].userId;
        io.to(playerDrawId).emit('choose mode');
      }
      socket.emit('server message', `Welcome ${userName}!`);
      socket.broadcast.emit('server message', `${userName} joined the game!`);
  });

  socket.on('chat message', function(msg){   
    console.log(gameResults);
    console.log(leftoversToDraw);
    let drawPlayer = Object.keys(gameResults)[drawingRole];
    const currantTitle = Object.values(leftoversToDraw)[0].title;
    const upperCaseTitle = currantTitle.toUpperCase();
    const msgUpper = msg.toUpperCase();

    //hoe je een if statement schrijft met 2 waardes die true moeten zijn.
    //https://stackoverflow.com/questions/8710442/how-to-specify-multiple-conditions-in-an-if-statement-in-javascript
    if(drawPlayer !== userName && msgUpper === upperCaseTitle){
      io.emit('chat message', `${userName}: ${msg}`, randomColor, gameResults);
      io.emit('server message', `${userName} guessed the movie! It was: ${upperCaseTitle}`);

      const currantTitle = Object.values(leftoversToDraw)[0].title;
      const currantCover = Object.values(leftoversToDraw)[0].image;
      io.emit('player guessed movie', currantTitle, currantCover, userName);

      let setPointGuesser = gameResults[userName].wins++;
      const setTitle = gameResults[drawPlayer].drawn;
      setTitle.push(currantTitle);

      io.emit('score board', gameResults);

      if(drawingRole === (connectedUsers.length - 1)){
        drawingRole = 0;
      }else{
        drawingRole++;
      }

      leftoversToDraw.splice(0, 1);
      showTitle(drawingRole);

      titleToDrawThisRound.length = 0;

    } else if (drawPlayer === userName && msgUpper === upperCaseTitle){
      io.emit('chat message', `${userName}: ${msg}`, randomColor, gameResults);
      io.emit('server message', `Nobody guessed the movie... It was: ${upperCaseTitle}`);

      const currantTitle = Object.values(leftoversToDraw)[0].title;
      const currantCover = Object.values(leftoversToDraw)[0].image;
      io.emit('player guessed movie', currantTitle, currantCover, `Nobody`);


      const setTitle = gameResults[drawPlayer].drawn;
      setTitle.push(currantTitle);

      if(drawingRole === (connectedUsers.length - 1)){
        drawingRole = 0;
      }else{
        drawingRole++;
      }

      leftoversToDraw.splice(0, 1);
      showTitle(drawingRole);

      titleToDrawThisRound.length = 0;

    } else {
      io.emit('chat message', `${userName}: ${msg}`, randomColor, gameResults);
    }
  });

  socket.on('mouseMoving', function(data){
      switch(data.mouseValue){
        case 'start': 
          let startPositionX = data.x;
          let startPositionY = data.y;
          socket.broadcast.emit('mouseStart', startPositionX, startPositionY, randomColor);

          break;

        case 'dragging':
          let dragPositionX = data.x;
          let dragPositionY = data.y;
          socket.broadcast.emit('mouseMoving', dragPositionX, dragPositionY, randomColor);

          break;

        case 'stop':
          let stopPositionX = data.x;
          let stopPositionY = data.y;
          socket.broadcast.emit('mouseStop', stopPositionX, stopPositionY);

          break;

          default:
        return false
        break;
        }
  });

  socket.on('disconnect', function(){
    socket.broadcast.emit('server message', `${userName} has left the game!`);
    
    let userPosition = connectedUsers.indexOf(userName);
    if (userPosition >= 0){
      connectedUsers.splice(userPosition, 1);

      delete gameResults[userName];
    }
    io.emit('score board', gameResults);
  });

  async function getMovieData(){
    const key = process.env.API_KEY;
    const randomPage = Math.floor((Math.random() * 10) +1);
    const listSortingSetting = 'popularity.desc'  
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=${listSortingSetting}&include_adult=false&include_video=false&page=${randomPage}`

    const data = await fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(results) {
          console.log(results)
            return results.results;

        })
        .then(results => {
          return results.map(results => {
              return {
                  title: results.title,
                  image: results.poster_path,
                  id: results.id,
              }
            })
          })
        .catch(function(err) {
            console.log(err);
        });

        return data;
    }

  async function getSerieData(){
    const key = process.env.API_KEY;
    const randomPage = Math.floor((Math.random() * 10) +1);
    const listSortingSetting = 'popularity.desc'  
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${key}&language=en-US&sort_by=${listSortingSetting}&include_adult=false&include_video=false&page=${randomPage}`

    const data = await fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(results) {
            return results.results;    
        })
        .then(results => {
          return results.map(results => {
              return {
                  title: results.name,
                  image: results.poster_path,
                  id: results.id,
              }
            })
          })
        .catch(function(err) {
            console.log(err);
        });

        return data;
  };

  function showTitle(drawingRole){
    const playerDrawId = Object.values(gameResults)[drawingRole].userId;
    const currantTitle = Object.values(leftoversToDraw)[0].title;
    const currantCover = Object.values(leftoversToDraw)[0].image;

    io.to(playerDrawId).emit('player role', currantTitle, currantCover);
  }
});