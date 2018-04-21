function sum(data) {
  var total = 0;

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function sliceRowNumbers (row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers (array) {
  return array.map(Number);
}

function createRegionDropdownMenu() {
    region_sel = createSelect();
    region_sel.position(400,100);
    region_sel.id('regionSelection');
}

function createCompareCheckbox() {
    compareBox = createCheckbox('Compare', false);
    compareBox.position(1000,100);
}

function createRegionCompareDropdownMenu() {
    compare_region_sel = createSelect();
    compare_region_sel.position(1000,150);
    compare_region_sel.id('compareRegionSelection');
    compare_region_sel.hide();
}

function createYearDropdownMenu() {
    year_sel = createSelect();
    year_sel.position(400,140);
    year_sel.id('regionSelection');
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
        var labelTitle = "Sales Volume for " + date + "\n";
        var regionContext = region_sel.value() + ": " + data[i].value;
        var labelContext = labelTitle + regionContext;
        if(textWidth(labelTitle) >= textWidth(regionContext)) {
            var maxLabelWidth = textWidth(labelTitle);
        } else {
            var maxLabelWidth = textWidth(regionContext);
        }
        if(object.compare) {
            if(compareData.length > 0) {
               var  compareContext = compare_region_sel.value() + ": " + compareData[i].value;
                if(textWidth(compareContext) >= textWidth(labelTitle)) {
                    if(textWidth(compareContext) >= textWidth(regionContext)) {
                        var maxLabelWidth = textWidth(compareContext);
                    }
                }
                labelContext += "\n" + compareContext;
            }
        }
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        // add elseif to translate label box if y is greater than canvas bottom y
        if(mouseX + 10 + rectWidth >= width) {
            translate(mouseX - 10 - rectWidth, mouseY+10);
        } else {
            translate(mouseX+10, mouseY+10);
        }
        fill(255,255,0,230);
        rect(0,0, rectWidth, 60);
        fill(0);
        text(labelContext, offset, 20);
        //text("sales volume for " + region_sel.value() + "\n" + dataList[i].value, 20,20);
    } else if(object.name.includes('Average')) {
        var date = formatDate(data[i].date);
        var labelTitle = "Average Price for " + date + "\n";
        var regionContext = region_sel.value() + ": £" + Math.round(data[i].value * 100)/100;
        var labelContext = labelTitle + regionContext;
        if(textWidth(labelTitle) >= textWidth(regionContext)) {
            var maxLabelWidth = textWidth(labelTitle);
        } else {
            var maxLabelWidth = textWidth(regionContext);
        }
        if(object.compare) {
            if(compareData.length > 0) {
               var  compareContext = compare_region_sel.value() + ": £" + Math.round(compareData[i].value * 100)/100;
                if(textWidth(compareContext) >= textWidth(labelTitle)) {
                    if(textWidth(compareContext) >= textWidth(regionContext)) {
                        var maxLabelWidth = textWidth(compareContext);
                    }
                }
                labelContext += "\n" + compareContext;
            }
        }
        var offset = maxLabelWidth/8; 
        var rectWidth = maxLabelWidth+(offset*2);
        // add elseif to translate label box if y is greater than canvas bottom y
        if(mouseX + 10 + rectWidth >= width) {
            translate(mouseX - 10 - rectWidth, mouseY+10);
        } else {
            translate(mouseX+10, mouseY+10);
        }
        fill(255,255,0,230);
        rect(0,0, rectWidth, 60);
        fill(0);
        text(labelContext, offset, 20);
        //text("sales volume for " + region_sel.value() + "\n" + dataList[i].value, 20,20);
    }
    pop();
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
    return number.toLocaleString('en');
}
