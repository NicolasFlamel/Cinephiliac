function onLoad() {
    var results = JSON.parse(localStorage.getItem('results'));
    var scoreEls = document.querySelectorAll('.results');
    
    results.genreUsed = results.genreUsed.replace('_', ' ')
    results.genreUsed = results.genreUsed.charAt(0).toUpperCase() + results.genreUsed.slice(1);

    results.gameTypeUsed = results.gameTypeUsed.replace('_', ' ');
    results.gameTypeUsed = results.gameTypeUsed.charAt(0).toUpperCase() + results.gameTypeUsed.slice(1);

    scoreEls[0].textContent = results.finalScore;
    scoreEls[1].textContent = results.gameTypeUsed;
    scoreEls[2].textContent = results.genreUsed;
}

//goes back to main page
function goHome(event) {
    var url = window.location.href

    if (window.location.protocol == 'http:') {
        window.location = '/index.html'
    } else if (window.location.protocol == 'file:') {
        var index = url.indexOf('/gameover.html')
        url = url.slice(0, index);
        url += '/index.html'
        window.location.replace(url);
    } else {
        console.log('failed');
    }
}

function navigateToScoreboard(event) {
    var url = window.location.href;
    var index = url.indexOf('/gameover.html');

    url = url.slice(0, index) + '/scoreboard.html';
    window.location.replace(url);
}

document.getElementById('back-btn').addEventListener('click', goHome)
document.getElementById('scoreboard-btn').addEventListener('click', navigateToScoreboard)

onLoad();