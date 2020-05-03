# Een real time teken spel
### Inhoudsopgave

### Opdracht
Het is de bedoeling dat we een applicatie maken met real time features. Dit kan je doen via socket.io. Je maakt gebruik van een externe dataset van een api en je kan ook de gebruikers de database laten vullen met data. De api hoeft zelf niet per se real time te zijn, als dit niet het geval is moet je ervoor zorgen dat je op een andere manier real time features laat zien. 

Het is ook de bedoeling dat je ervoor zorgt dat elke bezoeker/gebruiker content krijgt die hij/zij nodig heeft. Dit is voor elke gebruiker weer anders.

### Concept
Mijn concept is een game waarbij de ene speler een film krijgt die hij moet tekenen waarna speler 2 moet raden welke film speler 1 heeft getekend. Op deze manier kunnen spelers punten verdienen. Komen er meer spelers bij dan kunnen zij ook de film raden. 

Iedereen kan in de chat de film raden. Elke ronde duurt 1 minuut (als ik merk dat het te kort is word dit langer) In die 1 minuut moet de tekenaar tekenen en de andere raden. Je kan in de chat raden door gewoon de titels van de films te typen. Als jij het goede antwoord hebt word het bericht onzichtbaar voor de anderen en krijgt iedereen een melding dat jij het goed hebt. Wat er getekend wordt krijgt iedereen live te zien zodat je gelijk kan raden als je zou willen. Na 1 minuut start de nieuwe ronde en worden de punten van de vorige ronde geupdate. 

De punten werken als volgt: Als jij als film-rader de film goed raad krijg jij 2 punten en de tekenaar 1 punt. Als jij het niet raad krijgt niemand een punt. Als de tekenaar de film niet weet die hij moet tekenen en dus skipt dan krijgt degene die moet raden 1 punt. Als je met drie of meer spelers bent en 1 iemand raad het goed dan krijgt de tekenaar alsnog 1 punt. Dit geldt hetzelfde voor als meerdere mensen het goed raden. De tekenaar krijgt dan nog steeds 1 punt. 

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

### Data flow
![defDLC](https://user-images.githubusercontent.com/45541885/80913494-48b06100-8d45-11ea-9a03-3efc258a113f.png)

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

### Data/API
De api die ik gebruik is movieDB: https://developers.themoviedb.org/3/getting-started/introduction Dit is een database met alle films en tv series die er zijn en die nog moeten komen. Voor dit project gebruik ik tot nu toe alleen nog de films. Als feature wil ik nog toevoegen dat de gebruiker zelf kan kiezen of hij een game wilt starten over films of series. De films uit de api bevatten ontzettend veel data. 

![Schermafbeelding 2020-04-26 om 18 37 55](https://user-images.githubusercontent.com/45541885/80314046-22dc0700-87ef-11ea-91b0-c813b1956f9a.png)

Niet alle data heb ik nodig uit die api dus in de fetch heb ik het al opgeschoont. Hierdoor wordt de api wat fijner te gebruiken tijdens het coderen. Uiteindelijk wil ik alleen gebruik maken van de coverfoto van de film en de titel. De id van de films vond ik ook handig om te hebben want zo kan ik ze altijd van elkaar onderscheiden als dat nodig is. 

```js
.then(results => {
          return results.map(results => {
              return {
                  movieTitle: results.title,
                  movieImage: results.poster_path,
                  movieID: results.id,
              }
            })
          })
```

![Schermafbeelding 2020-05-03 om 11 56 47](https://user-images.githubusercontent.com/45541885/80913803-beb5c780-8d47-11ea-974f-fa37027263d0.png)

De link naar de coverfoto van de films werken net even wat anders. In de api staat wel een link naar de cover toe alleen daar moet je nog iets voorzetten zodat het goed linkt. Je moet namelijk dit stukje ervoor zetten:
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

### Features
- [ ] Voordat de game start spelers laten kiezen tussen films of series.
- [ ] Voordat de game start spelers laten kiezen tussen genres.
- [ ] Puntentelling wie het snelst raad krijgt meer punten en wie als laatste raad het minst.
- [ ] Timer toevoegen van hoelang elke ronde duurt en zodra de timer af gaat begint automatisch de volgende ronde. 
- [ ] Gebruikers een account laten aanmaken zodat de hun scores van alle games worden bijhouden. Je ziet dan in totaal hoeveel films je moest raden en hoeveel je daarvan goed hebt geraden en je ziet hoeveel tekeningen je hebt gemaakt. 
- [ ] De benoemde data van het punt hierboven opslaan in een database.

### Bronnen
- Cheat sheet van socket.io: https://socket.io/docs/emit-cheatsheet/
- Hoe je de user id krijgt van socket: https://stackoverflow.com/questions/43464617/how-to-get-user-id-using-username-in-socket-io
- .env met behulp van dit filmpje: https://www.youtube.com/watch?v=zDup0I2VGmk
- Hoe je een random kleur genereerd: https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
- Hoe je usernames kan bijhouden in een array: https://stackoverflow.com/questions/18335028/socket-io-how-to-prompt-for-username-and-save-the-username-in-an-array
- Hoe je een if statement schrijft waarbij 2 waardes true moeten zijn: https://stackoverflow.com/questions/8710442/how-to-specify-multiple-conditions-in-an-if-statement-in-javascript
- Hoe je met de muis kan tekenen in canvas: https://www.youtube.com/watch?v=m4sioSqlXhQ en https://www.youtube.com/watch?v=XbS2bLMzcrk
- Het tekenen real time maken: https://www.youtube.com/watch?v=i6eP1Lw4gZk

### Credits
- Tekenen in een canvas: https://www.youtube.com/watch?v=m4sioSqlXhQ en https://www.youtube.com/watch?v=XbS2bLMzcrk
- Robin had me geholpen met het opslaan van user data op de server. 
- Coen had feedback gegeven op mijn data life chart
- et tekenen real time maken: https://www.youtube.com/watch?v=i6eP1Lw4gZk
- .env met behulp van dit filmpje: https://www.youtube.com/watch?v=zDup0I2VGmk
