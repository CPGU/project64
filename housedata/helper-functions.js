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
    region_sel.position(300,100);
}

function createYearDropdownMenu() {
    year_sel = createSelect();
    year_sel.position(500,100);
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
