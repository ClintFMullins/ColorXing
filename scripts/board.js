var cx = cx || {};

cx.Board = function(opts) {
  opts = $.extend({}, this.DEFAULTS, opts);
  this.rowCount = opts.rowCount;
  this.columnCount = opts.columnCount;
  this.width = opts.width;
  this.height = opts.height;
  this.squareWidth = this.width / this.columnCount;
  this.squareHeight = this.height / this.rowCount;
  this.grid = this.createGrid();
};

cx.Board.prototype.DEFAULTS = {
  width:       500,
  height:      500,
  rowCount:    20,
  columnCount: 20
};

cx.Board.prototype.oneCycle = function() {
  for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
    for (var columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
      var currentSquare = this.grid[rowIndex][columnIndex];
      var adjacentSquares = this.getAdjacent(rowIndex, columnIndex);
      this.queueSquareHue(currentSquare, adjacentSquares);
      currentSquare.nextAttribute("hue");
    }
  }
  this.drawGrid();
}

cx.Board.prototype.queueSquareHue = function(square, adjacentSquares) {
  var averageColor = cx.color.getCircleAverage(adjacentSquares.listAttribute("hue"));
  var nextColorForSquare = cx.color.getInfluencedHue(square.getAttribute("hue"), averageColor);
  square.queueAttribute("hue", nextColorForSquare);
};

cx.Board.prototype.createGrid = function() {
  var tempGrid = [];
  for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
    var row = [];
    for (var columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
      var x1 = columnIndex * this.squareWidth;
      var y1 = rowIndex * this.squareHeight;
      var x2 = x1 + this.squareWidth;
      var y2 = y1 + this.squareHeight;

      var tempSquare = new cx.Square(rowIndex, columnIndex,
                                     {x1: x1,
                                      y1: y1,
                                      x2: x2,
                                      y2: y2, hue: parseInt(Math.random() * 359)});
      row.push(tempSquare);
    }
    tempGrid.push(row);
  }
  return tempGrid;
};

cx.Board.prototype.drawGrid = function() {
  var $canvas = $('#game-canvas');
  $canvas.attr('width', this.width);
  $canvas.attr('height', this.height);
  var context = $canvas.get(0).getContext('2d');
  for (var rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
    for (var columnIndex = 0; columnIndex < this.columnCount; columnIndex++) {
      var currentSquare = this.grid[rowIndex][columnIndex];
      context.beginPath();
      context.rect(currentSquare.x1, currentSquare.y1, currentSquare.x2, currentSquare.y2);
      context.fillStyle = 'hsl(' + currentSquare.getAttribute('hue') + ', 100%, 80%)';
      context.fill();
    }
  }
};

cx.Board.prototype.getAdjacent = function(rowIndex, columnIndex) {
  adjacentSquares = [];
  if (rowIndex > 0 && columnIndex > 0) {
    adjacentSquares.push(this.grid[rowIndex - 1][columnIndex - 1]);
  }

  if (rowIndex > 0) {
    adjacentSquares.push(this.grid[rowIndex - 1][columnIndex]);
  }

  if (columnIndex > 0) {
    adjacentSquares.push(this.grid[rowIndex][columnIndex - 1]);
  }

  if (rowIndex < this.rowCount - 1 && columnIndex < this.columnCount - 1) {
    adjacentSquares.push(this.grid[rowIndex + 1][columnIndex + 1]);
  }

  if (rowIndex < this.rowCount - 1) {
    adjacentSquares.push(this.grid[rowIndex + 1][columnIndex]);
  }

  if (columnIndex < this.columnCount - 1) {
    adjacentSquares.push(this.grid[rowIndex][columnIndex + 1]);
  }

  if (rowIndex < this.rowCount - 1 && columnIndex > 0) {
    adjacentSquares.push(this.grid[rowIndex + 1][columnIndex - 1]);
  }

  if (columnIndex < this.columnCount - 1 & rowIndex > 0) {
    adjacentSquares.push(this.grid[rowIndex - 1][columnIndex + 1]);
  }

  return new cx.SquareCollection(adjacentSquares);
};