function SalesVolumesByRegion(c) {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Sales Volumes';
    
    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sales-volumes-by-region';

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

        // create a variable and assign it the column with header 'name' from the this.data table
        var regions = this.data.getColumn('Name');

        // call function to remove duplicate region names.
        regions = removeRegionDuplicates(regions);
        
        // validates the url and if an incorrect url is entered, returns user to /data.html
        regionValidation(decodeURI(getRequestURL(url)), regions);

        //comparison
        // call functions to create a Compare check box and a dropdown menu.
        createCompareCheckbox();
        createRegionCompareDropdownMenu();

        // set default options
        compare_region_sel.option('Please select a region to compare');
        compare_region_sel.option('---');

        // fill the compare region sel dropdown menu with options
        fillDropdownMenu(regions, compare_region_sel);

        // when compare_region_sel is changed, call this.compareResetCount and this.draw
        compare_region_sel.changed(this.compareResetCount);
        
        // function call to create a snapshot button
        createSnapshotButton(this);

        // global variables to be used in draw
        // tempData and compareTempData is used as a incrementor for the graph animation.
        // tempData and compareTempData are used to fill with multiple objects initalised with one property of value 0
        tempData = [];
        tempDataCount = 0;
        compareTempData = [];
        compareTempDataCount = 0;

        // create a universal navbar dropdown menu
        createNavbarRegionDropdownMenu();

        // fill dropdown menu
        fillDropdownMenu(regions, region_sel);

        // filter and return only the option element that matches the url region and set it's selected property to true
        $("#navbarRegionSelection option").filter(function(i, e) {
            return $(e).text() == decodeURI(getRequestURL(url));
        }).prop("selected", true);

        // execute this.resetAndReload when region_sel option is changed
        region_sel.changed(this.resetAndReload);
    };

    // when called, this method resets the value of tempData to an empty array and tempDataCount to 0
    // it also updates the url with the new region_sel value
    this.resetAndReload = function() {
        tempData = [];
        tempDataCount = 0;
        window.history.pushState({}, null, '/data.html?region='+region_sel.value());
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

        // Get the value of the region we're interested in from the selected items.
        var region = decodeURI(getRequestURL(url));
        var compare_region = compare_region_sel.value();

        // function call for toggle snapshot display
        toggleSnapshotDisplay(region);

        // function call to display the graph legend
        graphLegend(this.compare, region, compare_region);

        // Get the rows of raw data for the selected region and compare region.
        var rows = this.data.findRows(region, 'Name');
        var compare = this.data.findRows(compare_region, 'Name');

        // function call to sort the data
        // sortRegionData returns an object with two properties
        // therefore each property from the object must be reassigned variable names in order to use the values
        var myRegionData = sortRegionData(rows);
        var regionValue = myRegionData.regionValue;
        var regionData = myRegionData.regionData;

        // function calls for createTemporaryDataArray
        // pass data tempDataCount, regionValue and tempData
        createTemporaryDataArray(tempDataCount, regionValue, tempData);

        // pass data compareTempDataCount, regionValue and compareTempData
        createTemporaryDataArray(compareTempDataCount, regionValue, compareTempData);
        
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
    };

    // this method saves whatever is on the canvas
    this.snapshot = function() {

        if(compareBox.checked()) {
            saveCanvas(c, "Sales_volumes_for_"+joinText(region_sel.value())+"_and_"+joinText(compare_region_sel.value()), 'png');
        } else {
            saveCanvas(c, "Sales_volumes_for_"+joinText(region_sel.value()), 'png');
        }
    };
}
