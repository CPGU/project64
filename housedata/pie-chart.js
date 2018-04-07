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

    push();
    translate(this.x, this.y);
    for (var i = 0; i < data.length; i++) {
        fill(colours[i].r, colours[i].g, colours[i].b);
        noStroke();
        arc(0, 0, this.diameter, this.diameter, lastAngle, lastAngle + angles[i]);
        lastAngle += angles[i];
        //text(labels[i], this.labelSpace,0);
    }
    pop();
  };

  this.makeLegendItem = function(label, i, colour) {
      text(label[i], 150, 300+30*i);
  };
}
