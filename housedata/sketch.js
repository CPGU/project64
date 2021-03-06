// Global variable to store the gallery object. The gallery object is
// a container for all the data visualisations.
var gallery;
var url;

function preload() {
    data = loadTable('data/Average-Prices-SA-SM.csv', 'csv', 'header');
}

function setup() {
    // Create a canvas to fill the div with id app from data_by_region.html.
    // grab width and height of the DOM element with id app using jQuery.
    // allows canvas size manipulation using css.
    canvas_width = $("#graph").width();
    canvas_height = $("#graph").height();
    canvas_bottom_y = $("#graph").position().top + canvas_height - 80;
    graph_bottom = canvas_bottom_y - height/50;
    var c = createCanvas(canvas_width, canvas_height);
    c.parent('graph');

    // Create a new gallery object.
    gallery = new Gallery();

    // Add the data visualisation objects here.
    gallery.addFigure(new OverallRegionData(c));
    gallery.addFigure(new SalesVolumesByRegion(c));
    gallery.addFigure(new AveragePriceByRegion(c));
    gallery.addFigure(new SalesVolumesByRegionByYear(c));
    gallery.addFigure(new AveragePriceByRegionByYear(c));

    getRequestURL(url);
}

function draw() {
    // set background to white
    background(255);

    // call the draw method of the selectedFigure object from gallery.
    if (gallery.selectedFigure != null) {
        gallery.selectedFigure.draw();
    } else {
        // add a display/instructions here
        text('Select a data type in the menu on the left', 200, 200);
    }
}

function changeRegion() {
    window.location.href = 'data.html?region=' + region_sel.value();
}


