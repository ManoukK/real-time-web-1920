const express = require('express');
const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = app.listen(port, host, function() {
    console.log(`Example app listening on port ${port}!`);
});

const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function(socket){
    let userName = "onbekend";

    socket.on('set user', function(id){
        const oldUsername = userName;
        userName = id;
        console.log('server message', `SERVER: Welcome ${userName}!`);
        socket.emit('server message', `SERVER: You've changed your name to ${userName}!`);
        socket.broadcast.emit('server message', `SERVER: User ${oldUsername} changed their name to ${userName}`);
    })

    console.log(`user connected ${userName}`);
    socket.emit('server message', `SERVER: Welcome ${userName}!`);

    socket.on('chat message', function(msg){    
        const newMessage = verbsChanger(msg);
        io.emit('chat message', `${userName}: ${newMessage}`)
        console.log('message from user', `${userName}: ${newMessage}`);
    });

    socket.on('disconnect', function(){
        console.log(`user disconnected ${userName}`);
    });
});

function verbsChanger(lastMessage){
    const verbs = [
        "beginnen", "denken", "douchen", "eten", "lopen", "studeren", 
        "coderen", "vallen", "vliegen", "werken", "zwemmen", "reizen",
        "winnen", "koken", "springen", "sturen", "spelen", "slapen",
        "praten", "lezen", "wassen", "bijten", "bouwen", "typen",
        "gamen",  "ademen", "hacken", "deployen", "boos worden op designers", "lachen",
    ];

    // laatste bericht die is gestuurd (nog uit de chat halen)
    console.log(lastMessage);

    //bericht opsplitsen in een array
    const splitLastMessage = lastMessage.split(" ");

    //checken of er waardes overeen komen tussen 2 arrays
    //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
    const intersection = splitLastMessage.filter(x => verbs.includes(x));
    console.log("Dit woord is eruit gefilterd:", intersection);

    
    //https://www.geeksforgeeks.org/check-if-an-array-is-empty-or-not-in-javascript/
    if (Array.isArray(intersection) && intersection.length){ 

        //random woord kiezen uit de array van werkwoorden
        //https://stackoverflow.com/questions/1516695/js-math-random-for-array
        const randomVerb = verbs[Math.floor(verbs.length * Math.random())];
        console.log("een random werkwoord", randomVerb);

        //Uitgekozen woord omzetten naar een string
        const verbToString = intersection.toString();    
        console.log("Dit woord is eruit gefilterd:", verbToString);

        //De index van het uitgekozen woord achterhalen
        const indexOfOldVerb = splitLastMessage.indexOf(verbToString);
        console.log("index van het werkwoord in de oorspronkelijke zin", indexOfOldVerb);

        //het nieuwe random woord op de plek zetten van het oude werkwoord doormiddel van een index nummer
        const newArrayWithRandomVerb = splitLastMessage[indexOfOldVerb] = randomVerb;
        console.log("oude werkwoord vervangen voor het nieuwe werkwoord:", newArrayWithRandomVerb);

        //de array weer aan elkaar plakken zodat het een zin word
        const messageToString = splitLastMessage.join(" "); 

        console.log(newArrayWithRandomVerb);
        console.log(splitLastMessage);
        console.log(messageToString);


        return messageToString;
        //lastMessage.innerHTML = messageToString;

    } else { 
            return lastMessage;
    };
};

