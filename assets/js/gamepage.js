// grab filter options

var movieList = [];
var userGenreChoice = "action";
var dateRange = ["2010", "2020"];

function getMovieList(genre, dateRange) {
    var urlImdb
    var dateString = `${dateRange[0]}-01-01,${dateRange[1]}-01-01`
    if (genre == null) {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/k_no5d2zsg/?title_type=feature&release_date=${dateString}&count=250&sort=moviemeter,desc`;
    }
    else {
        urlImdb = `https://imdb-api.com/API/AdvancedSearch/k_no5d2zsg/?title_type=feature&release_date=${dateString}&genres=${genre}&count=250&sort=moviemeter,desc`;
    }


    fetch(urlImdb)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            movieTitles(data)
        })
}
function movieTitles(data) {
    for (var i = 0; i < data.results.length; i++) {
        movieList.push(data.results[i].title)
    }
    var movie1 = randomMovie()
    var movie2 = randomMovie()
    createMovie(movie1)
    createMovie(movie2)
}

function randomMovie() {
    var title = movieList[Math.floor(Math.random() * (movieList.length - 1))]
    return title
}
getMovieList(userGenreChoice, dateRange)

// use api to grab list of movies depending on filter

// choose 2 random movies from list

// use 2nd api to grab movie info
function createMovie(movieTitle) {
    var movie = {
        name: movieTitle
    }
    getMovieData(movie)
}

function getMovieData(movieObj) {
    var title = movieObj.name
    title = title.replaceAll(" ","+")
    console.log(title)
    var urlOmdb = `http://www.omdbapi.com/?t=${title}&apikey=adb3ba12`;
    // titles with spaces not working
    fetch(urlOmdb)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
       
}









// temp variables
// var movieList = ['Dune', 'Memory'];
// var movieInfo = ['$108,327,830', '$7,329,043'];

// var moviePoster = [
//     'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg',
//     'https://m.media-amazon.com/images/M/MV5BOGI5N2FhNzktZjZlNi00MmRjLWE1MmUtNjRlNzQyOGMzYjNhXkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_SX300.jpg'
// ];


// load movie data onto page

//call function using array of index
loadGameOptionInfo([0, 1]);

function loadGameOptionInfo(indexArray) {
    var movieCardEl = document.querySelectorAll('.movie-card');

    for (var i = 0; i < indexArray.length; i++) {
        movieCardEl[i].children[0].textContent = `Box Office: ${movieList[indexArray[i]]}`;
        movieCardEl[i].children[1].src = moviePoster[indexArray[i]];
        movieCardEl[i].children[2].textContent = movieInfo[indexArray[i]];
    }
}

// code handling user input when comparing both movies (includes loading data)

// check input if correct continue or false stop game then load game over/store score

// if continue move 2nd movie over and grab new movie to compare to

