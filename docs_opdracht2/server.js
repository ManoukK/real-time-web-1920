const express = require('express')
const app = express()
const host = '0.0.0.0';
const port = process.env.PORT || 2000;
const key = 'd279459f07cba4cb7988fbc31b7aa0bd'
const fetch = require('node-fetch')

const server = app.listen(port, host, function() {
    console.log(`Example app listening on port ${port}!`);
});

const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log('user connected');

    socket.on('chat message', function(msg){    
        const newMessage = msg;
        io.emit('chat message', `${newMessage}`)
        console.log('message from user', `${newMessage}`);
    });

})

// app.get('/movies', (req, res) => {
//     fetch(`https://api.themoviedb.org/3/movie/550?api_key=${key}`)
//       .then(async response => {
//         const movieData = await response.json()
//         res.sendFile(__dirname + '/public/test.html', {
//           title: 'Movies',
//           movieData,
//         });
//       })
//   })

app.get('/movies', function(req, res){
    res.sendFile(__dirname + '/public/test.html');
});
