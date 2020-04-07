$(function () {
    const socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  });

const socket = io();

console.log("hi test");

const verbs = [
    "beginnen",
    "denken",
    "douchen",
    "eten",
    "lopen",
    "studeren",
    "coderen",
    "vallen",
    "vliegen",
    "werken",
    "zwemmen",
    "reizen",
    "winnen",
    "koken",
    "springen",
    "sturen",
    "spelen",
    "slapen",
    "praten",
    "lezen",
    "wassen",
    "bijten",
    "bouwen",
    "typen",
];

const test1 = verbs.includes("hi");
const test2 = verbs.includes("typen");

console.log("Deze array bevat het woord hoi", test1);
console.log("Deze array bevat het woord typen", test2);


socket.on('connect', function(socket){
    console.log("connection to server made");
    verbsChanger();
});

function verbsChanger(){
    console.log("Deze function doet het!");
    const lastMessage = document.getElementById('messages').lastChild;
    console.log(lastMessage);
}