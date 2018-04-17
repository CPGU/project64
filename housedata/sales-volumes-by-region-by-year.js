function SalesVolumesByRegionByYear() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Sales Volumes By Region By Year';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sales-volumes-by-region-by-year';

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

        // Fill the options with all region names.
        var regions = this.data.getColumn('Name');
        regions = removeRegionDuplicates(regions);

        // Set default option
        region_sel.option('Please select a region');
        region_sel.option('---');

        // fill the dropdown menu with options
        fillDropdownMenu(regions, region_sel);

        region_sel.changed(this.draw);


        // Create a year select DOM element
        createYearDropdownMenu();

        // remove the duplicates years.
        var years = this.data.getColumn('Date');
        var yearList = removeYearDuplicates(years);

        // fill the dropdown menu with all years.
        fillDropdownMenu(yearList, year_sel);
        year_sel.changed(this.draw);

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

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the region and year we're interested in from the
        // selected items.
        region = region_sel.value();
        year = year_sel.value();

        // Get the rows of raw data for the selected region.
        rows = this.data.findRows(region, 'Name');

        // Filter rows to retain only items that include the selected year.
        rows = rows.filter(function(item) {
            return item.arr[0].includes(year);
        });

        // create array and push the value in 3rd column ie 2nd index of the array into regionData
        myRegionData = sortRegionData(rows);
        regionValue = myRegionData.regionValue;
        regionData = myRegionData.regionData;

        var myMouseX = Math.round(map(mouseX, 0, width, 0, width));

        beginShape();
        for(var i=0; i<regionData.length; i++) {
            //fill(0);
            noFill();
            var x = map(i, 0, regionData.length, 0, canvas_width);
            var max_h = -map(regionData[i].value, 0, max(regionValue),0, canvas_height);
            
            //rect(x, canvas_bottom_y, canvas_width/regionData.length, max_h);
            //
            push()
            var month = regionData[i].date.split('-')[1]
            if(month == '01') {
                stroke(255,0,0, 120);
                line(x, canvas_bottom_y-60, x, 0);
            } else {
                stroke(255,0,0, 50);
                line(x, canvas_bottom_y - 70, x, 0);
            }
            pop();
            vertex(x, canvas_bottom_y + max_h);

        }
        endShape();

        // create function for drawing data labels
        for(var i=0; i<regionData.length; i++) {
            var x = map(i, 0, regionData.length, 0, canvas_width);
            var max_h = -map(regionData[i].value, 0, max(regionValue),0, canvas_height);
            if(myMouseX < Math.round(x) + 2 && myMouseX > Math.round(x) - 2) {
                push();
                strokeWeight(8);
                fill(0);
                point(x, canvas_bottom_y + max_h);
                push();
                strokeWeight(1);
                fill(255,255,0,230);
                if(mouseX + 170 >= width) {
                    translate(mouseX-170, mouseY+10);
                } else {
                    translate(mouseX+10, mouseY+10);
                }
                rect(0,0, 160, 60);
                fill(0);
                text("sales volume: " + regionData[i].value, 20,20);
                text("date: " + regionData[i].date, 20,50);
                pop();
                pop();
            }
        }

        line(mouseX, canvas_bottom_y, mouseX, 0);

        for(var i=0; i<regionData.length; i+=12) {
            var year = regionData[i].date.split('-')[0]
            var x = map(i, 0, regionData.length, 0, canvas_width);
            fill(0);
            text(year, x, canvas_bottom_y - 50);
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
