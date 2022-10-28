// grab filter options
var movieList = [];
var userGenreChoice = "action";

function getMovieList(genre) {
    var urlImdb
    if (genre == null) {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/${config.imdbApiKey}/?title_type=feature&count=250&groups=top_1000&countries=us&sort=sort=boxoffice_gross_us,desc`;
    }
    else {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/${config.imdbApiKey}/?title_type=feature&genres=${genre}&count=250&groups=top_1000&countries=us&sort=sort=boxoffice_gross_us,desc`;
    }

    fetch(urlImdb)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            movieTitles(data)
        })
}
function movieTitles(data) {
    for (var i = 0; i < data.results.length; i++) {
        movieList.push(data.results[i].title);
    }

    var movie1 = randomMovieName();
    var movie2 = randomMovieName();
    createMovieObj(movie1, 'box office');
    createMovieObj(movie2, 'box office');
}

function randomMovieName() {
    var randomIndex = Math.floor(Math.random() * (movieList.length - 1))
    var title = movieList[randomIndex]

    movieList.splice(randomIndex, 1);

    return title
}

function createMovieObj(movieTitle, type) {
    var movie = {
        name: movieTitle,
        type: type
    }

    getMovieData(movieTitle)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (movie.type == 'box office') {
                movie['movieData'] = data.BoxOffice;
                movie['poster'] = data.Poster;
            } else if (movie.type == 'budget') {
                movie['movieData'] = data.budget;
                movie['poster'] = data.Poster;
            } else {
                movie['movieData'] = data.ratings;
                movie['poster'] = data.Poster;
            }
            //render movie
            loadMovie(movie);
        })
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

    localStorage.setItem('movie-1', JSON.stringify(secondMovie))
    
    if(firstMovie != null){
        movieCardEl[0].children[0].textContent = `Box Office: ${firstMovie.movieData}`;
        movieCardEl[0].children[1].src = firstMovie.poster;
        movieCardEl[0].children[2].textContent = firstMovie.name;

        questionEl.textContent = `${secondMovie.name} has a higher or lower ${secondMovie.type} amount than ${firstMovie.name}?`
    }

    localStorage.setItem('movie-2', JSON.stringify(secondMovie))

    movieCardEl[1].children[0].textContent = `Box Office: ???`;
    movieCardEl[1].children[1].src = secondMovie.poster;
    movieCardEl[1].children[2].textContent = secondMovie.name;
}


// code handling user input when comparing both movies (includes loading data)

// check input if correct continue or false stop game then load game over/store score

// if continue move 2nd movie over and grab new movie to compare to

//goes back to main page
function goBack(event){
    var url = window.location.href

    if(window.location.protocol == 'http:'){
        window.location = '/index.html'
    }else if (window.location.protocol == 'file:'){
        var index = url.indexOf('/gamepage')
        url = url.slice(0, index);
        url += '/index.html'
        window.location.replace(url);
    }else{
        console.log('failed');
    }
}


//getMovieList(userGenreChoice)

document.getElementById('back-btn').addEventListener('click', goBack)