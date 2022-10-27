// grab filter options

// use api to grab list of movies depending on filter

// choose 2 random movies from list

// use 2nd api to grab movie info

// temp variables
var movieList = ['Dune', 'Memory'];
var movieInfo = ['$108,327,830', '$7,329,043'];

var moviePoster = [
    'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg', 
    'https://m.media-amazon.com/images/M/MV5BOGI5N2FhNzktZjZlNi00MmRjLWE1MmUtNjRlNzQyOGMzYjNhXkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_SX300.jpg'
];

function firstAPI () {
    //grabs movie list depending on filters
}

function randomMovie() {
    //function returns index of a random movie and removes from list
}

function getMovieInfo (index) {
    //gets info on movie in index that was passed in
}

// load movie data onto page

//call function using array of index
loadGameOptionInfo([0, 1]);

function loadGameOptionInfo (indexArray) {
    var movieCardEl = document.querySelectorAll('.movie-card');
    
    for(var i = 0; i < indexArray.length; i++){
        movieCardEl[i].children[0].textContent = `Box Office: ${movieList[indexArray[i]]}`;
        movieCardEl[i].children[1].src = moviePoster[indexArray[i]];
        movieCardEl[i].children[2].textContent = movieInfo[indexArray[i]] ;
    }
}

// code handling user input when comparing both movies (includes loading data)

// check input if correct continue or false stop game then load game over/store score

// if continue move 2nd movie over and grab new movie to compare to

