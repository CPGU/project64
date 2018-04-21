  // Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
    canvas_width = $("#app").width();
    canvas_height = $("#app").height();
    var c = createCanvas(canvas_width, canvas_height);
    c.parent('app');

    // Create a new gallery object.
    gallery = new Gallery();

    // Add the visualisation objects here.
    gallery.addFigure(new SalesVolumesByRegion(c));
    gallery.addFigure(new AveragePriceByRegion(c));
    gallery.addFigure(new SalesVolumesByRegionByYear(c));
    gallery.addFigure(new AveragePriceByRegionByYear(c));
    gallery.addFigure(new OverallRegionData(c));
    
    canvas_width = $("canvas").width();
    canvas_height = $("canvas").height();
    canvas_bottom_y = $("canvas").position().top + canvas_height - 80;
    graph_bottom = canvas_bottom_y - height/50;
}

function draw() {
  background(255);
  if (gallery.selectedFigure != null) {
    gallery.selectedFigure.draw();
  }
  
}
