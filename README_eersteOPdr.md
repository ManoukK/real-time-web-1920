# Chat app met een unieke feature
Met socket.io heb ik een chat app gemaakt. 

## De unieke feature
Mijn feature is dat als jij een bepaald werkwoord stuurt in de chat dat dit woord word vervangen voor een ander random werkwoord uit een array. Het leek mij vooral heel grappig omdat je dan ineens iets heel anders zegt dan dat je bedoeld. Als bijvoorbeeld typt ik "Ik ben zo van plan om even te gamen" dan kan je terug krijgen "Ik ben zo van plan om even te coderen". Ik heb hiervoor zelf een array gemaakt met werkwoorden waarna geluisterd kan worden.

Zinnen die leuk werken met deze feature:
- Ik ga straks met mijn vriend(in) lopen
- Wij gaan vanavond samen koken toch?
- Straks neem ik even pauze en ga ik lekker gamen
- De laatste tijd heb ik moeite met studeren
- Vanaf nu meten we thuis studeren van de HvA

#### De feature werkt als volgt:
1. De zin word van de client naar de server verzonden.
2. In de server word de zin losgebroken in een array met losse worden.
3. De array met de zin word vergeleken met de array met werkwoorden.
4. Het woord dat matched word eruit gehaald.
5. Als er dus een match is word de if state geactiveerd en dan word er een random woord uit de werkwoorden array gepakt.
6. Er word dan gekeken waar het oude werkwoord stond in de zinnen array. De index word onthouden.
7. Het nieuwe werkwoord word in de juiste index gezet van waar het oude werkwoord stond.
8. De array met de zin word weer aan elkaar geplakt zodat het weer een leesbare zin word. 
9. De zin word verstuurd naar de client, in een list item gezet en in de chat geplaatst. 

## Hoe heb ik socket.io gebruikt?
### Set user
Deze function wordt aangeroepen zodra iemand zijn username in de input heeft getypt en op submit heeft gedrukt. De value wordt van de client naar de server gestuurd en daar wordt de oude username (“onbekend”) overschreven met de nieuwe username. Uit deze function worden 2 verschillende berichten via de server gestuurd naar de chat. Een daarvan is een bericht naar jezelf met “SERVER: You've changed your name to ${userName}!“ Dit gebeurd door socket.emit. Het tweede bericht wat wordt verstuurd is “SERVER: User ${oldUsername} changed their name to ${userName}” 
Dit gebeurd met socket.broadcast.emit. Dit zijn gerichten die jijzelf als gebruiker niet kan zien maar andere wel. Op deze manier probeerde ik een mooie scheiding te maken voor beide partijen en dat het ook allemaal logisch klinkt voor iedereen. 

```js
socket.on('set user', function(id){
     const oldUsername = userName;
     userName = id;
     socket.emit('server message', `SERVER: You've changed your name to ${userName}!`);
     socket.broadcast.emit('server message', `SERVER: User ${oldUsername} changed their name to ${userName}`);
 })
```

### Chat message
Deze function wordt ook aangeroepen zodra iemand wat in de input heeft getypt en op submit heeft gedrukt. Het berichtje wordt naar de server gestuurd en daar wordt een gekeken of er werkwoorden overeenkomen en zo ja dan worden deze vervangen. Dit leg ik ook uit onder het kopje over mijn unieke feature. Daarna stuur ik de zin + de gebruikersnaam zodat je weet bij wie dit bericht hoort terug naar de client. Dit doe ik met io.emit want dit zorgt ervoor dat jij en andere in de server dit bericht kunnen zien. Het is dus voor iedereen die online is te lezen. Als het bericht weer terug naar de client is gestuurd dan zet ik het bericht in een list item in een unorder list. Dit doe ik met insertAdjacentHTML
Daarvoor moest ik wel nog aangeven dat het na de laatste list item komt te staan (beforeend) zodat het een logische volgorde krijgt. Je leest de berichten dan van oud naar nieuw.

client side
```js
function inputText(event){
    event.preventDefault();
    const inputField = document.getElementById("m");
    console.log(inputField.value);

    //emit stuurt naar de server
    socket.emit("chat message", inputField.value);

    //luistert naar de server (berichten)
    socket.on('chat message', function(msg){
        const messages = document.getElementById("messages");
        messages.insertAdjacentHTML("beforeend", `<li class="chatMSG">${msg}</li>`);
    });
}
```

server side
```js
 socket.on('chat message', function(msg){    
     const newMessage = verbsChanger(msg);
     io.emit('chat message', `${userName}: ${newMessage}`)
     console.log('message from user', `${userName}: ${newMessage}`);
 });
```

### Server message
Server berichten werken op de client hetzelfde als chat berichten. De berichten vanuit de server worden in een list item gezet en onder de list item geplaatst die als laatste is gestuurd. In de server.js heeft server message geen aparte function omdat je bij verschillende gebeurtenissen misschien wel een server message wilt sturen. 

Zo heb ik deze twee berichten voor als iemand voor het eerst online komt in de chat. Omdat je dit wel wilt melden maar niet als gewoon chat bericht wilt sturen staat er server voor en wordt het naar de client gestuurd en in de function van “server message” gezet. Zo kan ik ook in css onderscheid maken. 

```js
socket.on('server message', function(msg){
    const messages = document.getElementById("messages");
    messages.insertAdjacentHTML("beforeend", `<li class="serverMSG">${msg}</li>`);
});
```

Het eerste bericht wordt alleen gezien door diegene die net online komt. Het tweede bericht wordt gezien door alle mensen die al online zijn geweest. Je kan met io.emit hier 1 bericht van maken maar ik vond het juist leuk om dit zo te onderscheiden.
```js
socket.emit('server message', `SERVER: Welcome ${userName}!`);
socket.broadcast.emit('server message', `SERVER: ${userName} is now online!`);
```

Wat ik ook naar de server stuur zijn de bericht over het wijzigen van een username. Ook dit wil je niet als chatbericht sturen maar wel melden. 

Ook hier leek het mij leuk om twee verschillende berichten te sturen. Eentje naar de gebruiker zelf en eentje naar de rest van de chat app. Want jij hoeft zelf niet te weten hoe je eerst heette in het chat maar voor anderen is dat wel handige informatie. 

```js
 socket.emit('server message', `SERVER: You've changed your name to ${userName}!`);
 socket.broadcast.emit('server message', `SERVER: User ${oldUsername} changed their name to ${userName}`);

```

Wat ik ook via de server meld is of iemand offline gaat. Dit is ook wel handig om te weten voor als je met iemand aan het chatten bent.
```js
 socket.broadcast.emit('server message', `${userName} disconnected`)

```

### Disconnect
Zoals je hierboven al ziet stuur ik een bericht vanuit de server naar de app zodat iemand kan weten als een gebruiker offline gaat. Ik heb gekozen om hiervoor socket.broadcast.emit te gebruiken in plaats van io.emit want als jij zelf offline gaat kan je dit bericht niet meer zien en is het dus ook niet echt logisch als dit bericht ook naar jou wordt gestuurd terwijl je er niet meer bent. 

Uiteraard heb ik niet alles gebruikt van wat socket.io kan. Ik wil graag deze cheat sheet bewaren en gebruiken voor het volgende project: https://socket.io/docs/emit-cheatsheet/ (via Bas)

```js
 socket.on('disconnect', function(){
     socket.broadcast.emit('server message', `${userName} disconnected`)
     console.log(`user disconnected ${userName}`);
 });
```

## Bronnen 
- Server berichten en username dankzij Guido en het hoorcollege
- Basis socket.io tutorial: https://socket.io/get-started/chat/
- Mijn feature verbinden met de server en de chat dankzij Robin

## Nog te doen
- Bug oplossen dat teksten dubbel worden verstuurd.
- Fixen dat werkwoorden het ook doen als er een teken achter staat.
- CSS niet in de html zetten maar in een css bestand.
- Stijl anders en meer eigen maken.
- 
