
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
function preload() {
    var key = '50e22ce4bf1afc04593ed626f21223d7';

    url = getURL();

    var searchQuery = split(url, '=');

    artistName = select('#artistName');
    artistName.html(searchQuery[1]);

    apiURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+searchQuery[1]+"&api_key=50e22ce4bf1afc04593ed626f21223d7&format=json";
    result = loadJSON(apiURL);

}

function setup() {

    noLoop();
}

function draw() {
    var artistInfoPlayCount = result.artist.stats.playcount;
    console.log(artistInfoPlayCount);
}

//function artistInformation(data) {
//   console.log(data.artist.stats.playcount);
//}
