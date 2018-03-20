var sel;
var item;
var regionData = [];
var canvas_width;
var canvas_height;

// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function preload() {
    table = loadTable("data/Sales-Volumes.csv", "csv", "header");
}

function setup() {
    // Create a canvas to fill the content div from index.html.
    canvas_width = $("#app").width();
    canvas_height = $("#app").height();
    var c = createCanvas(canvas_width, canvas_height);
    c.parent('app');

    // Create a new gallery object.
    //gallery = new Gallery();

    // Add the visualisation objects here.
    // gallery.addFigure(new TechDiversityRace());
    // gallery.addFigure(new TechDiversityGender());
    // gallery.addFigure(new PayGapByJob2017());
    // gallery.addFigure(new PayGapTimeSeries());

    //input = createInput();
    //input.position(20,50);

    //button = createButton('submit');
    //button.position(input.x + input.width, 65);
    //button.mousePressed(searchArtist);
    var places = table.getColumn('Name');
    places = places.filter(function(item, index, arr){
        return arr.indexOf(item) == index;
    });

    ///create a select drop down menu for all areas
    sel = createSelect();
    sel.position(100,100);
    for(var i=0; i<places.length; i++) {
        sel.option(places[i]);
    }
    sel.changed(mySelection);

    noLoop();
}

function mySelection() {
    canvas_width = $("#app").width();
    canvas_height = $("#app").height();
    canvas_bottom_y = $("#app").position().top + canvas_height;
    regionData = [];
    clear();
    item = sel.value();

    // find rows with the value Enfield in cell in column Name
    var rows = table.findRows(item, 'Name');

    // create array and push the value in 3rd column ie 2nd index of the array into regionData
    for(var i=0; i<rows.length; i++) {
        regionData.push(rows[i].arr[2]);
    }

    for(var i=0; i<regionData.length; i++) {
        fill(0);
        var x = map(i, 0, regionData.length, 0, canvas_width);
        var h = map(regionData[i], 0, max(regionData),0, canvas_height);
        
        rect(x, canvas_bottom_y, canvas_width/regionData.length, -h);
    }
}

function draw() {
    background(255);
}
