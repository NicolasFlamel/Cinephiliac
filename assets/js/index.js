function doFetch() {
    var genre = ['action', 'Family', 'Comedy', 'Animation', 'Horror', 'Crime', 'Sci-Fi', 'Romance', 'Thriller']

    var urlImdb = `https://imdb-api.com/API/AdvancedSearch/${config.imdbApiKey}?title_type=feature&genres=${genre[0]}`

    fetch(urlImdb).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        doFetch2(data.results[30].title);
        doFetch2(data.results[31].title)
        console.log(data);
    })

    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        list: "search",
        srsearch: "Lists of action films",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });

    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            if (response.query.search[0].title === "Nelson Mandela") {
                console.log("Your search page 'Nelson Mandela' exists on English Wikipedia");
            }
            console.log(response);
        })
        .catch(function (error) { console.log(error); });

}

function doFetch2 (id) {
    var title = id;
    var urlOmbd = `http://www.omdbapi.com/?t=${title}&apikey=${config.omdbApiKey}`

    fetch(urlOmbd).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        console.log(data);
    })
}

$('.ui.dropdown').dropdown();


doFetch();