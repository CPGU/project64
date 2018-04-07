function SalesVolumesByRegion() {
    this.preload = function() {
        this.table = loadTable("data/Sales-Volumes.csv", "csv", "header");
    }

    this.setup = function() {
        console.log(this.table);
        console.log(this.table.name);
        console.log(this.table.rows);
        console.log(this.table.columns);
        console.log(this.table.getColumn('Name'));

        //var regions = this.table.getColumn('Name');
        region_sel = createSelect();
        region_sel.position(100,100);
        for(var i=0; i<10; i++) {
            region_sel.option('Hello');
            console.log('Hello');
            console.log(this.table);
        }
        //region_sel.changed(this.draw())
    }
}
