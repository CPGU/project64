
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
function preload() {
    var key = '50e22ce4bf1afc04593ed626f21223d7';

    url = getURL();

    var searchQuery = split(url, '=')[1];
    
    artistNameElement = select('#artistName');

    apiURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+searchQuery+"&api_key=50e22ce4bf1afc04593ed626f21223d7&format=json";
    result = loadJSON(apiURL);
}

function setup() {
    noLoop();
}

function draw() {
    artistNameElement.html(result.artist.name);
}
