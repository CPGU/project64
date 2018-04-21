function SalesVolumesByRegion(c) {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Sales Volumes By Region';
    
    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sales-volumes-by-region';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    this.compare = false;

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

        //comparison
        createCompareCheckbox();
        createRegionCompareDropdownMenu();
        compare_region_sel.option('Please select a region to compare');
        compare_region_sel.option('---');
        
        fillDropdownMenu(regions, compare_region_sel);
    };

    this.destroy = function() {
        removeElements();
    };

    // Create a new pie chart object.
    this.pie = new PieChart(width / 2, height / 2, width * 0.4);

    this.barGraph = new BarGraph();

    this.lineGraph = new LineGraph(this);

    this.draw = function() {
        if(compareBox.checked()) {
            this.compare = true;
            compare_region_sel.show();
        } else {
            this.compare = false;
            compare_region_sel.hide();
        }

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the region we're interested in from the selected item.
        var region = region_sel.value();
        var compare_region = compare_region_sel.value();

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

        // Get the rows of raw data for the selected region and compare region.
        var rows = this.data.findRows(region, 'Name');
        var compare = this.data.findRows(compare_region, 'Name');

        // create array and push the value in 3rd column ie 2nd index of the array into regionData
        var myRegionData = sortRegionData(rows);
        var regionValue = myRegionData.regionValue;
        var regionData = myRegionData.regionData;
        
        
        var myMouseX = Math.round(map(mouseX, 0, width, 0, width));

        // draw the linegraph
        //this.lineGraph.draw(myMouseX, regionData, regionValue, compareData, compareValue); 

        if(!this.compare) {
            this.lineGraph.draw(myMouseX, regionData, regionValue); 
        } else {
            var myCompareData = sortRegionData(compare);
            var compareValue = myCompareData.regionValue;
            var compareData = myCompareData.regionData;
            this.lineGraph.draw(myMouseX, regionData, regionValue, compareData, compareValue); 
        }
    };

    this.snapshot = function(c) {
        saveCanvas(this.c, 'Test', 'png');
    }

   
}
