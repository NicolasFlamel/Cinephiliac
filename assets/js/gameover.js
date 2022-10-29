

//goes back to main page
function goBack(event) {
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

document.getElementById('back-btn').addEventListener('click', goBack)