function LineGraph(object) {
    this.object = object;

    this.draw = function(mouseXPos, tempData, dataList, valueList, compareTempData, compareDataList, compareValueList) {

        // draw compare graph. 2nd graph
        // if compare mode is on ie the object's compare property is is true
        //if(compareDataList !== undefined && compareValueList !== undefined) {
        if(this.object.compare) {
            valueRange = valueList.concat(compareValueList);
            drawLineGraph(compareTempData, compareDataList, compareValueList, valueRange, 255, 102, 102);
        } else {
            valueRange = valueList;
        }

        // draw original graph
        // first graph
        drawLineGraph(tempData, dataList, valueList, valueRange, 0, 204, 102);

        // create function for drawing data labels
        for(var i=0; i<dataList.length; i++) {
            var x = map(i, 0, dataList.length, 0, canvas_width);
            var max_h = -map(dataList[i].value, 0, max(valueRange),height/20, canvas_height-height/10);
            if(this.object.compare) {
                if(compareDataList.length > 0) {
                    var compare_max_h = -map(compareDataList[i].value, 0, max(valueRange),height/20, canvas_height-height/10);
                }
            }

            graphLines(dataList, x, i);

            if(mouseXPos < Math.round(x) + width/(dataList.length*2) && mouseXPos > Math.round(x) - width/(dataList.length*2)) {
                push();
                strokeWeight(8);
                fill(0);
                point(x, canvas_bottom_y + max_h);
                if(this.object.compare) {
                    point(x, canvas_bottom_y + compare_max_h);
                }
                drawLabel(this.object, i, dataList, compareDataList);
                pop();
            }
        }

        line(mouseX, canvas_bottom_y, mouseX, 0);

        for(var i=0; i<dataList.length; i+=12) {
            var year = dataList[i].date.split('-')[0]
            var x = map(i, 0, dataList.length, 0, canvas_width);
            fill(0);
            text(year, x, graph_bottom);
        }

    };
}
