function BarGraph() {
    this.draw = function(dataList, valueList) {
        for(var i=0; i<dataList.length; i++) {
            fill(0);
            var x = map(i, 0, dataList.length, 0, canvas_width);
            var max_h = -map(dataList[i].value, 0, max(valueList),0, canvas_height);
            
            rect(x, canvas_bottom_y, canvas_width/dataList.length, max_h);
        }
    };
}
