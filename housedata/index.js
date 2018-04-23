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

    // call the validate error function
    validateErrorURL();
}

function GoTo() {
    // Redirecting the user to data.html using a get request.
    window.location.href = 'data.html?region=' + region_sel.value();
}

function validateErrorURL() {
    // grab the url content
    errorURL = getURL();
    // split the url
    errorURL = split(errorURL, '?');
    // if the url contains other values, display alert box.
    if(errorURL[1]) {
        $('#errorAlert').show();
    }
}   
