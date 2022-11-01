function onLoad() {
    var gameBtnEL = document.querySelectorAll('.game-btn');
    var scoreBtnEl = document.querySelector('#scoreboard-btn')

    scoreBtnEl.addEventListener('click', navigateToScore);

    for (var i = 0; i < gameBtnEL.length; i++) {
        gameBtnEL[i].addEventListener('click', navigateToGame)
    }

    $('.ui.dropdown').dropdown();
}

function navigateToGame(event) {
    var url = window.location.href
    var gameType = event.target.value;
    var index = url.indexOf('/index.html');
    var gameID = event.target.parentElement.id;
    var genre = $(`#${gameID} .selection`).dropdown('get value');

    url = url.slice(0, index) + `/gamepage.html?game=${gameType}&genre=${genre}`
    window.location.replace(url);
}

function navigateToScore(event) {
    var url = window.location.href;
    var index = url.indexOf('/index.html');

    url = url.slice(0, index) + '/scoreboard.html';
    window.location.replace(url);
}

onLoad();