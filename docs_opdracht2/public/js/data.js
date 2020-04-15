console.log("hoi");

getData();
async function getData(){
    // const cors = 'https://cors-anywhere.herokuapp.com/';
    // const endpoint = 'https://api.themoviedb.org/3/';
    // const key = 'd279459f07cba4cb7988fbc31b7aa0bd';
    // const movieID = '2121'

    // const url = `${cors}${endpoint}movie/${movieID}?api_key=${key}`;

    const randomPage = Math.floor((Math.random() * 10) +1);
    const listSortingSetting = 'popularity.desc'

    console.log(randomPage);

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=d279459f07cba4cb7988fbc31b7aa0bd&language=en-US&sort_by=${listSortingSetting}&include_adult=false&include_video=false&page=${randomPage}`

    console.log(url);

    const data = await fetch(url)
        .then(function(response) {
            console.log(response)
            return response.json();
        })
        .then(function(results) {
            console.log(results);
            return results.results;
        })
        .then(function(results) {
            tester(results);
        })
        .catch(function(err) {
            console.log(err);
        });

        return data;
}

// tester();
function tester(results) {

    const randomMovieIndex = Math.floor(Math.random() * 20);
    console.log("index nummer:", randomMovieIndex, results[randomMovieIndex]);

    const randomMovie = results[randomMovieIndex];

    const htmlMainPage = `
            <p>${randomMovie.title}</p>
            <img src="https://image.tmdb.org/t/p/w500/${randomMovie.poster_path}" alt="Movie poster of ${randomMovie.title}." class="moviePoster">
        `;
    const sectionField = document.getElementById('movielist');
    sectionField.insertAdjacentHTML('beforeend', htmlMainPage);

    // randomMovie.map(function(result, index) {
    //     //https://javascript.info/ifelse uitleg over "result = condition ? value1 : value2;"
    //     // dit is een verkorte versie van de if else statement. 
    //     // als de result.summaries een waarde heeft moet het deze waarde laten zien: result.summaries[0]
    //     // als het geen waarde bevat moet het de melding hebben 'Geen samenvatting'

    //     const htmlMainPage = `
    //         <p>${result.title}</p>
    //         <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="Movie poster of ${result.title}." class="moviePoster">
    //         `;
    //     const sectionField = document.getElementById('movielist');
    //     sectionField.insertAdjacentHTML('beforeend', htmlMainPage);
    // });

    // results.map(function(result, index) {
    //     //https://javascript.info/ifelse uitleg over "result = condition ? value1 : value2;"
    //     // dit is een verkorte versie van de if else statement. 
    //     // als de result.summaries een waarde heeft moet het deze waarde laten zien: result.summaries[0]
    //     // als het geen waarde bevat moet het de melding hebben 'Geen samenvatting'

    //     const htmlMainPage = `
    //         <p>${result.title}</p>
    //         <img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" alt="Movie poster of ${result.title}." class="moviePoster">
    //         `;
    //     const sectionField = document.getElementById('movielist');
    //     sectionField.insertAdjacentHTML('beforeend', htmlMainPage);
    // });
};