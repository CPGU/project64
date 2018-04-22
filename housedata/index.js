function preload() {
    data = loadTable('data/Average-Prices-SA-SM.csv', 'csv', 'header');
}

function setup() {
    region_sel = createSelect();
    region_sel.parent('dropdown_region');
    region_sel.id('home_region_select');

    var regions = data.getColumn('Name');
    
    regions = removeRegionDuplicates(regions);
    region_sel.option('');

    // fill the dropdown menu with region options
    fillDropdownMenu(regions, region_sel);

    region_sel.changed(GoTo);
}

function GoTo() {
    window.location.href = 'data.html?region=' + region_sel.value();
}
