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
        var regionContext = region_sel.value() + ": " + formatNumber(data[i].value);
        var compareContext = getCompareContext(object, compareData, i);
        var maxLabelWidth = getMaxLabelWidth(object, labelTitle, regionContext, compareContext);
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        // add elseif to translate label box if y is greater than canvas bottom y
        checkLabelBoundaries(object, rectWidth);
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
        checkLabelBoundaries(object, rectWidth);
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

function setLabelBoxHeight(object, compareData, rectWidth) {
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

function getRequestURL(url) {
    url = getURL();
    newURL = split(url, 'region=');
    return newURL[1];

}
