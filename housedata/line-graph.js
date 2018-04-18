function LineGraph() {

    this.draw = function(mouseXPos, dataList, valueList) {

        beginShape();
        for(var i=0; i<dataList.length; i++) {
            //fill(0);
            noFill();
            var x = map(i, 0, dataList.length, 0, canvas_width);
            var max_h = -map(dataList[i].value, 0, max(valueList),0, canvas_height);
            
            //rect(x, canvas_bottom_y, canvas_width/regionData.length, max_h);
            //
            push()
            var month = dataList[i].date.split('-')[1]
            if(month == '01') {
                stroke(255,0,0, 120);
                line(x, canvas_bottom_y-60, x, 0);
            } else {
                stroke(255,0,0, 50);
                line(x, canvas_bottom_y - 70, x, 0);
            }
            pop();
            vertex(x, canvas_bottom_y + max_h);
        }
        endShape();

        // create function for drawing data labels
        for(var i=0; i<dataList.length; i++) {
            var x = map(i, 0, dataList.length, 0, canvas_width);
            var max_h = -map(dataList[i].value, 0, max(valueList),0, canvas_height);
            if(mouseXPos < Math.round(x) + 2 && mouseXPos > Math.round(x) - 2) {
                push();
                strokeWeight(8);
                fill(0);
                point(x, canvas_bottom_y + max_h);
                push();
                strokeWeight(1);
                fill(255,255,0,230);
                if(mouseX + 170 >= width) {
                    translate(mouseX-170, mouseY+10);
                } else {
                    translate(mouseX+10, mouseY+10);
                }
                rect(0,0, 160, 60);
                fill(0);
                text("sales volume: " + dataList[i].value, 20,20);
                text("date: " + dataList[i].date, 20,50);
                pop();
                pop();
            }
        }

        line(mouseX, canvas_bottom_y, mouseX, 0);

        for(var i=0; i<dataList.length; i+=12) {
            var year = dataList[i].date.split('-')[0]
            var x = map(i, 0, dataList.length, 0, canvas_width);
            fill(0);
            text(year, x, canvas_bottom_y - 100);
        }
    };
}
