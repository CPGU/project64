
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
function preload() {
    var key = '50e22ce4bf1afc04593ed626f21223d7';

    url = getURL();

    var searchQuery = split(url, '=')[1];
    
    artistNameElement = select('#artistName');

    apiURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+searchQuery+"&api_key=50e22ce4bf1afc04593ed626f21223d7&format=json";
    result = loadJSON(apiURL);
<<<<<<< HEAD
    
    

=======
>>>>>>> ae3e696443da6ee7d4e7add967247200cc2eec46
}

function setup() {
    noLoop();
}

function draw() {
<<<<<<< HEAD
    if(result.error > 0) {
        window.location.replace("404.html");
    }

    var artistInfoPlayCount = result.artist.stats.playcount;
    var artistInfoListeners = result.artist.stats.listeners;

    artistPlays = select('#artistPlays');
    artistPlays.html(artistInfoPlayCount);

    artistListeners = select('#artistListeners');
    artistListeners.html(artistInfoListeners);

=======
    artistNameElement.html(result.artist.name);
>>>>>>> ae3e696443da6ee7d4e7add967247200cc2eec46
}
