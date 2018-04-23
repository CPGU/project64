function OverallRegionData() {
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

        //add comparison
        whileCount = 0;
        totalSpend = 0;
        currentMonthlyAmount = 0;
        currentYearlyAmount = 0;
        currentOverallAmount = 0;

        overallInfoDiv = createElement("div");
        overallInfoDiv.id("overallInfo");
        overallInfoDiv.parent("app");

        overallSpendText = createP("Total spend from Jan 1995 to Jan 2016: ");
        overallSpendText.parent("overallInfo");

        overallSpendAmount = createElement("p");
        overallSpendAmount.id("overallSpendAmount");
        overallSpendAmount.parent("overallInfo");

        yearlyAvgText = createP("Yearly Avg: ");
        yearlyAvgText.parent("overallInfo");

        yearlySpendAmount = createElement("p");
        yearlySpendAmount.id("yearlySpendAmount");
        yearlySpendAmount.parent("overallInfo");

        monthlyAvgText = createP("Monthly Avg: ");
        monthlyAvgText.parent("overallInfo");

        monthlySpendAmount = createElement("p");
        monthlySpendAmount.id("monthlySpendAmount");
        monthlySpendAmount.parent("overallInfo");

        var regions = this.salesVolumeTable.getColumn('Name');
        regions = removeRegionDuplicates(regions);

        createNavbarRegionDropdownMenu();
        fillDropdownMenu(regions, region_sel);

        $("#navbarRegionSelection option").filter(function(i, e) {
            return $(e).text() == decodeURI(getRequestURL(url));
        }).prop("selected", true);

        region_sel.changed(this.resetAndReload);
    };

    this.resetAndReload = function() {
        whileCount = 0;
        totalSpend = 0;
        currentMonthlyAmount = 0;
        currentYearlyAmount = 0;
        currentOverallAmount = 0;
        window.history.pushState({}, null, '/data.html?region='+region_sel.value());
        var region = decodeURI(getRequestURL(url));
        $("#navbarRegionSelection option").filter(function(i, e) {
            return $(e).text() == decodeURI(getRequestURL(url));
        }).prop("selected", true);
    };

    this.destroy = function() {
        removeElements();
    };

    this.barGraph = new BarGraph();

    this.lineGraph = new LineGraph(this);

    this.totalSpend = function() {
        var region = decodeURI(getRequestURL(url));
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

        this.totalSpend();

        var region = decodeURI(getRequestURL(url));

        if(region == "Please select a region" || region == "---") {
        } else {
            if(currentOverallAmount + Math.round(totalSpend/120*100)/100 < totalSpend) {
                currentOverallAmount += Math.round(totalSpend/120*100)/100;
            } else {
                currentOverallAmount = totalSpend;
            }
            $("#overallSpendAmount").text("£" + formatNumber(currentOverallAmount));

            var yearly = Math.round(totalSpend/20*100)/100;
            if(currentYearlyAmount + Math.round(yearly/120*100)/100 < yearly) {
                currentYearlyAmount += Math.round(yearly/120*100)/100;
            } else {
                currentYearlyAmount = yearly;
            }
            $("#yearlySpendAmount").text("£" + formatNumber(currentYearlyAmount));

            var monthly = Math.round(totalSpend/240*100)/100;
            if(currentMonthlyAmount + Math.round(monthly/120*100)/100 < monthly) {
                currentMonthlyAmount += Math.round(monthly/120*100)/100;
            } else {
                currentMonthlyAmount = monthly;
            }
            $("#monthlySpendAmount").text("£" + formatNumber(currentMonthlyAmount));
        }

        // Only displaying header label when a sel value has been selected.
        if(region != "Please select a region" && region != "---") {
            push();
            textSize(32);
            text(region, width/2-textWidth(region)/2, 30);
            pop();
        }
    };
}
