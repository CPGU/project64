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

    this.lineGraph = new LineGraph();

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

        this.lineGraph.draw(myMouseX, regionData, regionValue);
    };
}
