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
        region_sel = createSelect();
        region_sel.position(300,100);

        // Fill the options with all company names.
        var header = this.data.getColumn('Name');
        header = new Set(header);
        header = Array.from(header);
        region_sel.option('Please select a region');
        region_sel.option('');
        for(var i=1; i<header.length; i++) {
            region_sel.option(header[i]);
        }
        region_sel.changed(this.draw);
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

        canvas_width = $("#app").width();
        canvas_height = $("#app").height();
        canvas_bottom_y = $("#app").position().top + canvas_height;
        regionData = [];

        // Get the value of the company we're interested in from the
        // select item. Temporarily hard-code an example for now.
        var region = region_sel.value();

        // Get the column of raw data for companyName.
        var rows = this.data.findRows(region, 'Name');

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

        // Draw the pie chart!
        /*
        this.pie.draw(col, labels, colours, title);
        for(var i=0; i<labels.length; i++) {
            this.pie.makeLegendItem(labels, i);
        }
        */
    };
}
