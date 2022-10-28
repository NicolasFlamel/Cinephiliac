// grab filter options
var movieList = [];
var userGenreChoice = "action";

function getMovieList(genre) {
    var urlImdb
    if (genre == null) {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/k_no5d2zsg/?title_type=feature&count=250&groups=top_1000&countries=us&sort=sort=boxoffice_gross_us,desc`;
    }
    else {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/k_no5d2zsg/?title_type=feature&genres=${genre}&count=250&groups=top_1000&countries=us&sort=sort=boxoffice_gross_us,desc`;
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
    createMovieObj(movie1, 'box-office');
    createMovieObj(movie2, 'box-office');
}

function randomMovieName() {
    var title = movieList[Math.floor(Math.random() * (movieList.length - 1))]
    return title
}

function createMovieObj(movieTitle, type) {
    var movie = {
        name: movieTitle
    }

    getMovieData(movieTitle)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (type == 'box-office') {
                movie['movieData'] = data.BoxOffice;
                movie['poster'] = data.Poster;
            } else if (type == 'budget') {
                movie['movieData'] = data.budget;
                movie['poster'] = data.Poster;
            } else {
                movie['movieData'] = data.ratings;
                movie['poster'] = data.Poster;
            }
            //render movie
            loadMovies(movie);
        })

    console.log(movie);
}

function getMovieData(title) {
    title = title.replaceAll(" ", "+")
    var urlOmdb = `http://www.omdbapi.com/?t=${title}&apikey=adb3ba12`;

    return fetch(urlOmdb);

}

function loadMovies(movie) {
    var movieCardEl = document.querySelectorAll('.movie-card');
    
    moveMovie(movie);
    localStorage.setItem('movie-2', JSON.stringify(movie))

    movieCardEl[1].children[0].textContent = `Box Office: ???`;
    movieCardEl[1].children[1].src = movie.poster;
    movieCardEl[1].children[2].textContent = movie.name;
}

function moveMovie() {
    var movieCardEl = document.querySelectorAll('.movie-card');
    var movie = JSON.parse(localStorage.getItem('movie-2'));

    localStorage.setItem('movie-1', JSON.stringify(movie))
    if(movie != null){
        movieCardEl[0].children[0].textContent = `Box Office: ${movie.movieData}`;
        movieCardEl[0].children[1].src = movie.poster;
        movieCardEl[0].children[2].textContent = movie.name;
    }

}

// code handling user input when comparing both movies (includes loading data)

// check input if correct continue or false stop game then load game over/store score

// if continue move 2nd movie over and grab new movie to compare to

getMovieList(userGenreChoice)