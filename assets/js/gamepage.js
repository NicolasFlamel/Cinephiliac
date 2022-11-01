// grab filter options
var genre;
var score;
var gameType;
var movieList;

function onLoad() {
    //somehow grab genre

    genre = getGenre();
    score = 0;
    gameType = getGameType();
    movieList = JSON.parse(localStorage.getItem(`${genre}`)) || [];

    if (movieList.length == 0) {
        getMovieList(genre);
    } else {
        generateTwoMovies();
    }

}

function getGameType() {
    var tempGameType;
    var url = window.location.href;
    var firstIndex = url.indexOf('game=') + 5;
    var lastIndex = url.indexOf('&')

    tempGameType = url.slice(firstIndex, lastIndex)

    return tempGameType
}

function getGenre() {
    var tempGenre;
    var url = window.location.href;
    var firstIndex = url.indexOf('genre=') + 6;
    var lastIndex = window.location.href.length;

    tempGenre = url.slice(firstIndex, lastIndex);

    return tempGenre;
}

function getMovieList(genre) {
    var urlImdb

    if (genre == 'all_genres') {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/k_no5d2zsg/?title_type=feature&count=250&groups=top_1000&countries=us&sort=boxoffice_gross_us,desc`;
    }
    else {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/k_no5d2zsg/?title_type=feature&genres=${genre}&count=250&groups=top_1000&countries=us&sort=boxoffice_gross_us,desc`;
    }

    fetch(urlImdb)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 0; i < data.results.length; i++) {
                movieList.push(data.results[i].title);
            }
            if (genre != null) {
                localStorage.setItem(`${genre}`, JSON.stringify(movieList))
            } else {
                localStorage.setItem(`all`, JSON.stringify(movieList))
            }
            generateTwoMovies();
        })
}

function generateTwoMovies() {
    createMovieObj();
    createMovieObj();
}

function createMovieObj() {
    var movie = {
        name: randomMovieName(),
    }

    getMovieData(movie.name)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (gameType == 'box_office' && data.BoxOffice != 'N/A') {
                movie['movieData'] = data.BoxOffice;
                movie['poster'] = data.Poster;
            } else if (gameType == 'rating' && data.imdbRating != 'N/A') {
                movie['movieData'] = data.imdbRating;
                movie['poster'] = data.Poster;
            } else {
                createMovieObj(gameType);
                return;
            }
            //render movie
            loadMovie(movie);
        })
}

function randomMovieName() {
    var randomIndex = Math.floor(Math.random() * (movieList.length - 1))
    var title = movieList[randomIndex]

    movieList.splice(randomIndex, 1);

    return title
}

function getMovieData(title) {
    title = title.replaceAll(" ", "+")
    var urlOmdb = `http://www.omdbapi.com/?t=${title}&apikey=adb3ba12`;

    return fetch(urlOmdb);
}

// moves movie in 2nd slot to 1st and loads passed in movie to 2nd slot
function loadMovie(secondMovie) {
    var movieCardEl = document.querySelectorAll('.movie-card');
    var questionEl = document.querySelector('#question');
    var tempGameType = formatGameType(gameType);

    var firstMovie = JSON.parse(localStorage.getItem('movie-2'));

    localStorage.setItem('movie-1', JSON.stringify(firstMovie))

    if (firstMovie != null) {
        movieCardEl[0].children[0].textContent = `${tempGameType}: ${firstMovie.movieData}`;
        movieCardEl[0].children[1].src = firstMovie.poster;
        movieCardEl[0].children[2].textContent = firstMovie.name;

        questionEl.innerHTML = `<em>${secondMovie.name}</em> has a higher or lower ${tempGameType} amount than <em>${firstMovie.name}</em>?`

        if (firstMovie.movieData == secondMovie.movieData) {
            createMovieObj(gameType);
        }
    }

    localStorage.setItem('movie-2', JSON.stringify(secondMovie))

    movieCardEl[1].children[0].textContent = `${tempGameType}: ???`;
    movieCardEl[1].children[1].src = secondMovie.poster;
    movieCardEl[1].children[2].textContent = secondMovie.name;
}

function compareAnswers(event) {
    var userAnswer = event.target.value;
    var movieOneData = JSON.parse(localStorage.getItem('movie-1'));
    var movieTwoData = JSON.parse(localStorage.getItem('movie-2'));

    movieOneData = Number(movieOneData.movieData.replaceAll(/[$,]/g, ''));
    movieTwoData = Number(movieTwoData.movieData.replaceAll(/[$,]/g, ''));

    if (
        movieOneData < movieTwoData && userAnswer == 'higher' ||
        movieOneData > movieTwoData && userAnswer == 'lower') {
        score++;
        createMovieObj();
    } else if (
        movieOneData > movieTwoData && userAnswer == 'higher' ||
        movieOneData < movieTwoData && userAnswer == 'lower') {
        gameOver();
    } else {
        console.log('failed');
    }
}

function formatGameType(game) {
    game = game.replaceAll('_', ' ')
    game = game.charAt(0).toUpperCase() + game.slice(1)
    return game
}

// goes to gameover screen
function gameOver() {
    var url = window.location.href
    var index = url.indexOf('/gamepage.html');
    var results = {
        finalScore: score,
        genreUsed: genre,
        gameTypeUsed: gameType
    }

    localStorage.setItem('results', JSON.stringify(results))

    url = url.slice(0, index) + '/gameover.html'
    window.location.replace(url);
}

//goes back to main page
function goHome(event) {
    var url = window.location.href
    var index = url.indexOf('/gamepage.html');

    url = url.slice(0, index) + '/index.html'
    window.location.replace(url);
}

document.getElementById('back-btn').addEventListener('click', goHome)
document.getElementById('higher-lower-btns').addEventListener('click', compareAnswers)

onLoad();