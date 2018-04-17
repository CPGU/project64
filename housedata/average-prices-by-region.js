function AveragePriceByRegion() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Average Price By Region';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'average-price-by-region';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
          'data/Average-Prices-SA-SM.csv', 'csv', 'header',
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

        // Fill the options with all region names.
        var regions = this.data.getColumn('Name');
        regions = removeRegionDuplicates(regions);

        // Set default option
        region_sel.option('Please select a region');
        region_sel.option('---');

        // fill the dropdown menu with options
        fillDropdownMenu(regions, region_sel);

        region_sel.changed(this.draw);

        canvas_width = $("canvas").width();
        canvas_height = $("canvas").height();
        canvas_bottom_y = $("canvas").position().top + canvas_height;
    };

    this.destroy = function() {
        removeElements();
    };

    // Create a new pie chart object.
    this.pie = new PieChart(width / 2, height / 2, width * 0.4);

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        regionData = [];

        // Get the value of the region we're interested in from the selected item.
        var region = region_sel.value();

        // Get the column of raw data for companyName.
        var rows = this.data.findRows(region, 'Name');

        // create array and push the value in 3rd column ie 2nd index of the array into regionData
        myRegionData = sortRegionData(rows);
        regionValue = myRegionData.regionValue;
        regionData = myRegionData.regionData;

        for(var i=0; i<regionData.length; i++) {
            fill(0);
            var x = map(i, 0, regionData.length, 0, canvas_width);
            var h = map(regionData[i].value, 0, max(regionValue),0, canvas_height);
            
            rect(x, canvas_bottom_y, canvas_width/regionData.length, -h);
        }

        // Draw the pie chart!
        /*
        this.pie.draw(col, labels, colours, title);
        for(var i=0; i<labels.length; i++) {
            this.pie.makeLegendItem(labels, i);
        }
        */
    };
}
