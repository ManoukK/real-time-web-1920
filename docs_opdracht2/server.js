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
let movieLeftovers = [];
let randomMovie = [];
let drawingRole = 0;

io.on('connection', function(socket){ 
  //https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
  const randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);

  let userName = "ANONYMOUS";

  socket.on('start game', async function(id){

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

      io.emit('score board', gameResults);

      if(connectedUsers.length === 1){
        apiResults = await getData();
        movieLeftovers = apiResults;
 
        showMovie(drawingRole);
      } else {
        // socket.emit('player role', `player role guesser`)
      }
      socket.emit('server message', `Welcome ${userName}!`);
      socket.broadcast.emit('server message', `${userName} joined the game!`);

      // let userNameTest = Object.keys(gameResults)[userName];
      // const playerDrawId = Object.values(gameResults)[drawingRole].wins;
      // console.log(gameResults);
      // var result = gameResults.map(a => a.wins);
      // console.log(result);

      // console.log("username", userName)
      // let findUserIndex = connectedUsers.indexOf(userName);
      // console.log("find", find)

      // const startingPoint = 0
      // let findUserIndex = connectedUsers.indexOf(userName);
      // io.emit('score board', gameResults, findUserIndex);
  });

  socket.on('chat message', function(msg){   
    // movieTitleCheck(msg, gameResults); 
    // console.log(gameResults);
    let drawPlayer = Object.keys(gameResults)[drawingRole];
    const currantMovieTitle = Object.values(movieLeftovers)[0].movieTitle;
    const movieTitleUpper = currantMovieTitle.toUpperCase();
    const msgUpper = msg.toUpperCase();

    //hoe je een if statement schrijft met 2 waardes die true moeten zijn.
    //https://stackoverflow.com/questions/8710442/how-to-specify-multiple-conditions-in-an-if-statement-in-javascript
    if(drawPlayer !== userName && msgUpper === movieTitleUpper){
      io.emit('chat message', `${userName}: ${msg}`, randomColor, gameResults);
      io.emit('server message', `${userName} guessed the movie! It was: ${movieTitleUpper}`);

      const currantMovieTitle = Object.values(movieLeftovers)[0].movieTitle;
      const currantMovieCover = Object.values(movieLeftovers)[0].movieImage;
      io.emit('player guessed movie', currantMovieTitle, currantMovieCover, userName);

      let setPoint = gameResults[userName].wins;
      setPoint += 2;

      console.log(setPoint);
      const setMovieTitle = gameResults[drawPlayer].drawn;
      setMovieTitle.push(currantMovieTitle);

      io.emit('score board', gameResults);

      if(drawingRole === (connectedUsers.length - 1)){
        drawingRole = 0;
      }else{
        drawingRole++;
      }

      movieLeftovers.splice(0, 1);
      showMovie(drawingRole);

      randomMovie.length = 0;

    } else if (drawPlayer === userName && msgUpper === movieTitleUpper){
      io.emit('chat message', `${userName}: ${msg}`, randomColor, gameResults);
      io.emit('server message', `Nobody guessed the movie... It was: ${movieTitleUpper}`);

      const currantMovieTitle = Object.values(movieLeftovers)[0].movieTitle;
      const currantMovieCover = Object.values(movieLeftovers)[0].movieImage;
      io.emit('player guessed movie', currantMovieTitle, currantMovieCover, `Nobody`);


      const setMovieTitle = gameResults[drawPlayer].drawn;
      setMovieTitle.push(currantMovieTitle);

      if(drawingRole === (connectedUsers.length - 1)){
        drawingRole = 0;
      }else{
        drawingRole++;
      }

      movieLeftovers.splice(0, 1);
      showMovie(drawingRole);

      randomMovie.length = 0;

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
    console.log(connectedUsers);
    socket.broadcast.emit('server message', `${userName} has left the game!`);
    let userPosition = connectedUsers.indexOf(userName);
    console.log(gameResults)
    // connectedUsers.splice(userPosition, 1);
    if (userPosition >= 0){
      connectedUsers.splice(userPosition, 1);

      // let removeUser = Object.keys(gameResults)[userPosition];
      // delete removeUser;

      delete gameResults[userName];

      // gameResults.splice(userPosition, 1);
    }
    console.log("after delete", gameResults);
    console.log(connectedUsers);
    io.emit('score board', gameResults);
  });

  async function getData(){
    const key = process.env.API_KEY;
    const randomPage = Math.floor((Math.random() * 10) +1);
    const listSortingSetting = 'popularity.desc'  
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=${listSortingSetting}&include_adult=false&include_video=false&page=${randomPage}`

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
                  movieTitle: results.title,
                  movieImage: results.poster_path,
                  movieID: results.id,
              }
            })
          })
        .catch(function(err) {
            console.log(err);
        });

        return data;
    }

  function showMovie(drawingRole){
    const playerDrawId = Object.values(gameResults)[drawingRole].userId;
    const currantMovieTitle = Object.values(movieLeftovers)[0].movieTitle;
    const currantMovieCover = Object.values(movieLeftovers)[0].movieImage;
    io.emit;

    io.to(playerDrawId).emit('player role', currantMovieTitle, currantMovieCover);
  }
})

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/public/test.html');
});
