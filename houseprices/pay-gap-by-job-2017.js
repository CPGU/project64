function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 20;
  this.dotSizeMax = 50;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');

    // Use full 100% for x-axis.
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For pay gap axis use a symmetrical axis equal to the largest
    // gap direction so that equal pay (0% pay gap) is in the centre
    // of the canvas.
    var payGapMin = min(payGap);
    var payGapMax = max(payGap);
    var payGapScale = max(payGapMin, payGapMax);

    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      x = map(propFemale[i], propFemaleMin, propFemaleMax, this.pad, width - this.pad)
      y = map(payGap[i], -payGapScale, payGapScale, height - this.pad, this.pad)
      size = map(numJobs[i], numJobsMin, numJobsMax, this.dotSizeMin, this.dotSizeMax)

      ellipse(
        x,
        y,
        size
      );

    }

    this.addAxes();
  };

  this.addAxes = function () {
    // Add vertical line.
    line(
      width / 2,
      0 + this.pad,
      width / 2,
      height - this.pad
    );

    // Add horizontal line.
    line(
      0 + this.pad,
      height / 2,
      width - this.pad,
      height / 2
    );

  };
}
