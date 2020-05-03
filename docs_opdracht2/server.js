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

// let drawPlayer = Object.keys(gameResults)[0];

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

      if(connectedUsers.length === 1){
        apiResults = await getData();
        movieLeftovers = apiResults;
        // console.log(movieLeftovers.length);
        // console.log(apiResults.length);
        console.log(drawingRole);
        // let setDrawingRole = 0;
        // drawPlayer = Object.keys(gameResults)[setDrawingRole];

        // let setPoint = gameResults[userName].wins++;

        showMovie(drawingRole);
      } else {
        socket.emit('player role', `player role guesser`)
      }

      socket.emit('server message', `Welcome ${userName}!`);
      socket.broadcast.emit('server message', `${userName} joined the game!`);
  });

  socket.on('chat message', function(msg){   
    movieTitleCheck(msg, gameResults); 
      // console.log("test", randomMovie);
      // const currantMovieTitle = Object.values(randomMovie)[0].movieTitle;
      // const movieTitleCheck = currantMovieTitle.toUpperCase();
      // const msgCheck = msg.toUpperCase();

      // if(msgCheck === movieTitleCheck){
      //   io.emit('chat message', `${userName}: ${msg}`, randomColor);
      //   io.emit('server message', `${userName} guessed the movie! It was: ${movieTitleCheck}`);
      //   console.log("WOOW");

      //   const drawnByPlayer = gameResults[drawPlayer].drawn;
      //   drawnByPlayer.push({
      //     filmName: movieTitleCheck
      //     // drawing: 
      //   });

      //   randomMovie.length = 0;
      // } else {
      //   io.emit('chat message', `${userName}: ${msg}`, randomColor);
      // }
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

    if (userPosition >= 0)
      connectedUsers.splice(userPosition, 1);
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
    console.log("in showmovie function", drawingRole)
    const playerDrawId = Object.values(gameResults)[drawingRole].userId;
    console.log(playerDrawId);
    randomMovieGenerator(gameResults);
    const currantMovieTitle = Object.values(randomMovie)[drawingRole].movieTitle;
    console.log(currantMovieTitle);
    const currantMovieCover = Object.values(randomMovie)[drawingRole].movieImage;
    console.log(currantMovieCover);
    io.emit;
    io.to(playerDrawId).emit('player role', currantMovieTitle, currantMovieCover);
  }

  function randomMovieGenerator(gameResults){
    // randomMovie.length = 0;
    // const drawPlayer = Object.keys(gameResults)[0];
    const movieListLength = apiResults.length;
    const randomNumber = Math.floor(Math.random() * movieListLength);
    const oneRandomMovie = apiResults[randomNumber];
    // const drawnByPlayer = gameResults[drawPlayer].drawn;
    // drawnByPlayer.push({
    //   filmName: oneRandomMovie.movieTitle
    // });
    movieLeftovers.splice(randomNumber, 1);

    randomMovie.push(oneRandomMovie);
  }

  function movieTitleCheck(msg, gameResults){
      let drawPlayer = Object.keys(gameResults)[0];
      const currantMovieTitle = Object.values(randomMovie)[0].movieTitle;
      const movieTitleUpper = currantMovieTitle.toUpperCase();
      const msgUpper = msg.toUpperCase();

      //hoe je een if statement schrijft met 2 waardes die true moeten zijn.
      //https://stackoverflow.com/questions/8710442/how-to-specify-multiple-conditions-in-an-if-statement-in-javascript
      if(drawPlayer !== userName && msgUpper === movieTitleUpper){
        io.emit('chat message', `${userName}: ${msg}`, randomColor);
        io.emit('server message', `${userName} guessed the movie! It was: ${movieTitleUpper}`);

        const currantMovieTitle = Object.values(randomMovie)[0].movieTitle;
        const currantMovieCover = Object.values(randomMovie)[0].movieImage;
        io.emit('player guessed movie', currantMovieTitle, currantMovieCover, userName);

        console.log(gameResults);
        let setPoint = gameResults[userName].wins++;
        drawingRole++;
        console.log("in chat", drawingRole)
        // let setDrawingRole = drawPlayer;
        // setDrawingRole++;
        // console.log(drawPlayer);
        // console.log(setDrawingRole);

        // drawPlayer = Object.keys(gameResults)[setDrawingRole];
        // console.log(gameResults);
        // console.log(drawPlayer);
        randomMovieGenerator(gameResults);
        //nog de juiste user aan meegegeven :PPPP
        showMovie(drawingRole);
        // searchNewDrawPlayer = gameResults.indexOf(drawPlayer);
        // console.log(searchNewDrawPlayer);

        // socket.on('save game data of round', function(drawing){
        //   const drawnByPlayer = gameResults[drawPlayer].drawn;
        //   drawnByPlayer.push({
        //     filmNameTest: movieTitleUpper,
        //     test: "hallo",
        //     testTwee: drawing,
        //   });
        //   console.log("joepie", drawnByPlayer);
        // })

        // const drawnByPlayer = gameResults[drawPlayer].drawn;
        // drawnByPlayer.push({
        //   filmNameTest: movieTitleUpper,
        //   test: "hallo",
        //   testTwee: drawing,
        // });

        // console.log("joepie", drawnByPlayer);

        randomMovie.length = 0;
      } else {
        io.emit('chat message', `${userName}: ${msg}`, randomColor);
      }
  }

})

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/public/test.html');
});
