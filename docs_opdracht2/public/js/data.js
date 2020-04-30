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
        .then(results => {
            // console.log("dataset test", results)
            return results.map(results => {
                return {
                    movieTitle: results.title,
                    movieImage: results.poster_path,
                    movieID: results.id,
                }
            })
        })
        .then(function(results) {
            console.log(results)
            tester(results);
        })
        .catch(function(err) {
            console.log(err);
        });

        return data;
}

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
};