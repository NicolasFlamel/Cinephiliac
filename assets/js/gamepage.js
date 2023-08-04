// grab filter options
var genre;
var score;
var gameType;
var movieList;

async function onLoad() {
  //somehow grab genre

  score = 0;
  genre = getGenre();
  gameType = getGameType();
  movieList = JSON.parse(localStorage.getItem(`${genre}`)) || [];

  if (movieList.length == 0) {
    await getMovieList(genre);
  }

  generateTwoMovies();
}

function getGameType() {
  var url = window.location.href;
  var firstIndex = url.indexOf('game=') + 5;
  var lastIndex = url.indexOf('&');
  var tempGameType = url.slice(firstIndex, lastIndex);

  return tempGameType;
}

function getGenre() {
  var url = window.location.href;
  var firstIndex = url.indexOf('genre=') + 6;
  var lastIndex = window.location.href.length;
  var tempGenre = url.slice(firstIndex, lastIndex);

  return tempGenre;
}

async function getMovieList(genre, page = 1) {
  const url = `https://moviesdatabase.p.rapidapi.com/titles?startYear=2000&list=top_rated_english_250&page=${page}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'defb4cff6bmsh5c3c9fc6bad23c4p1b26d6jsn3e83925178e0',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
    },
  };

  await fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (var i = 0; i < data.results.length; i++) {
        movieList.push({
          title: data.results[i].originalTitleText.text,
          id: data.results[i].id,
        });
      }
      genre != null
        ? localStorage.setItem(`${genre}`, JSON.stringify(movieList))
        : localStorage.setItem(`all`, JSON.stringify(movieList));

      // if (data.next) getMovieList(genre, page + 1);
    });
}

function generateTwoMovies() {
  createMovieObj();
  createMovieObj();
}

function createMovieObj() {
  const movie = randomMovie();

  getMovieData(movie.id).then((data) => {
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
  });
}

function randomMovie() {
  if (movieList.length == 0) throw new Error('Out of movies!');
  var randomIndex = Math.floor(Math.random() * (movieList.length - 1));
  var movie = movieList[randomIndex];

  movieList.splice(randomIndex, 1);

  return movie;
}

function getMovieData(id) {
  var urlOmdb = `https://www.omdbapi.com/?i=${id}&apikey=adb3ba12`;

  return fetch(urlOmdb).then((response) => response.json());
}

// moves movie in 2nd slot to 1st and loads passed in movie to 2nd slot
function loadMovie(secondMovie) {
  var movieCardEl = document.querySelectorAll('.movie-card');
  var questionEl = document.querySelector('#question');
  var tempGameType = formatGameType(gameType);

  var firstMovie = JSON.parse(localStorage.getItem('movie-2'));

  localStorage.setItem('movie-1', JSON.stringify(firstMovie));

  if (firstMovie != null) {
    movieCardEl[0].children[0].textContent = `${tempGameType}: ${firstMovie.movieData}`;
    movieCardEl[0].children[1].src = firstMovie.poster;
    movieCardEl[0].children[2].textContent = firstMovie.title;

    questionEl.innerHTML = `<em>${secondMovie.title}</em> has a higher or lower ${tempGameType} amount than <em>${firstMovie.title}</em>?`;

    if (firstMovie.movieData == secondMovie.movieData) createMovieObj(gameType);

    // testing purposes
    // secondMovie.movieData < firstMovie.movieData
    //   ? console.log('lower')
    //   : console.log('higher');
  }

  localStorage.setItem('movie-2', JSON.stringify(secondMovie));

  movieCardEl[1].children[0].textContent = `${tempGameType}: ???`;
  movieCardEl[1].children[1].src = secondMovie.poster;
  movieCardEl[1].children[2].textContent = secondMovie.title;
}

function compareAnswers(event) {
  var userAnswer = event.target.value;
  var movieOneData = JSON.parse(localStorage.getItem('movie-1'));
  var movieTwoData = JSON.parse(localStorage.getItem('movie-2'));

  movieOneData = Number(movieOneData.movieData.replaceAll(/[$,]/g, ''));
  movieTwoData = Number(movieTwoData.movieData.replaceAll(/[$,]/g, ''));

  if (
    (movieOneData < movieTwoData && userAnswer == 'higher') ||
    (movieOneData > movieTwoData && userAnswer == 'lower')
  ) {
    score++;
    createMovieObj();
  } else if (
    (movieOneData > movieTwoData && userAnswer == 'higher') ||
    (movieOneData < movieTwoData && userAnswer == 'lower')
  ) {
    gameOver();
  } else {
    console.log('failed');
  }
}

function formatGameType(game) {
  game = game.replaceAll('_', ' ');
  game = game.charAt(0).toUpperCase() + game.slice(1);
  return game;
}

// goes to gameover screen
function gameOver() {
  var url = window.location.href;
  var index = url.indexOf('/gamepage.html');
  var results = {
    finalScore: score,
    genreUsed: genre,
    gameTypeUsed: gameType,
  };

  localStorage.setItem('results', JSON.stringify(results));

  url = url.slice(0, index) + '/gameover.html';
  window.location.replace(url);
}

//goes back to main page
function goHome(event) {
  var url = window.location.href;
  var index = url.indexOf('/gamepage.html');

  url = url.slice(0, index) + '/index.html';
  window.location.replace(url);
}

document.getElementById('back-btn').addEventListener('click', goHome);
document
  .getElementById('higher-lower-btns')
  .addEventListener('click', compareAnswers);

onLoad();
