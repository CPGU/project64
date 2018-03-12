function Gallery() {

  this.figures = [];
  this.selectedFigure = null;

  // Add a new figure to the navigation bar.
  this.addFigure = function(fig) {

    // Check that the object fig has a name.
    if (!fig.hasOwnProperty('id')
        && !fig.hasOwnProperty('name')) {
      // TODO: Check name is unique.
      alert('Make sure your figure has an id and name!');
    }

    this.figures.push(fig);

    var menuItem = document.createElement('li');
    menuItem.classList.add('ui-menu-item');

    var menuItemWrapper = document.createElement('div');
    menuItemWrapper.classList.add('ui-menu-item-wrapper');
    menuItemWrapper.setAttribute('role', 'menuitem');
    menuItemWrapper.innerHTML = fig.name;

    menuItem.setAttribute('value', fig.id);

    menuItem.appendChild(menuItemWrapper);
    $('#figure-menu').append(menuItem);

    // Preload data if necessary.
    if (fig.hasOwnProperty('preload')) {
      fig.preload();
    }
  };

  this.selectFigure = function(figId){
    // console.log('selectFigure:', figId);

    // Search through the figures looking for one with the id
    // matching figId.
    for (var i = 0; i < this.figures.length; i++) {
      if (this.figures[i].id == figId) {
        // If the figure has a deselect method run it.
        if (this.selectedFigure != null
           && this.selectedFigure.hasOwnProperty('destroy')) {
          this.selectedFigure.destroy();
        }
        // Select the figure in the gallery.
        this.selectedFigure = this.figures[i];

        // Initialise visualisation if necessary.
        if (this.selectedFigure.hasOwnProperty('setup')) {
          this.selectedFigure.setup();
        }
      }
    }
  };
}
