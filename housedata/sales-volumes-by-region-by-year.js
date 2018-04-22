function SalesVolumesByRegionByYear(c) {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Sales Volumes By Region By Year';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sales-volumes-by-region-by-year';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Property to represent whether the user has selected a comparison value.
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
        // basic conditional to determine whether the preload data has been loaded or not.
        // if not, user is shown a loading message currently in the console
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }

        // Create a region select DOM element.
        createRegionDropdownMenu();

        // create a variable and assign it the column with header 'name' from the this.data table
        var regions = this.data.getColumn('Name');

        // call function to remove duplicate region names.
        regions = removeRegionDuplicates(regions);

        // Set default option
        region_sel.option('Please select a region');
        region_sel.option('---');

        // fill the dropdown menu with region options
        fillDropdownMenu(regions, region_sel);

        // when region_sel is changed, call this.resetCount and then this.draw
        region_sel.changed(this.draw);

        // Create a year select DOM element
        createYearDropdownMenu();

        // Set default option
        year_sel.option('Please select a year');
        year_sel.option('---');

        // create a variable and assign it the column with header 'Date' from the this.data table
        var years = this.data.getColumn('Date');

        // call function to remove duplicate years.
        var yearList = removeYearDuplicates(years);

        // fill the dropdown menu with years options
        fillDropdownMenu(yearList, year_sel);

        // when year_sel is changed, call this.resetCount and then this.draw
        year_sel.changed(this.resetCount, this.draw);

        //comparison
        // call functions to create a Compare check box and a dropdown menu.
        createCompareCheckbox();
        createRegionCompareDropdownMenu();

        // set default options
        compare_region_sel.option('Please select a region to compare');
        compare_region_sel.option('---');

        // fill the compare year sel dropdown menu with options
        fillDropdownMenu(regions, compare_region_sel);

        // when compare_year_sel is changed, call this.compareResetCount and this.draw
        compare_region_sel.changed(this.compareResetCount, this.draw);

        // function call to create a snapshot button
        createSnapshotButton(this);

        // global variables to be used in draw
        // tempData and compareTempData is used as a incrementor for the graph animation.
        tempData = [];
        tempDataCount = 0;
        compareTempData = [];
        compareTempDataCount = 0;
    };

    // when called, this method resets the value of tempData to an empty array and tempDataCount to 0
    this.resetCount = function() {
        tempData = [];
        tempDataCount = 0;
    };

    // when called, this method resets the value of compareResetData to an empty array and compareTempDataCount to 0
    this.compareResetCount = function() {
        compareTempData = [];
        compareTempDataCount = 0;
    };

    // when this method removes all elements
    this.destroy = function() {
        removeElements();
    };

    // Create a new pie chart object.
    // unused at the moment
    this.pie = new PieChart(width / 2, height / 2, width * 0.4);

    // Create a new pie chart object.
    // unused at the moment
    this.barGraph = new BarGraph();

    // this property is assigned a new Line Graph object
    this.lineGraph = new LineGraph(this);

    this.draw = function() {
        // toggle this.compare between true and false
        // this checks to see if the user has selected the compare option or not
        // if the user selects the compare option, then a dropdown menu appears
        if(compareBox.checked()) {
            this.compare = true;
            compare_region_sel.show();
        } else {
            this.compare = false;
            compare_region_sel.hide();
        }

        // basic conditional to determine whether the preload data has been loaded or not.
        // if not, user is shown a loading message currently in the console
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the region and year we're interested in from the selected items.
        var region = region_sel.value();
        var year = year_sel.value();
        var compare_region = compare_region_sel.value();

        // function call for toggle snapshot display
        toggleSnapshotDisplay(region, year);

        // Only displaying header label when a sel value has been selected.
        // this conditional rules out the default options as a selection
        if(region != "Please select a region" && region != "---" && year != "Please select a year" && year != "---") {

            // function call to display the graph legend
            graphLegend(this.compare, region, compare_region);

            // Get the rows of raw data for the selected region and compare region.
            var rows = this.data.findRows(region, 'Name');
            var compare = this.data.findRows(compare_region, 'Name');

            // Filter rows and compare to retain only items that include the selected year.
            rows = rows.filter(function(item) {
                return item.arr[0].includes(year);
            });

            compare = compare.filter(function(item) {
                return item.arr[0].includes(year);
            });

            // function call to sort the data
            // sortRegionData returns an object with two properties
            // therefore each property from the object must be reassigned variable names in order to use the values
            var myRegionData = sortRegionData(rows);
            var regionValue = myRegionData.regionValue;
            var regionData = myRegionData.regionData;

            // while loop that checks if tempDataCount is less than the number of elements in the regionValue
            while(tempDataCount < regionValue.length) {
                // for each iteration, push an object into the tempData array with one key/value of value:0.
                // the tempData will eventually contain the same number of elements as regionValue
                // with all values set to 0
                var data = {
                    value: 0,
                };
                tempData.push(data);

                // increment tempDatacount
                tempDataCount += 1;
            }

            // while loop that checks if compareTempDataCount is less than the number of elements in the regionValue
            while(compareTempDataCount < regionValue.length) {
                // for each iteration, push an object into the compareTempData array with one key/value of value:0.
                // the compareTempData will eventually contain the same number of elements as regionValue
                // with all values set to 0
                var data = {
                    value: 0,
                };
                compareTempData.push(data);

                // increment compareTempDatacount
                compareTempDataCount += 1;
            }

            // remap mouseX so it only returns integers
            var myMouseX = Math.round(map(mouseX, 0, width, 0, width));

            // function call to draw the linegraph
            // this conditional statement checks whether the user has selected the compare option
            if(!this.compare) {
                // if the user has not selected the compare option, only 4 arguments are passed
                this.lineGraph.draw(myMouseX, tempData, regionData, regionValue);
            } else {
                // function call to sort the data
                // sortRegionData returns an object with two properties
                // therefore each property from the object must be reassigned variable names in order to use the values
                var myCompareData = sortRegionData(compare);
                var compareValue = myCompareData.regionValue;
                var compareData = myCompareData.regionData;

                // if user has selected the compare option, 3 more arguments are passed - the data for the compare region
                this.lineGraph.draw(myMouseX, tempData, regionData, regionValue, compareTempData, compareData, compareValue); 
            }
        }
    };

    // this method saves whatever is on the canvas
    this.snapshot = function(c) {
        saveCanvas(this.c, 'Test', 'png');
    }
}
