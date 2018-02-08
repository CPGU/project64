var artist;

function setup() {

  //Input
  input = createInput();
  input.position(20, 105);

  //Buttons
  button = createButton('Submit');
  button.position(input.x + input.width+10, 105);
  button.mousePressed(artistSubmit);

  var artistURL = getURL();

  var urlSplit = split(artistURL, '=');
  console.log(urlSplit[1]);
}

function draw() {
    
}

function artistSubmit() {
  loadJSON("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+input.value()+"&api_key=50e22ce4bf1afc04593ed626f21223d7&format=json", artistInformation, 'json');
}

function artistInformation(data) {
  console.log(data);
  text(data.artist.name, 10,10);
  text('Listeners: ' + data.artist.stats.listeners, 10,30, 1000);
  console.log(data.artist.image[4]["#text"]);
  img = createImg(data.artist.image[4]["#text"]);
  img.position(150, 200);
  for(var i = 0; i<data.artist.similar.artist.length; i++) {
    console.log(data.artist.similar.artist[i]["name"]);
  }
}
