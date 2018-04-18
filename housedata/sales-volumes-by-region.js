function SalesVolumesByRegion(c) {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Sales Volumes By Region';
    
    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sales-volumes-by-region';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
          'data/Sales-Volumes.csv', 'csv', 'header',
          // Callback function to set the value
          // this.loaded to true.
          function(table) {
            self.loaded = true;
          });
    };

    this.setup = function() {
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }

        // Create a select DOM element.

        createRegionDropdownMenu();

        // remove duplicate region names.
        var regions = this.data.getColumn('Name');
        regions = removeRegionDuplicates(regions);

        // Set default option
        region_sel.option('Please select a region');
        region_sel.option('---');

        // fill the dropdown menu with region options
        fillDropdownMenu(regions, region_sel);

        region_sel.changed(this.draw);

        canvas_width = $("canvas").width();
        canvas_height = $("canvas").height();
        canvas_bottom_y = $("canvas").position().top + canvas_height;
        
        

        total = 0;
        max_t = 0;

    };


    this.destroy = function() {
        removeElements();
    };

    // Create a new pie chart object.
    this.pie = new PieChart(width / 2, height / 2, width * 0.4);

    this.lineGraph = new LineGraph(this);

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the region we're interested in from the selected item.
        region = region_sel.value();


        // Only displaying header label when a sel value has been selected.
        if(region == "Please select a region") {
            
        } else {
            push();
            textSize(32);
            text(region, 10, 30);
            pop();

            button = createButton("Snapshot <i class='fa fa-camera'></i>");
            button.id('snapshot')
            button.position(400,140);
            button.mousePressed(this.snapshot);
        }

        // Get the column of raw data for companyName.

        // Get the rows of raw data for the selected region.

        rows = this.data.findRows(region, 'Name');

        // create array and push the value in 3rd column ie 2nd index of the array into regionData
        myRegionData = sortRegionData(rows);
        regionValue = myRegionData.regionValue;
        regionData = myRegionData.regionData;
        
        var myMouseX = Math.round(map(mouseX, 0, width, 0, width));


        // draw the linegraph
        this.lineGraph.draw(myMouseX, regionData, regionValue); 
    };

    this.snapshot = function(c) {
        saveCanvas(this.c, 'Test', 'png');
    }

   
}
