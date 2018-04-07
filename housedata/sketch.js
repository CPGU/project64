
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
  gallery.addFigure(new SalesVolumesByRegion());
}

function draw() {
  background(255);
  if (gallery.selectedFigure != null) {
    gallery.selectedFigure.draw();
  }
}
