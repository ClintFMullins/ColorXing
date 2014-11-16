cx = cx || {};

cx.Player = function(opts) {
  opts = $.extend({}, this.DEFAULTS, opts);
  this.rowIndex = opts.rowIndex;
  this.columnIndex = opts.columnIndex;
  this.hue = opts.hue;
};

cx.Player.prototype.DEFAULTS = {
  rowIndex:    0,
  columnIndex: 0,
  hue:         0
};