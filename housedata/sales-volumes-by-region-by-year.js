function SalesVolumesByRegionByYear(c) {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Sales Volumes By Region By Year';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sales-volumes-by-region-by-year';

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

        // Set default option
        year_sel.option('Please select a year');
        year_sel.option('---');

        // remove the duplicates years.
        var years = this.data.getColumn('Date');

        var yearList = removeYearDuplicates(years);

        // fill the dropdown menu with all years.
        fillDropdownMenu(yearList, year_sel);
        year_sel.changed(this.draw);

        //comparison
        createCompareCheckbox();

        createRegionCompareDropdownMenu();
        compare_region_sel.option('Please select a region to compare');
        compare_region_sel.option('---');

        fillDropdownMenu(regions, compare_region_sel);

        createSnapshotButton(this);
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

        // Get the value of the region and year we're interested in from the
        // selected items.
        var region = region_sel.value();
        var year = year_sel.value();
        var compare_region = compare_region_sel.value();

        // toggle snapshot display
        toggleSnapshotDisplay(region, year);

        if(region != "Please select a region" && region != "---" && year != "Please select a year" && year != "---") {
            push();
            textSize(32);
            text(region, 10, 30);
            pop();
        }

        // Get the rows of raw data for the selected region.
        var rows = this.data.findRows(region, 'Name');
        var compare = this.data.findRows(compare_region, 'Name');

        // Filter rows to retain only items that include the selected year.
        rows = rows.filter(function(item) {
            return item.arr[0].includes(year);
        });

        compare = compare.filter(function(item) {
            return item.arr[0].includes(year);
        });

        // create array and push the value in 3rd column ie 2nd index of the array into regionData
        var myRegionData = sortRegionData(rows);
        var regionValue = myRegionData.regionValue;
        var regionData = myRegionData.regionData;

        var myMouseX = Math.round(map(mouseX, 0, width, 0, width));

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
