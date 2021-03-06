# Een real time teken spel
### Inhoudsopgave
* [Opdracht](#Opdracht)
* [Concept](#Concept)
* [Data life cycle](#Data-life-cycle)
* [Installatie](#Installatie)
* [API en de data](#API-en-de-data)
* [Socket events](#Socket-events)
* [Features](#Features)
* [Bronnen](#Bronnen)
* [Credits](#Credits)

### Opdracht
Het is de bedoeling dat we een applicatie maken met real time features. Dit kan je doen via socket.io. Je maakt gebruik van een externe dataset van een api en je kan ook de gebruikers de database laten vullen met data. De api hoeft zelf niet per se real time te zijn, als dit niet het geval is moet je ervoor zorgen dat je op een andere manier real time features laat zien. 

Het is ook de bedoeling dat je ervoor zorgt dat elke bezoeker/gebruiker content krijgt die hij/zij nodig heeft. Dit is voor elke gebruiker weer anders.

#### Mijn uiteindelijke website
![Schermafbeelding 2020-05-05 om 15 42 37](https://user-images.githubusercontent.com/45541885/81073536-10955380-8ee8-11ea-93ea-514390642094.png)

Als je meer schermen wilt zien zonder de website te bezoeken ga dan hier heen: https://github.com/ManoukK/real-time-web-1920/wiki/Alle-pagina's-van-de-site

### Concept
Mijn concept is een game waarbij de ene speler een film krijgt die hij moet tekenen waarna speler 2 moet raden welke film speler 1 heeft getekend. Op deze manier kunnen spelers punten verdienen. Komen er meer spelers bij dan kunnen zij ook de film raden. 

Iedereen kan in de chat de film raden. Elke ronde duurt 1 minuut (als ik merk dat het te kort is word dit langer) In die 1 minuut moet de tekenaar tekenen en de andere raden. Je kan in de chat raden door gewoon de titels van de films te typen. Als jij het goede antwoord hebt word het bericht onzichtbaar voor de anderen en krijgt iedereen een melding dat jij het goed hebt. Wat er getekend wordt krijgt iedereen live te zien zodat je gelijk kan raden als je zou willen. Na 1 minuut start de nieuwe ronde en worden de punten van de vorige ronde geupdate. 

De punten had ik alsvolgd in gedachte: 
- Eerste speler die het goed raad: 3 punten
- Tweede speler die het goed raad: 2 punten
- Derde speler die het goed raad: 1
- Vierde speler of hoger die het goed raad: 0 punten
- Speler waarvan zijn tekening is geraden: 2 punten
- Speler waarvan zijn tekening niet is geraden: 0 punten 
- Speler die het niet raad: 0 punten

Als je met z’n tweeën speelt dan is de rol van de tekenaar en rader steeds om en om. Als je met drie mensen of meer speelt dan gaat het een rijtje af. Bijvoorbeeld dit is de volgorde nu:
- Piet
- Nelly
- Harm
- Annie

In deze situatie zijn er 3 mensen die de film moeten raden en 1 iemand die moet tekenen. Piet begint met tekenen. In de volgende ronde moet Nelly tekenen dan Harm en dan Annie. Als iedereen is geweest begint dit weer opnieuw van boven naar beneden. Deze volgorde wordt gebaseerd op wie er als eerste joint. Elke speler krijgt ook zijn eigen kleur die terugkomt in de tekeningen en vormgeving van de game. Zo kan je sneller spelers onderscheiden van elkaar en makkelijk je eigen kleur onthouden en herkennen. 

De punten worden in beeld bijgehouden zodat je kan zien hoeveel jij en anderen hebben en of je nog net even meer je best moet doen om te winnen. Iedereen krijgt ook een bericht als iemand het goed of fout heeft geraden zodat je van anderen ook weet hoe het gaat. 

Elke game duurt 20 rondes. Uit de moviedb api haal ik een random pagina op met 20 films. De pagina’s zijn random maar wel met bekende films. Dat komt omdat ik heb gesorteerd op populariteit en dan tussen de 1 en de 20 pagina’s een random filmlijst pak. De tekenaar krijgt ook de titel en de cover van de film te zien zodat hij weet welke film het is. De anderen krijgen een afbeelding met een vraagteken erin te zien. Ik twijfel of ik ook de beschrijving van de film wil laten zien, misschien wordt het dan wel “te” makkelijk?

Als de game is beëindigd krijgen de spelers een overzicht te zien van alle films, tekeningen, punten en hoe hoog iedereen heeft gescoord. 

Uiteindelijk wil ik ook een feature toevoegen waarbij je kan kiezen of je een game wilt starten over films of over series want de moviedb api bevat ook series. Zo krijgen mensen meer keuze en vrijheid in de game die ze willen spelen. Ook wil ik later als feature toevoegen dat mensen een game kunnen starten met films of series uit een bepaalde genre. 

### Data life cycle
![defdefDLC](https://user-images.githubusercontent.com/45541885/81075592-da0d0800-8eea-11ea-8a5c-479a1b8379b7.png)

### Installatie
Mijn project kan je clonen en downloaden via de groene knop die rechts bovenin staat van github. Je hebt alleen opdracht 2 nodig. Als je dat hebt gedaan moet je nog de dependencies installeren die ik heb gebruikt voor dit project. Dat kan je doen door het volgende in de terminal te typen: 

Zorg er wel voor dat je in het juiste project zit in de terminal. 

```
npm init
```
En daarna typt je dit stukje in de terminal:
```
npm install
```

Dit zijn de depencendies die worden geïnstalleerd zodra je dit hebt gedaan:
- nodejs
- nodemon
- socket.io
- node-fetch
- express
- dotenv

De localhost die ik heb gebruikt heeft nummer 2000. Nu kan je de applicatie opstarten met:
```
npm start
```

en kan je naar localhost:2000 om het “live” te zien. Als je zelf iets aanpast in de code start de server automatisch opnieuw op dankzij nodemon. Dan moet je alleen nog even de browser refreshen waar de applicatie in staat en dan zie je de aanpassingen die je hebt gemaakt. 

### API en de data
De api die ik gebruik is movieDB: https://developers.themoviedb.org/3/getting-started/introduction Dit is een database met alle films en tv series die er zijn en die nog moeten komen. Voor dit project gebruik ik de data van films en series. Als feature heb ik namelijk dat de gebruiker zelf kan kiezen of hij een game wilt starten over films of series. De films en seriesuit de api bevatten ontzettend veel data. 

#### Data van de films uit de api
![Schermafbeelding 2020-04-26 om 18 37 55](https://user-images.githubusercontent.com/45541885/80314046-22dc0700-87ef-11ea-91b0-c813b1956f9a.png)

#### Data van de series uit de api 
![Schermafbeelding 2020-05-05 om 15 17 01](https://user-images.githubusercontent.com/45541885/81076781-5e13bf80-8eec-11ea-81d6-680e12457050.png)

er zitten kleine verschillen tussen de data van de films en series. Een daarvan is dat de titel van de serie onder name staat en bij de films staat het onder title. Dit zorgt ervoor dat ik 2 losse fetches moest implementeren in mijn code omdat ik anders niet de juiste titels van series en films in 1 keer kon pakken. Het fetchen word pas gedaan zodra de eerste gebruiker die op de site komt een keuze heeft gemaakt tussen een game met films of met series. Aan de hand van die keuze word 1 fetch uitgevoerd en de ander niet. 

Niet alle data heb ik nodig uit die api dus in de fetch heb ik het al opgeschoont. Hierdoor wordt de api wat fijner te gebruiken tijdens het coderen. Uiteindelijk wil ik alleen gebruik maken van de coverfoto van de film of serie en de titel. De id van de films/series vond ik ook handig om te hebben want zo kan ik ze altijd van elkaar onderscheiden als dat nodig is. 

#### Het opschonen van film data
```js
.then(results => {
          return results.map(results => {
              return {
                  title: results.title,
                  image: results.poster_path,
                  id: results.id,
              }
            })
          })
```

#### Het opschonen van serie data
```js
.then(results => {
          return results.map(results => {
              return {
                  title: results.name,
                  image: results.poster_path,
                  id: results.id,
              }
            })
          })
```
Beide krijgen dezelfde benamen voor afbeeldingen, titels en id's zodat het in de rest van de code werkt voor beide partijen. 

![Schermafbeelding 2020-05-05 om 15 29 06](https://user-images.githubusercontent.com/45541885/81077266-09bd0f80-8eed-11ea-9cbc-acb6e42dc3a9.png)

De link naar de coverfoto van de films/series werken net even wat anders. In de api staat wel een link naar de cover toe alleen daar moet je nog iets voorzetten zodat het goed linkt. Je moet namelijk dit stukje ervoor zetten:
```
https://image.tmdb.org/t/p/w500
```
 Dus wat je nu zal krijgen is dat je in de api de cover opvraagt en als je het als afbeelding in je website wilt zetten komt het er zo uit te zien:
 ```
https://image.tmdb.org/t/p/w500${randomMovie.poster_path}
```
Of op deze manier:
```
https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg
```
Als je nu de laatste link kopieert in een nieuw tabblad krijg je de cover te zien van de matrix en dit wil je ook zo hebben op je website. 


### Socket events 
<details>
<summary>User vult zijn username in</summary>
          
#### socket.on('start game', function(id)
          
Zodra een gebruiker op de website komt en zijn username heeft ingevuld wordt deze functie uitgevoerd. Er wordt gekeken of de value van de username niet leeg is, als dat wel zo is wordt de username gezet naar ANONYMOUS. Er wordt ook gekeken of de username niet al bestaat. Stel er is al een username genaamt Piet dan wordt de tweede username die Piet heeft Piet + het nummer van de lengte van de array met gebruikersnamen die meedoen aan de game. Ik wilde er eerst een random getal achter zetten maar ook hier kan het gebeuren dat 2 mensen met dezelfde naam dezelfde nummer krijgen. 

Elke user die meedoet aan de game wordt in een array geplaatst waar de game resultaten en scores bij worden gehouden. Dit ziet er zo uit voor elke user: 
```js
gameResults[userName] = {  
       userId: socket.id,
       wins: 0,
       drawn: [],
     };
```

De eerste speler die in de game komt heeft de rol van het tekenen en hij/zij moet bepalen of de game gaat om films of series. Deze featere leg ik in een apart stukje uit. Degene die mag tekenen krijgt de titel en de cover van de film te zien met de opdracht dat diegene het moet tekenen. Ondertussen als er meerdere users binnenkomen krijgen zij het bericht dat zij moeten raden. In code zien die verschillen er zo uit: 

```js
 if(connectedUsers.length === 1){
        const playerDrawId = Object.values(gameResults)[drawingRole].userId;
        io.emit;
        io.to(playerDrawId).emit('choose mode');
      }
      socket.emit('server message', `Welcome ${userName}!`);
      socket.broadcast.emit('server message', `${userName} joined the game!`);
```

Dankzij dit stukje code:
```js
io.to(playerDrawId).emit('choose mode');
```
Kan ik ervoor zorgen dat alleen de eerst verbonden user mag kiezen tussen game of serie. Hiervoor moet je wel de id gebruiken van de users die socket zelf genereert voor jou. Dit werkt bijvoorbeeld niet met een username. Dat heb ik gedaan in de gameResults die je hierboven al zag met socket.id. 

Daarna word er een fetch naar de api gedaan, wat ik in een ander stukje ga uitleggen en word de data doorgestuurd naar showTitle waarin ik ervoor zorg dat de data van de film of serie voor die ronde word doorgestuurd naar de juiste client.In de functie showTitle heb ik dit stukje code erin die er daadwerkelijk voor zorgt dat de film data bij diegene komt die mag tekenen. 

```js
io.to(playerDrawId).emit('player role', currantMovieTitle, currantMovieCover);
```

Om het verschil te tonen tussen het tekenen en het raden heb ik in de html een section gemaakt met content erin voor als je de film/serie moet raden. Zodra jij degene bent die moet tekenen word die section verborgen en komt deze content in beeld. Alleen jij als tekenaar ziet dit omdat dit word verstuurd naar de user id van socket. 

```js
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
```
</details>

<details>
<summary>User laten kiezen tussen game mode films of series</summary>

#### socket.on('game mode', async function(gameMode) en socket.on('choose mode', function()
Game mode wordt geactiveerd nadat de allereerste gebruiker op de website komt. De eerste gebruiker heeft, nadat hij/zij zijn username heeft ingevuld, de keuze om de game te beginnen met films of series. Dit kan alleen de eerste gebruiker doen dankzij het io.to event van socket. Dit heb ik in een ander stukje beter uitgelegd. 

Zo ziet dat stukje code eruit op de server. Deze code staat in socket.on('start game', function(id)

```js
   if(connectedUsers.length === 1){
       const playerDrawId = Object.values(gameResults)[drawingRole].userId;
       io.emit;
       io.to(playerDrawId).emit('choose mode');
     }

```

De user heeft nu twee knoppen in beeld waaruit hij/zij kan kiezen. Beide knoppen sturen iets naar de function “game mode”. Dankzij die waarde kan ik in de server bepalen welke api fetch er gedaan moet worden. 

```js
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

```

Zodra er een keuze is gemaakt wordt het doorgestuurd naar de server in de ‘game mode’ function. Dankzij de tekst die ik meestuur vanaf de client kan de server met een if statement zien of de user films of series wilt hebben. Zo kan de juiste api fetch worden gedaan. Er moeten twee verschillende api fetches worden gedaan omdat de benamingen in de api voor films en series anders zijn. Hierover kan je meer lezen onder het kopje api/data

```js
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

```
</details>

<details>
<summary>User tekent een film na</summary>
         
#### socket.on('mouseMoving', function(data)
      
Om ervoor te zorgen dat het tekenen live te zien is moest ik de data die wordt gemaakt tijdens het tekenen doorsturen naar de server en die data weer doorsturen naar andere spelers. 

Vanuit de client stuurde ik de data naar de server. Dit zit er in de data die ik mee stuur: 
```js
 
       let data = {
           mouseValue,
           x: e.offsetX,
           y: e.offsetY
       }
```
De mouseValue had ik nodig om later op de server te kunnen zien of de muis waarmee er getekend wordt start of stopt met tekenen of dat het bezig is. 

Vervolgens stuur ik deze data naar de server. Dat doe ik op 2 punten. Wanneer een gebruiker bezig is met tekenen (dus de muis ingedrukt heeft en lijnen maakt op het canvas) en wanneer de gebruiker is gestopt met tekenen (dus wanneer de muis los gelaten is). Dit zit in 2 aparte functions op de client. In de stopInteract en in de putPoint function. 

```
socket.emit('mouseMoving', data);
```

Vervolgens wordt de ‘mouseMoving’ functie op de server aangeroepen. Daarin word met een switch gekeken in welke state het tekenen is (dat zit in de data.mouseValue). Voor elke state is er een case en in die case wordt de data van het tekenen doorgestuurd naar de andere spelers. Dat ziet er in de code zo uit: 
```js
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
```

Als deze data weer naar de client wordt gestuurd worden daar de benodigde function aangeroepen.

```js
socket.on('mouseMoving', whileDragging);
socket.on('mouseStop', stop);
socket.on('mouseStart', start);
``` 

Op deze manier worden de tekeningen doorgestuurd naar de andere users. Het is eigenlijk meer dat de data van het tekenen wordt doorgestuurd naar de andere users en dat het in hun canvas opnieuw wordt getekend. 

Zodra de ronde voorbij is word het canvas geleegt voor de nieuwe tekenaar. Alle pixels binnen het canvas worden transarant zwart gemaakt. Officieel zouden ze er nog staan maar dat is voor de users niet meer te zien. 

```js
    context.clearRect(0, 0, canvas.width, canvas.height);
```

</details>

<details>
<summary>User verlaat de game</summary>

####  socket.on('disconnect', function()

Zodra er een user de game verlaat gebeuren er een aantal dingen. Allereerst wordt er een server bericht gestuurd naar de rest van de users in de game om hun op de hoogte te houden. 
```js
socket.broadcast.emit('server message', `${userName} has left the game!`);
```

Vervolgens verwijder ik ook de user uit de lijst van connectedUsers. Hierin houd ik bij wie er allemaal online zijn en als iemand de game verlaat wil ik die er ook niet meer in hebben. Hiervoor moet ik eerst de juiste index weten van de user zodat ik niet per ongeluk iemand anders eruit kick. Vervolgens gaat de code naar de if statement. Dit gaat door zodra de userPosition groter of gelijk is aan 0. Dit moest omdat socket ook -1 waardes doorstuurt. Dat is denk ik om te checken of iemand nog aanwezig is en -1 duidt aan dat het zo is. Als het dus geen -1 is word de user verwijderd uit de connectedUsers array en word de user ook verwijderd uit de meta data die de hele game bijgehouden wordt. 

```js
   let userPosition = connectedUsers.indexOf(userName);
   if (userPosition >= 0){
     connectedUsers.splice(userPosition, 1);
 
     delete gameResults[userName];
   }
```

Als dat gebeurd is wordt ook het scorebord geupdate zodat ook daar de user niet meer in staat. Dat gebeurd met dit stukje code:

```js
io.emit('score board', gameResults);
```
</details>

<details>
<summary>Spelers proberen de film te raden</summary>
          
#### socket.on('chat message', function)
In de chat functie wordt bij elk bericht die wordt verstuurd gekeken of daar het antwoord tussen zit van de film/serie titel. Eerst wordt het bericht en de titel van de film/serie omgezet naar hoofdletters zodat daar geen problemen in kunnen zitten. Vervolgens word er met deze if statement gekeken of de username van degene die raad niet overeenkomt met degene die aan het tekenen is. Dan moet ook het bericht overeenkomen met de titel.
```js
 if(drawPlayer !== userName && msgUpper === upperCaseTitle)
```

Als deze twee allebei true zijn krijgt degene die raad 1 punt en komt de titel van de film in een array te staan van degene die het moest tekenen. 

```js
    let setPointGuesser = gameResults[userName].wins++;
      const setTitle = gameResults[drawPlayer].drawn;
      setTitle.push(currantTitle);
```

Zodra dat is gebeurd komt er een pop-up van de geraden titel en door wie het is geraden. Dat word getriggerd dankzij deze io.emit

```js
io.emit('player guessed movie', currantTitle, currantCover, userName);
```
Client side ziet dat er dan zo uit. Een aantal html elementen worden verborgen of getoont. Zo krijg je het pop-up effect. Eerst word ook de content in de pop-up geleegt zodat je niet de titels van de vorige rondes erin ziet staan. Hier word ook het canvas weer schoon gemaakt en er komt een event listener op de knop waarmee je weer verder kan gaan. 

```js
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
```


Dan heb je ook nog de kans dat niemand de titel goed weet te raden. Daarvoor had ik bedacht dat er met een else if word gekeken of de username overeenkomt met de naam van de tekenaar en of de titel overeenkomt met het chat bericht. Als dat zo is krijgt niemand een punt en word de ronde afgelopen. 

```js
else if (drawPlayer === userName && msgUpper === upperCaseTitle)
```

In dit statement word ook hier de pop-up getriggert. Alleen word de username vervangen voor Nobody. De rest van de content blijft wel hetzelfde want het blijft wel leuk om de titel en cover te laten zien. 

```js
io.emit('player guessed movie', currantTitle, currantCover, `Nobody`);
```

Als een van de twee statements false is wordt het bericht gewoon verzonden naar de andere users en jijzelf. 

```js
       io.emit('chat message', `${userName}: ${msg}`, randomColor);
```

</details>

<details>
<summary>Chat messages</summary>
          
#### io.emit('chat message', `${userName}: ${msg}`, randomColor);

Chatberichten worden van de client naar de server gestuurd. Daar word gecheckt of het antwoord (de titel van de film) er in zit en zo niet dan wordt het bericht gewoon verstuurd naar iedereen. 

Iedereen heeft zijn eigen kleur als hij/zij meedoet aan de game. Die wordt al gegenereerd zodra je op de website komt. Deze kleur wordt onder andere gebruikt voor bij het tekenen. Dan herkennen mensen sneller en beter wie welke rol heeft. Ook wordt deze kleur meegestuurd met de chatberichten. Dat is de randomColor die je misschien al in de titel zag. 

```js
io.emit('chat message', `${userName}: ${msg}`, randomColor);
```

In de client wordt er een border omheen geplaatst met die kleur. Deze kleur krijgt iedereen te zien ook jij als verstuurder van het bericht. 
```js
socket.on('chat message', function(msg, randomColor, gameResults){
   console.log(gameResults)
   const messages = document.getElementById("messages");
   messages.insertAdjacentHTML("beforeend", `<li class="chatMSG" style="border: 5px solid ${randomColor};" >${msg}</li>`)
});
```
</details>

<details>
<summary>Server mesages</summary>

#### socket.emit('server message', `Welcome ${userName}!`);

Hier zijn alle server messages op een rij die ik gebruik. Deze zitten op verschillende plekken in mijn code maar om het overzichtelijk te houden heb ik ze even onder elkaar gezet. 

Als iemand inlogt krijgt diegene in de chat een welkomstberichtje. Andere zien weer een ander bericht met andere tekst erin. Ik vond het leuk om dit zo te doen omdat je het wat persoonlijker kan maken voor degene die net binnen is gekomen.

Zodra iemand de titel goed heeft geraden krijg je dat ook in de chat te zien. In principe is dat overbodig omdat iedereen ook een pop-up ziet met de film en wie het heeft geraden. Het bericht in de chat kun je dan niet meer lezen. Alleen als de pop-up weer weg is, willen gebruikers het misschien nog terug lezen of nog even weten welke film het nu was. Daarom heb ik alsnog ervoor gekozen om ook dit naar de client te sturen ook al hebben ze er niet direct wat aan. 

Daarna stuur ik ook een bericht als een user de game verlaat. Dit stuur ik naar iedereen in de game behalve degene die weggaat want hij/zij zal dat bericht niet meer lezen en dan is het ook niet zo handig of nodig om dat bericht ook naar hem/haar te sturen. 

```js
socket.emit('server message', `Welcome ${userName}!`);
socket.broadcast.emit('server message', `${userName} joined the game!`);
io.emit('server message', `${userName} guessed the movie! It was: ${upperCaseTitle}`);
socket.broadcast.emit('server message', `${userName} has left the game!`);
```
</details>

<details>
<summary>Persoonlijke berichten sturen naar 1 gebruiker</summary>

#### io.to(playerDrawId).emit('player role', currantTitle, currantCover);
Dankzij io.to kan ik berichten sturen die voor 1 user bedoelt zijn. Hierbij moet je wel gebruik maken van de id die socket zelf meestuurt zodra er een user online komt. Ik heb die op deze manier opgeslagen in de meta data van de game. 

```js
  gameResults[userName] = { 	
        userId: socket.id,
        wins: 0,
        drawn: [],
      };
```

In het voorbeeld in de titel: io.to(playerDrawId).emit('player role', currantTitle, currantCover); Stuur ik hier de data door naar de gebruiker die aan de beurd is om te tekenen. Zo kon ik onderscheid maken tussen de rollen van het tekenen en het raden en kon ik er ook voor zorgen dat users die moeten raden niet per ongeluk die informatie te zien krijgen. 

De io.to functie van socket heb ik ook gebruikt voor het kiezen van een modus van de game, dus of iedereen films of series moeten raden en tekenen. Dat stukje code ziet er zo uit. Dit word eenmalig verzonden, aan het begin van de game. Op deze manier heb ik het probleem getackeld voor als er meerdere mensen de game modus konden kiezen. In dit geval is de eerste die op de website komt ook gelijk degene die begint met tekenen daarom kon ik het op deze manier (playerDrawId) makkeijk aanspreken.

```js
io.to(playerDrawId).emit('choose mode');
```

</details>

<details>
<summary>Scorebord bijhouden</summary>

#### io.emit('score board', gameResults);
In de website wilde ik ook graag een scorebord bijhouden voor alle gebruikers. Op 3 verschillende punten emit/stuur ik de gameResults naar de client die vanuit daar de scores update. Ik update de score wanneer iemand op de website komt, wanneer iemand de website/game verlaat en wanneer de game naar de volgende ronde gaat. 

Vanuit deze drie punten op de server stuur ik dus de scores door naar de client. Daar word deze functie aangeroepen:

```js
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
```

Eerst haal ik alle content leeg die binnen het scorebord element zit. Zo zorg ik ervoor dat er geen dubbele gegevens komen te staan. vervolgens map ik over de array heen en pak ik daaruit de usernamen en de score die daar bij hoort. Omdat de array (gameResults) bestaat uit objecten moest ik daarvoor Object.entries gebruiken.

</details>




### Features
- [x] Voordat de game start spelers laten kiezen tussen films of series.
- [ ] Voordat de game start spelers laten kiezen tussen genres.
- [ ] Puntentelling wie het snelst raad krijgt meer punten en wie als laatste raad het minst. (zie concept)
- [ ] Timer toevoegen van hoelang elke ronde duurt en zodra de timer af gaat begint automatisch de volgende ronde. 
- [ ] Gebruikers een account laten aanmaken zodat de hun scores van alle games worden bijhouden. Je ziet dan in totaal hoeveel films je moest raden en hoeveel je daarvan goed hebt geraden en je ziet hoeveel tekeningen je hebt gemaakt. 
- [ ] De benoemde data van het punt hierboven opslaan in een database.
- [ ] Benamingen in code generiek maken in plaats van movieTitles moet het titles worden.
- [ ] Eind pagina met eind score.
- [ ] Rooms aanmaken zodat er meerdere games tegelijkertijd gespeelt kunnen worden.
- [ ] Fixen dat alleen de speler die moet tekenen kan tekenen in het canvas.

### Bronnen
- Cheat sheet van socket.io: https://socket.io/docs/emit-cheatsheet/
- Hoe je de user id krijgt van socket: https://stackoverflow.com/questions/43464617/how-to-get-user-id-using-username-in-socket-io
- .env met behulp van dit filmpje: https://www.youtube.com/watch?v=zDup0I2VGmk
- Hoe je een random kleur genereerd: https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
- Hoe je usernames kan bijhouden in een array: https://stackoverflow.com/questions/18335028/socket-io-how-to-prompt-for-username-and-save-the-username-in-an-array
- Hoe je een if statement schrijft waarbij 2 waardes true moeten zijn: https://stackoverflow.com/questions/8710442/how-to-specify-multiple-conditions-in-an-if-statement-in-javascript
- Hoe je met de muis kan tekenen in canvas: https://www.youtube.com/watch?v=m4sioSqlXhQ en https://www.youtube.com/watch?v=XbS2bLMzcrk
- Het tekenen real time maken: https://www.youtube.com/watch?v=i6eP1Lw4gZk
- Hoe je een html element leeg maakt in javascript: https://stackoverflow.com/questions/5744233/how-to-empty-the-content-of-a-div
- Value van een input leeg maken zodra iemand een berichtje heeft verstuurd: https://www.w3schools.com/jsref/met_form_reset.asp
- Hoe je een object uit een array kan verwijderen: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
- Hoe je kan mappen door array met objecten heen: https://stackoverflow.com/questions/48747444/object-entries-with-foreach-to-map-array-of-objects-returns-undefined-except-whe

### Credits
- Tekenen in een canvas: https://www.youtube.com/watch?v=m4sioSqlXhQ en https://www.youtube.com/watch?v=XbS2bLMzcrk
- Robin had me geholpen met het opslaan van user data op de server. 
- Coen had feedback gegeven op mijn data life chart
- et tekenen real time maken: https://www.youtube.com/watch?v=i6eP1Lw4gZk
- .env met behulp van dit filmpje: https://www.youtube.com/watch?v=zDup0I2VGmk
- Maikel heeft me geholpen met de switch bij het tekenen zodat er gekeken word in welke staat de tekenaar is met zijn muis. 
- Hoe je een html element leeg maakt in javascript: https://stackoverflow.com/questions/5744233/how-to-empty-the-content-of-a-div
