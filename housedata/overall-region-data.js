function OverallRegionData(c) {
    this.name = 'Overall Region Data';

    this.id = 'overall-region-data';

    this.loaded = false;

    this.compare = false;

    this.preload = function() {
        var self = this;
        this.averagePriceTable = loadTable(
            'data/Average-Prices-SA-SM.csv', 'csv', 'header',
            function(table) {
                if(!self.loaded) {
                    self.loaded = true;
                }
            }
        );
        this.salesVolumeTable = loadTable(
            'data/Sales-Volumes.csv', 'csv', 'header',
            function(table) {
                if(!self.loaded) {
                    self.loaded = true;
                }
            }
        );
    };

    this.setup = function() {
        if(!this.loaded) {
            console.log("Data not yet loaded!");
            return;
        }

        // Create a select DOM element.
        createRegionDropdownMenu();

        // Fill the options with all region names.
        var regions = this.salesVolumeTable.getColumn('Name');
        regions = removeRegionDuplicates(regions);

        // Set default option
        region_sel.option('Please select a region');
        region_sel.option('---');

        // fill the dropdown menu with options
        fillDropdownMenu(regions, region_sel);

        region_sel.changed(this.resetCounts, this.draw);

        canvas_width = $("canvas").width();
        canvas_height = $("canvas").height();
        canvas_bottom_y = $("canvas").position().top + canvas_height - 80;
        graph_bottom = canvas_bottom_y - height/50;

        //add comparison
        //
        //
        whileCount = 0;
        totalSpend = 0;
        currentMonthlyAmount = 0;
        currentYearlyAmount = 0;
        currentOverallAmount = 0;
    };

    this.resetCounts = function() {
        whileCount = 0;
        totalSpend = 0;
        currentMonthlyAmount = 0;
        currentYearlyAmount = 0;
        currentOverallAmount = 0;
    };

    this.destroy = function() {
        removeElements();
    };

    this.barGraph = new BarGraph();

    this.lineGraph = new LineGraph(this);

    this.totalSpend = function() {
        var region = region_sel.value();
        var salesVolume = this.salesVolumeTable.findRows(region, 'Name');
        var averagePrice = this.averagePriceTable.findRows(region, 'Name');
        if(salesVolume.length > 0) {
            while(whileCount < salesVolume.length) {
                totalSpend += salesVolume[whileCount].arr[2] * averagePrice[whileCount].arr[2];
                whileCount += 1;
            }
            totalSpend = Math.round(totalSpend*100)/100;
        }
    }

    this.draw = function() {
        if(!this.loaded) {
            console.log("Data not yet loaded");
            return;
        }
        //this.salesVolumeTotal();
        //this.averagePriceTotal();
        this.totalSpend();

        var region = region_sel.value();
        if(region == "Please select a region" || region == "---") {
        } else {
            var overallSpendText = "Total spend from Jan 1995 to Jan 2016: ";
            text(overallSpendText, width/6, height/6);
            if(currentOverallAmount + Math.round(totalSpend/240*100)/100 < totalSpend) {
                currentOverallAmount += Math.round(totalSpend/240*100)/100;
            } else {
                currentOverallAmount = totalSpend;
            }
            var overallSpendAmount = text("£" + formatNumber(currentOverallAmount), width/6+textWidth(overallSpendText), height/6);

            var yearlyAvgText = "Yearly Avg: ";
            text(yearlyAvgText ,width/6, height/6+textAscent()*2);
            var yearly = Math.round(totalSpend/20*100)/100;
            if(currentYearlyAmount + Math.round(yearly/240*100)/100 < yearly) {
                currentYearlyAmount += Math.round(yearly/240*100)/100;
            } else {
                currentYearlyAmount = yearly;
            }
            var yearlyAvgAmount = text("£" + formatNumber(currentYearlyAmount), width/6+textWidth(yearlyAvgText), height/6+textAscent()*2);

            var monthlyAvgText = "Monthly Avg: ";
            text(monthlyAvgText, width/6, height/6+textAscent()*4);
            var monthly = Math.round(totalSpend/240*100)/100;
            if(currentMonthlyAmount + Math.round(monthly/240*100)/100 < monthly) {
                currentMonthlyAmount += Math.round(monthly/240*100)/100;
            } else {
                currentMonthlyAmount = monthly;
            }
            var monthlyAvgAmount = text("£" + formatNumber(currentMonthlyAmount),width/6+textWidth(monthlyAvgText),height/6+textAscent()*4);
        }

        // Only displaying header label when a sel value has been selected.
        if(region == "Please select a region") {
            
        } else {
            push();
            textSize(32);
            text(region, 10, 30);
            pop();

            button = createButton("Snapshot <i class='fa fa-camera'></i>");
            button.position(400,140);
            button.id('snapshot');
            button.mousePressed(this.snapshot);
        }

    };

    this.snapshot = function(c) {
        saveCanvas(this.c, 'Test', 'png');
    }
}
