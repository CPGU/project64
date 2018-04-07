$(function() {
  $('#figure-menu').menu({
    select: function(event, ui) {
      gallery.selectFigure(ui.item.attr('value'));
    }});
});
