function createRegionDropdownMenu() {
    region_sel = createSelect();
    region_sel.parent('region-select');
    region_sel.id('regionSelection');
}

function createCompareCheckbox() {
    compareBox = createCheckbox('Compare', false);
    compareBox.parent('compare-box');
}

function createRegionCompareDropdownMenu() {
    compare_region_sel = createSelect();
    compare_region_sel.parent('compare-region-select');
    compare_region_sel.id('compareRegionSelection');
    compare_region_sel.hide();
}

function createNavbarRegionDropdownMenu() {
    region_sel = createSelect();
    region_sel.parent('region-select');
    region_sel.id('navbarRegionSelection');
    region_sel.option('---')
}

function createYearDropdownMenu() {
    year_sel = createSelect();
    year_sel.parent('year-select');
    year_sel.id('yearSelection');
}

// function which removes all duplicate region values. This is beacuse the CSV file includes duplicate values 
function removeRegionDuplicates(items) {
    // the set object lets us store unique region values.
    items = new Set(items);
    // the Array.from() method then creates a new array from the items varaible.
    items = Array.from(items);
    return items;
}

// function which removes all duplicate year values. This is beacuse the CSV file includes duplicate values 
function removeYearDuplicates(items) {
    // the set object lets us store unique year values.
    let yearSet = new Set();
    // for loop to iterate through the years
    for(var i=0; i<items.length; i++) {
        yearSet.add(items[i].split('-')[0]);
    }
    // the Array.from() method then creates a new array from the items varaible.
    var yearList = Array.from(yearSet);
    return yearList;
}

function fillDropdownMenu(items, menu) {
    for(var i=0; i<items.length; i++) {
        menu.option(items[i]);
    }
}

function sortRegionData(items) {
    var regionValue = [];
    var regionData = [];
    for(var i=0; i<items.length; i++) {
        var data = {
            date: items[i].arr[0],
            region: items[i].arr[1],
            value: items[i].arr[2],
        }
        regionValue.push(data.value);
        regionData.push(data);
    }
    var dataObject = new Object();
    dataObject.regionValue = regionValue;
    dataObject.regionData = regionData;
    return dataObject;
}

function drawLineGraph(tempData, data, value, range, r, g, b) {
    push();
    stroke(r, g, b);
    beginShape();
    for(var i=0; i<data.length; i++) {
        if(tempData[i].value + data[i].value/60 < data[i].value) {
            var max_h = -map(tempData[i].value, 0, max(range),height/20, canvas_height-height/10);
            var myRandom = Math.floor(Math.random()*30)+1;
            tempData[i].value += data[i].value/myRandom;
        } else {
            var max_h = -map(data[i].value, 0, max(range),height/20, canvas_height-height/10);
        }
        noFill();
        var x = map(i, 0, data.length, 0, canvas_width);
        vertex(x, canvas_bottom_y + max_h);
    }
    endShape();
    pop();
}

function graphLines(data, x, i) {
    push()
    var month = data[i].date.split('-')[1]
    if(month == '01') {
        stroke(200,200,200, 120);
    } else {
        stroke(200,200,200, 50);
    }
    line(x, canvas_bottom_y, x, 0);
    pop();
}

function drawLabel(object, i, data, compareData) {
    push();
    strokeWeight(1);
    // determine if average sales or sales volume data
    if(object.name.includes('Sales')) {
        var date = formatDate(data[i].date);
        var labelTitle = "Sales Volume for " + date;
        var regionContext = decodeURI(getRequestURL(url)) + ": " + formatNumber(data[i].value);
        var compareContext = getCompareContext(object, compareData, i);
        var maxLabelWidth = getMaxLabelWidth(object, labelTitle, regionContext, compareContext);
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        checkLabelBoundaries(object, rectWidth);
        fill(255,255,0,230);
        renderLabelBoxWithHeight(object, compareData, rectWidth);
        renderLabelContext(object, compareData, labelTitle, regionContext, compareContext, offset);
    } else if(object.name.includes('Average')) {
        var date = formatDate(data[i].date);
        var labelTitle = "Average Price for " + date;
        var regionContext = decodeURI(getRequestURL(url)) + ": £" + formatNumber(Math.round(data[i].value * 100)/100);
        var compareContext = getCompareContext(object, compareData, i);
        var maxLabelWidth = getMaxLabelWidth(object, labelTitle, regionContext, compareContext);
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        checkLabelBoundaries(object, rectWidth);
        fill(255,255,0,230);
        renderLabelBoxWithHeight(object, compareData, rectWidth);
        renderLabelContext(object, compareData, labelTitle, regionContext, compareContext, offset);
    }
    pop();
}

function getCompareContext(object, compareData, i) {
    if(object.compare && compareData.length > 0) {
        var compareContext = compare_region_sel.value() + ": " + formatNumber(compareData[i].value);
    }
    return compareContext
}

function getMaxLabelWidth(object, title, region, compare) {
    if(textWidth(title) >= textWidth(region)) {
        var maxLabelWidth = textWidth(title);
    } else {
        var maxLabelWidth = textWidth(region);
    }
    if(compare !== undefined) {
        if(textWidth(compare) >= textWidth(title)) {
            if(textWidth(compare) >= textWidth(region)) {
                var maxLabelWidth = textWidth(compare);
            }
        }
    }
    return maxLabelWidth;
}

function checkLabelBoundaries(object, rectWidth) {
    if(mouseX + 10 + rectWidth >= width) {
         translate(mouseX - 10 - rectWidth, mouseY+10);
    } else {
        translate(mouseX+10, mouseY+10);
    }

    if(!object.compare) {
        var offset = height/15+textAscent();
    } else {
        var offset = height/15+textAscent()*3;
    }

    if(mouseY + 10 + offset >= height) {
        translate(0, -10 - offset);
    }
}

function renderLabelBoxWithHeight(object, compareData, rectWidth) {
    if(object.compare && compareData.length > 0) {
        rect(0,0, rectWidth, height/15+textAscent());
    } else {
        rect(0,0, rectWidth, height/15);
    }
}

function renderLabelContext(object, compareData, title, region, compare, offset) {
    fill(0);
    textStyle(BOLD);
    text(title, offset, height/30);
    textStyle(NORMAL);
    text(region, offset, height/30+textAscent());
    if(object.compare && compareData.length > 0) {
        text(compare, offset, height/30+textAscent()*2);
    }
}

function formatDate(rawDate) {
    var splitDate = rawDate.split('-');
    return {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
    }[splitDate[1]] + " " + splitDate[0];
}

function formatNumber(number) {
    // this method returns the number string represented to english'
    return Number(number).toLocaleString('en');
}

// this function is used to display a snapshot button
function createSnapshotButton(object) {
    // the button uses font-awesome web icons to place a camera icon in the moment
    var button = createButton("Snapshot <i class='fa fa-camera'></i>");
    // assign the button to a ID so it can be styled
    button.id('snapshot')
    // attaches the button to a specifed parent. This is a way of setting the container for the element
    button.parent('snapshot-button');
    // the mouse pressed function is used to call another function or object once the button has been pressed
    button.mousePressed(object.snapshot);
}

// This function is used to only display the snapshot button when there is content to save
function toggleSnapshotDisplay(region, year) {
    // if there is no year selected    
    if(year === undefined) {
        // if the region dropdown value is not 'Please select a region' or '---' then display the snapshot button
        if(region != "Please select a region" && region != "---") {
            $('#snapshot-button').show();
        // if the region dropdown value is 'Please select a region' or '---' then hide the snapshot button
        } else {
            $('#snapshot-button').hide();
        }
    // if a year is selected   
    } else {
        // if the region and year dropdown value is not 'Please select a region', '---' or 'Please select a year' then display the snapshot button
        if(region != "Please select a region" && region != "---" && year != "Please select a year" && year != "---") {
            $('#snapshot-button').show();
        // if the region and uear dropdown value is 'Please select a region', '---' or 'Please select a year' then hide the snapshot button
        } else {
            $('#snapshot-button').hide();
        }
    }
}

function graphLegend(compare, region, compareRegion) {
    // do not use absolute values
    push();
    textSize(14);
    fill(0,204,102);
    rect(width/40,height/20, width/80, -width/80);
    fill(0);
    text(region, width/20, height/20);
    pop();
    if(compare) {
        if(compare_region_sel.value() != "Please select a region to compare") {
            push();
            textSize(14);
            fill(255, 102, 102);
            rect(width/40, height/20+textAscent()*1.5, width/80, -width/80);
            fill(0);
            text(compareRegion, width/20, height/20+textAscent()*1.5);
            pop();
        }
    }
}

function getSelectedYearData(rows, year) {
    return rows.filter(function(item) {
        return item.arr[0].includes(year);
    });
}

function createTemporaryDataArray(count, array, tempArray) {
    // while loop that checks if count is less than the number of elements in the array 
    while(count < array.length) {
        // for each iteration, push an object with one key/value of value:0 into the tempArray.
        // the tempArray will eventually contain the same number of elements as array with all values set to 0
        var data = {
            value: 0,
        };
        tempArray.push(data);

        // increment count 
        count += 1;
    }
}

// function that grabs the url and splits to return the region value
function getRequestURL(url) {
    // grabs the current url of a page.
    url = getURL();
    // grabs the value after 'region=' and then stores in the newURL variable.
    newURL = split(url, 'region=');
    // returns the value of the url string
    return newURL[1];
}

function joinText(text) {
    return text.split(" ").join("_");
}

// function that validates the url to see if the GET request is valid, if not redirect to index.html?errorValidation which displays an error message 
function regionValidation(urlRegion, regionsArray) {
    // potentiall need to add an error message
    if(!regionsArray.includes(urlRegion)) {
        var invalidRegion = urlRegion;
        // redirects the user to the index page where it will display an error message.
        window.location = 'index.html?errorValidation';
    }
}
