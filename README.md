# Chat app met een unieke feature
Met socket.io heb ik een chat app gemaakt. 

## De unieke feature
Mijn feature is dat als jij een bepaald werkwoord stuurt in de chat dat dit woord word vervangen voor een ander random werkwoord uit een array. Het leek mij vooral heel grappig omdat je dan ineens iets heel anders zegt dan dat je bedoeld. Als bijvoorbeeld typt ik "Ik ben zo van plan om even te gamen" dan kan je terug krijgen "Ik ben zo van plan om even te coderen". Ik heb hiervoor zelf een array gemaakt met werkwoorden waarna geluisterd kan worden.

#### De feature werkt alsvolgd:
1. De zin word van de client naar de server verzonden.
2. In de server word de zin losgebroken in een array met losse worden.
3. De array met de zin word vergeleken met de array met werkwoorden.
4. Het woord dat matched word eruit gehaald.
5. Als er dus een match is word de if state geactiveerd en dan word er een random woord uit de werkwoorden array gepakt.
6. Er word dan gekeken waar het oude werkwoord stond in de zinnen array. De index word onthouden.
7. Het nieuwe werkwoord word in de juiste index gezet van waar het oude werkwoord stond.
8. De array met de zin word weer aan elkaar geplakt zodat het weer een leesbare zin word. 
9. De zin word verstuurd naar de client, in een list item gezet en in de chat geplaatst. 

## (?)

## Bronnen 
- Server berichten en username dankzij Guido en het hoorcollege
- Basis socket.io tutorial: https://socket.io/get-started/chat/
- Mijn feature verbinden met de server en de chat dankzij Robin

## Nog te doen
- Bug oplossen dat teksten dubbel worden verstuurd.
- Fixen dat werkwoorden het ook doen als er een teken achter staat.
- CSS niet in de html zetten maar in een css bestand.
- Stijl anders maken, meer eigen maken.
- 
