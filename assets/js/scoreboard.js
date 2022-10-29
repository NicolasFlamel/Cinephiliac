
function goHome(event) {
    var url = window.location.href
    var index = url.indexOf('/scoreboard.html');

    url = url.slice(0, index) + '/index.html'
    window.location.replace(url);
}

document.getElementById('back-btn').addEventListener('click', goHome)