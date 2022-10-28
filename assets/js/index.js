function onLoad() {
    var gameBtnEL = document.querySelectorAll('.game-btn');

    for (var i = 0; i < gameBtnEL.length; i++) {
        gameBtnEL[i].addEventListener('click', navigateToPage)
    }

    $('.ui.dropdown').dropdown({
        clearable: true
    });
}

function navigateToPage(event) {
    var gameType = 'test';
    var genre = 'test';
    var url = window.location.href

    if(window.location.protocol == 'http:'){
        window.location = `/gamepage.html?game=${gameType}&genre=${genre}`
    }else if (window.location.protocol == 'file:'){
        var index = url.indexOf('/index')
        url = url.slice(0, index);
        url += `/gamepage.html?game=${gameType}&genre=${genre}`
        window.location.replace(url);
    }else{
        console.log('failed');
    }
}

onLoad();