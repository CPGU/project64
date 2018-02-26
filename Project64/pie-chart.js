function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 20;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title) {
    // https://p5js.org/examples/form-pie-chart.html

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    for (var i = 0; i < data.length; i++) {
      fill(colours[i]);
        rect(800+i, 50*i+20, 20, 20);
        text(labels[i], 800+i, 50*i+20);
      arc(
        this.x, this.y,
        this.diameter, this.diameter,
        lastAngle, lastAngle + angles[i] + 0.001 // Hack for 0!
      );
      lastAngle += angles[i]
    }
  };

  this.makeLegendItem = function(label, i, colour) {
    for(var i = 0; i < label.length; i++) {
      fill(colours[i]);
      rect(800+i, 50*i+20, 20, 20);
      text(labels[i], 800+i, 50*i+20);
    }
  };
}
