var cx = cx || {};

cx.Square = function(row, column, opts) {
  opts = $.extend({}, this.DEFAULTS, opts);
  this.row = row;
  this.column = column;
  this.hue = [opts.hue];
  this.saturation = [opts.saturation];
  this.luminosity = [opts.luminosity];
  this.setCoordinates(opts.x1, opts.y1, opts.x2, opts.y2);
};

cx.Square.prototype.DEFAULTS = {
  hue:        0,
  saturation: 100,
  luminosity: 100,
  x1: 0,
  y1: 1,
  x2: 10,
  y2: 11
};

cx.Square.prototype.attributeExist = function(attribute) {
  return !!this[attribute];
}

cx.Square.prototype.getAttribute = function(attribute, index) {
  if (this.attributeExist(attribute)) {
    index = index || 0;
    return this[attribute][index];   
  } else {
    throw("Attribute [" + attribute + "] does not exist");
  }
};

cx.Square.prototype.queueAttribute = function(attribute, value) {
  this[attribute].push(value);
  return this[attribute];
};

cx.Square.prototype.nextAttribute = function(attribute) {
  return this[attribute].shift();
};

cx.Square.prototype.setCoordinates = function(x1, y1, x2, y2) {
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;
};

cx.SquareCollection = function(squares) {
  this.squares = squares;
};

cx.SquareCollection.prototype.size = function() {
  return this.squares.length;
};

cx.SquareCollection.prototype.listAttribute = function(attribute) {
  return this.squares.map(function(square) {
    return square.getAttribute(attribute);
  });
};
