var results = JSON.parse(localStorage.getItem('results'));

function onLoad() {
  var scoreEls = document.querySelectorAll('.results');

  results.genreUsed = results.genreUsed.replace('_', ' ');
  results.genreUsed =
    results.genreUsed.charAt(0).toUpperCase() + results.genreUsed.slice(1);

  results.gameTypeUsed = results.gameTypeUsed.replace('_', ' ');
  results.gameTypeUsed =
    results.gameTypeUsed.charAt(0).toUpperCase() +
    results.gameTypeUsed.slice(1);

  scoreEls[0].textContent = results.finalScore;
  scoreEls[1].textContent = results.gameTypeUsed;
  scoreEls[2].textContent = results.genreUsed;
}

function saveScore(event) {
  var inputEl = document.querySelector('.ui.input');
  var scoreboardList = JSON.parse(localStorage.getItem('scoreboard')) || [];

  inputEl.classList.add('disabled');
  inputEl.children[1].classList.add('disabled');
  results['userName'] = event.target.previousElementSibling.value;
  scoreboardList.push(results);

  localStorage.setItem('scoreboard', JSON.stringify(scoreboardList));
}

//goes back to main page
function goHome(event) {
  var url = window.location.href;
  var index = url.indexOf('/gameover.html');

  url = url.slice(0, index) + '/index.html';
  window.location.replace(url);
}

function navigateToScoreboard(event) {
  var url = window.location.href;
  var index = url.indexOf('/gameover.html');

  url = url.slice(0, index) + '/scoreboard.html';
  window.location.replace(url);
}

document.getElementById('back-btn').addEventListener('click', goHome);
document
  .getElementById('scoreboard-btn')
  .addEventListener('click', navigateToScoreboard);
document.querySelector('.input button').addEventListener('click', saveScore);

onLoad();
