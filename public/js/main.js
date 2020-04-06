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

socket.on('connect', function(){
    console.log("connection to server made");
  });

function verbsChanger(){
    console.log("Deze function doet het!");
    var lastMessage = document.getElementById('messages').lastChild;
    console.log(lastMessage);
}