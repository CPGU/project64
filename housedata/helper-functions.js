function stringsToNumbers (array) {
  return array.map(Number);
}

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

function createYearDropdownMenu() {
    year_sel = createSelect();
    year_sel.parent('year-select');
    year_sel.id('yearSelection');
}

function removeRegionDuplicates(items) {
    items = new Set(items);
    items = Array.from(items);
    return items;
}

function removeYearDuplicates(items) {
    let yearSet = new Set();
    for(var i=0; i<items.length; i++) {
        yearSet.add(items[i].split('-')[0]);
    }
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
    var data = new Object();
    data.regionValue = regionValue;
    data.regionData = regionData;
    return data;
}

function drawLineGraph(data, value, range, r, g, b) {
    push();
    stroke(r, g, b);
    beginShape();
    for(var i=0; i<data.length; i++) {
        //fill(0);
        noFill();
        var x = map(i, 0, data.length, 0, canvas_width);
        var max_h = -map(data[i].value, 0, max(range),height/20, canvas_height-height/20);
        vertex(x, canvas_bottom_y + max_h);
    }
    endShape();
    pop();
}

function graphLines(data, x, i) {
    push()
    var month = data[i].date.split('-')[1]
    if(month == '01') {
        stroke(255,0,0, 120);
    } else {
        stroke(255,0,0, 50);
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
        var regionContext = region_sel.value() + ": " + formatNumber(data[i].value);
        var compareContext = getCompareContext(object, compareData, i);
        var maxLabelWidth = getMaxLabelWidth(object, labelTitle, regionContext, compareContext);
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        // add elseif to translate label box if y is greater than canvas bottom y
        checkLabelBoundaries(rectWidth);
        fill(255,255,0,230);
        setLabelBoxHeight(object, compareData, rectWidth);
        renderLabelContext(object, compareData, labelTitle, regionContext, compareContext, offset);
    } else if(object.name.includes('Average')) {
        var date = formatDate(data[i].date);
        var labelTitle = "Average Price for " + date;
        var regionContext = region_sel.value() + ": £" + formatNumber(Math.round(data[i].value * 100)/100);
        var compareContext = getCompareContext(object, compareData, i);
        var maxLabelWidth = getMaxLabelWidth(object, labelTitle, regionContext, compareContext);
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        // add elseif to translate label box if y is greater than canvas bottom y
        checkLabelBoundaries(rectWidth);
        fill(255,255,0,230);
        setLabelBoxHeight(object, compareData, rectWidth);
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

function checkLabelBoundaries(rectWidth) {
    if(mouseX + 10 + rectWidth >= width) {
        translate(mouseX - 10 - rectWidth, mouseY+10);
    } else {
        translate(mouseX+10, mouseY+10);
    }
}

function setLabelBoxHeight(object, compareData, rectWidth) {
    if(object.compare && compareData.length > 0) {
        rect(0,0, rectWidth, height/15+textAscent()*3);
    } else {
        rect(0,0, rectWidth, height/15+textAscent());
    }
}

function renderLabelContext(object, compareData, title, region, compare, offset) {
    fill(0);
    textStyle(BOLD);
    text(title, offset, 20);
    textStyle(NORMAL);
    text(region, offset, height/30+textAscent()*2);
    if(object.compare && compareData.length > 0) {
        text(compare, offset, height/30+textAscent()*4);
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
    return Number(number).toLocaleString('en');
}

function createSnapshotButton(object) {
    var button = createButton("Snapshot <i class='fa fa-camera'></i>");
    button.id('snapshot')
    button.parent('snapshot-button');
    button.mousePressed(object.snapshot);
}

function toggleSnapshotDisplay(region, year) {
    if(year === undefined) {
        if(region != "Please select a region" && region != "---") {
            $('#snapshot-button').show();
        } else {
            $('#snapshot-button').hide();
        }
    } else {
        if(region != "Please select a region" && region != "---" && year != "Please select a year" && year != "---") {
            $('#snapshot-button').show();
        } else {
            $('#snapshot-button').hide();
        }
    }
}
