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
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/${config.imdbApiKey}/?title_type=feature&count=250&groups=top_1000&countries=us&sort=boxoffice_gross_us,desc`;
    }
    else {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/${config.imdbApiKey}/?title_type=feature&genres=${genre}&count=250&groups=top_1000&countries=us&sort=boxoffice_gross_us,desc`;
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
            } else if (gameType == 'budget' && data.budget != 'N/A') {
                movie['movieData'] = data.budget;
                movie['poster'] = data.Poster;
            } else if (gameType == 'ratings' && data.ratings != 'N/A') {
                movie['movieData'] = data.ratings;
                movie['poster'] = data.Poster;
            } else {
                createMovieObj(movie.type);
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

    var firstMovie = JSON.parse(localStorage.getItem('movie-2'));

    localStorage.setItem('movie-1', JSON.stringify(firstMovie))

    if (firstMovie != null) {
        movieCardEl[0].children[0].textContent = `Box Office: ${firstMovie.movieData}`;
        movieCardEl[0].children[1].src = firstMovie.poster;
        movieCardEl[0].children[2].textContent = firstMovie.name;

        questionEl.textContent = `${secondMovie.name} has a higher or lower ${gameType} amount than ${firstMovie.name}?`
    }

    localStorage.setItem('movie-2', JSON.stringify(secondMovie))

    movieCardEl[1].children[0].textContent = `Box Office: ???`;
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
        console.log('failed ln 138');
    }
}

// goes to gameover screen
function gameOver() {
    var url = window.location.href
    var results = {
        finalScore: score,
        genreUsed: genre,
        gameTypeUsed: gameType
    }

    localStorage.setItem('results', JSON.stringify(results))

    if (window.location.protocol == 'http:') {
        window.location = `/gameover.html`
    } else if (window.location.protocol == 'file:') {
        var index = url.indexOf('/gamepage.html')
        url = url.slice(0, index);
        url += `/gameover.html`
        window.location.replace(url);
    } else {
        console.log('failed');
    }
}

//goes back to main page
function goBack(event) {
    var url = window.location.href

    if (window.location.protocol == 'http:') {
        window.location = '/index.html'
    } else if (window.location.protocol == 'file:') {
        var index = url.indexOf('/gamepage')
        url = url.slice(0, index);
        url += '/index.html'
        window.location.replace(url);
    } else {
        console.log('failed');
    }
}

document.getElementById('back-btn').addEventListener('click', goBack)
document.getElementById('higher-lower-btns').addEventListener('click', compareAnswers)

onLoad();