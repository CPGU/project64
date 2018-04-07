function SalesVolumesByRegion() {
    this.loaded = false;
    this.preload = function() {
        var self = this;
        this.table = loadTable(
            'data/Sales-Volumes.csv', 'csv', 'header',
            function(data) {
                self.loaded = true;
            }
        );
    };

    this.setup = function() {
        var regions = this.table.getColumn('Name');
        regions = new Set(regions);
        regions = Array.from(regions);
        console.log(this.table);
        console.log(regions);
        region_sel = createSelect();
        region_sel.position(300,300);
        for(var i=0; i<regions.length; i++) {
            region_sel.option(regions[i]);
        }
        //region_sel.changed(this.draw())
    };
}
