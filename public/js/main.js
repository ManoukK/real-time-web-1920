const socket = io();

// $(function () {
//     const socket = io();
//     $('form').submit(function(e){
//       e.preventDefault(); // prevents page reloading
//       socket.emit("chat message", document.querySelector("#m").value);
//       $('#m').val('');
//       return false;
//     });
//     socket.on('chat message', function(msg){
//     verbsChanger();
//       $('#messages').append($('<li>').text(msg));
//     });
//   });

// const verbs = [
//     "beginnen", "denken", "douchen", "eten", "lopen", "studeren", 
//     "coderen", "vallen", "vliegen", "werken", "zwemmen", "reizen",
//     "winnen", "koken", "springen", "sturen", "spelen", "slapen",
//     "praten", "lezen", "wassen", "bijten", "bouwen", "typen",
//     "gamen", "niezen", "ademen",
// ];

socket.on('connect', function(socket){

});

//naam veranderen
const inputForm = document.getElementById("messageForm");
const inputField = document.getElementById("m");
console.log(inputForm);

inputForm.addEventListener('submit', inputText);

function inputText(event){
    // console.log(event);
    event.preventDefault();
    console.log(inputField.value);

    // verbsChanger(inputField.value);
    // const newMessage = verbsChanger(inputField.value);
    // console.log(newMessage);

    //emit stuurt naar de server
    socket.emit("chat message", inputField.value);

    //luistert naar de server (berichten)
    socket.on('chat message', function(msg){
        const messages = document.getElementById("messages");
        messages.insertAdjacentHTML("beforeend", `<li>${msg}</li>`);

        // $('#messages').append($('<li>').text(msg));
        });

    // socket.on('chat message', function(socket){

    // });
}

// function verbsChanger(lastMessage){
//     // console.log("Deze function doet het!");
//     //const lastMessage = document.getElementById('messages').lastChild;

//     // laatste bericht die is gestuurd (nog uit de chat halen)
//     //const lastMessage = "Vanaf vandaag ben ik gestopt met gamen";
//     console.log(lastMessage);

//     //bericht opsplitsen in een array
//     const splitLastMessage = lastMessage.split(" ");

//     //checken of er waardes overeen komen tussen 2 arrays
//     //https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
//     const intersection = splitLastMessage.filter(x => verbs.includes(x));
//     console.log("Dit woord is eruit gefilterd:", intersection);

    
//     //https://www.geeksforgeeks.org/check-if-an-array-is-empty-or-not-in-javascript/
//     if (Array.isArray(intersection) && intersection.length){ 

//         //random woord kiezen uit de array van werkwoorden
//         //https://stackoverflow.com/questions/1516695/js-math-random-for-array
//         const randomVerb = verbs[Math.floor(verbs.length * Math.random())];
//         console.log("een random werkwoord", randomVerb);

//         //Uitgekozen woord omzetten naar een string
//         const verbToString = intersection.toString();    
//         console.log("Dit woord is eruit gefilterd:", verbToString);

//         //De index van het uitgekozen woord achterhalen
//         const indexOfOldVerb = splitLastMessage.indexOf(verbToString);
//         console.log("index van het werkwoord in de oorspronkelijke zin", indexOfOldVerb);

//         //het nieuwe random woord op de plek zetten van het oude werkwoord doormiddel van een index nummer
//         const newArrayWithRandomVerb = splitLastMessage[indexOfOldVerb] = randomVerb;
//         console.log("oude werkwoord vervangen voor het nieuwe werkwoord:", newArrayWithRandomVerb);

//         //de array weer aan elkaar plakken zodat het een zin word
//         const messageToString = splitLastMessage.join(" "); 

//         console.log(newArrayWithRandomVerb);
//         console.log(splitLastMessage);
//         console.log(messageToString);


//         return messageToString;
//         //lastMessage.innerHTML = messageToString;

//     } else { 
//             output = false; 
//             console.log(output);
//     };
// };