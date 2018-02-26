
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = $('#app');
  var c = createCanvas(1024, 576);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  // gallery.addFigure(new TechDiversityRace());
  // gallery.addFigure(new TechDiversityGender());
  // gallery.addFigure(new PayGapByJob2017());
  // gallery.addFigure(new PayGapTimeSeries());

  input = createInput();
  input.position(20,50);

  button = createButton('submit');
  button.position(input.x + input.width, 65);
  button.mousePressed(searchArtist);
}

function draw() {
  background(255);
  if (gallery.selectedFigure != null) {
    gallery.selectedFigure.draw();
  }
}

function searchArtist() {
  var artistName = input.value();
  window.location.replace("artist.html?artistName="+artistName);
}

