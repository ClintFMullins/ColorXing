module("cx.Square", {
  setup: function() {
    this.square = new cx.Square(0,0);
  }
});

test("cx.Square", function() {
  var square = new cx.Square(0,0);
  equal(square.getAttribute('hue'), 0);
  equal(square.getAttribute('saturation'), 100);
  equal(square.getAttribute('luminosity'), 100);
  equal(square.x1, 0);
  equal(square.y1, 1);
  equal(square.x2, 10);
  equal(square.y2, 11);
});

test("cs.Square: opts override defaults", function() {
  var opts = {
    hue:        60,
    saturation: 40,
    luminosity: 20,
    x1: 10,
    y1: 11,
    x2: 110,
    y2: 111
  };
  var square = new cx.Square(0,0,opts);
  equal(square.getAttribute('hue'), 60);
  equal(square.getAttribute('saturation'), 40);
  equal(square.getAttribute('luminosity'), 20);
  equal(square.x1, 10);
  equal(square.y1, 11);
  equal(square.x2, 110);
  equal(square.y2, 111);
});

test("cx.Square.prototype.setCoordinates", function() {
  this.square.setCoordinates(10, 11, 110, 111)
  equal(this.square.x1, 10);
  equal(this.square.y1, 11);
  equal(this.square.x2, 110);
  equal(this.square.y2, 111);
});

test("cx.Square.prototype.attributeExist", function() {
  equal(this.square.attributeExist("hue"), true);
  equal(this.square.attributeExist("saturation"), true);
  equal(this.square.attributeExist("karma"), false);
});

test("cx.Square.prototype.getAttribute", function(){
  equal(this.square.getAttribute("hue"), 0);
  equal(this.square.getAttribute("saturation"), 100);
  try {
    equal(this.square.getAttribute("karma"), true);
  } catch(message) {
    equal(message, "Attribute [karma] does not exist");
  }
});

test("cx.Square.prototype.queueAttribute", function() {
  deepEqual(this.square.hue, [0]);
  this.square.queueAttribute("hue", 100);
  deepEqual(this.square.hue, [0, 100]);
  this.square.queueAttribute("hue", 200);
  deepEqual(this.square.hue, [0, 100, 200]);
});

test("cx.Square.prototype.nextAttribute", function() {
  this.square.hue = [0, 100, 200];
  equal(this.square.nextAttribute("hue"), 0);
  deepEqual(this.square.hue, [100, 200]);
  equal(this.square.nextAttribute("hue"), 100);
  deepEqual(this.square.hue, [200]);
});

module("cx.SquareCollection", {
  setup: function() {
    this.squareWithHue0 = new cx.Square(0,0, {hue: 0});
    this.squareWithHue10 = new cx.Square(0,0, {hue: 10});
    this.squareWithHue50 = new cx.Square(0,0, {hue: 50});
    this.squareWithHue270 = new cx.Square(0,0, {hue: 270});
    this.squareWithHue359 = new cx.Square(0,0, {hue: 359});
    var squares = [this.squareWithHue0, this.squareWithHue10,
                   this.squareWithHue50, this.squareWithHue270,
                   this.squareWithHue359];
    this.squareCollection = squareCollection = new cx.SquareCollection(squares);
  }
});

test("cx.SquareCollection", function() {
  var squareCollection = new cx.SquareCollection([this.squareWithHue0, this.squareWithHue10]);
  equal(squareCollection.squares.length, 2);
  equal(squareCollection.size(), 2);
});

test("cx.SquareCollection.prototype.listAttribute", function() {
  deepEqual(this.squareCollection.listAttribute("hue"), [0,10,50,270,359]);
  try {
    this.squareCollection.listAttribute("notanattr")
  } catch(message) {
    equal(message, "Attribute [notanattr] does not exist");
  }
});

module("cx.Board", {
  setup: function() {
    this.board = new cx.Board();
  }
});

test("cx.Board", function() {
  var board = new cx.Board();
  equal(board.rowCount, 20);
  equal(board.columnCount, 20);
  equal(board.width, 500);
  equal(board.height, 500);
});

test("cx.Board: opts override defaults", function() {
  var opts = {
    rowCount:    50,
    columnCount: 80,
    width:       160,
    height:      160,
  };
  var board = new cx.Board(opts);
  equal(board.rowCount, 50);
  equal(board.columnCount, 80);
  equal(board.width, 160);
  equal(board.height, 160);
  equal(board.grid.length, 50);
  equal(board.squareWidth, 2);
  equal(board.squareHeight, 3.2);
});

test("cx.Board.prototype.createGrid", function() {
  ok(!!this.board.grid[0][0]);
  equal(this.board.grid[0][0].x1, 0);
  equal(this.board.grid[0][0].y1, 0);
  equal(this.board.grid[0][0].x2, 25);
  equal(this.board.grid[0][0].y2, 25);
  equal(this.board.grid[0][1].x1, 25);
  equal(this.board.grid[0][1].y1, 0);
  equal(this.board.grid[0][1].x2, 50);
  equal(this.board.grid[0][1].y2, 25);
});

test("cx.Board.prototype.getAdjacent", function() {
  var adjacent00 = this.board.getAdjacent(0, 0);
  var adjacent01 = this.board.getAdjacent(this.board.rowCount - 1, 0);
  var adjacent10 = this.board.getAdjacent(0, this.board.columnCount - 1);
  var adjacent11 = this.board.getAdjacent(this.board.rowCount - 1, this.board.columnCount - 1);
  var adjacent100 = this.board.getAdjacent(1, 1);
  var adjacent101 = this.board.getAdjacent(this.board.rowCount - 1, 1);
  var adjacent110 = this.board.getAdjacent(1, this.board.columnCount - 1);
  var adjacent201 = this.board.getAdjacent(0, 1);
  var adjacent210 = this.board.getAdjacent(1, 0);

  equal(adjacent00.size(), 3);
  equal(adjacent01.size(), 3);
  equal(adjacent10.size(), 3);
  equal(adjacent11.size(), 3);
  equal(adjacent100.size(), 8);
  equal(adjacent101.size(), 5);
  equal(adjacent110.size(), 5);
  equal(adjacent201.size(), 5);
  equal(adjacent210.size(), 5);
});

test("cx.Board.prototype.queueSquareHue", function() {
  var adjacentSquares = this.board.getAdjacent(0, 0);
  this.board.queueSquareHue(this.board.grid[0][0], adjacentSquares);
  var hueQueue = this.board.grid[0][0].hue;
  ok(Math.abs(hueQueue[0] - hueQueue[1]) <= 11);
});

module("cx.color");

test("cx.color.sortedHuesByValue", function (){
  var hues = [359, 10, 270, 0];
  var sortedHues = cx.color.sortedHuesByValue(hues);
  equal(sortedHues[0], 0);
  equal(sortedHues[1], 10);
  equal(sortedHues[2], 270);
  equal(sortedHues[3], 359);
});

test("cx.color.sortedHuesByDistance: unsorted", function() {
  var sortedHues = [0, 10, 270];
  var sortedByDistanceHues = cx.color.sortedHuesByDistance(sortedHues);
  equal(sortedByDistanceHues[0], 270);
  equal(sortedByDistanceHues[1], 0);
  equal(sortedByDistanceHues[2], 10);
});

test("cx.color.sortedHuesByDistance: sorted1", function() {
  var sortedHues = [0, 10, 50];
  var sortedByDistanceHues = cx.color.sortedHuesByDistance(sortedHues);
  equal(sortedByDistanceHues[0], 0);
  equal(sortedByDistanceHues[1], 10);
  equal(sortedByDistanceHues[2], 50);
});

test("cx.color.sortedHuesByDistance: sorted2", function() {
  var sortedHues = [0, 270, 359];
  var sortedByDistanceHues = cx.color.sortedHuesByDistance(sortedHues);
  equal(sortedByDistanceHues[0], 270);
  equal(sortedByDistanceHues[1], 359);
  equal(sortedByDistanceHues[2], 0);
});

test("cx.color.adjustedHues", function() {
  var valuesNoAdjust = [0, 10, 40, 50];
  var valuesAdjust = [70, 270, 5];

  deepEqual(cx.color.adjustedHues(valuesNoAdjust), valuesNoAdjust);
  deepEqual(cx.color.adjustedHues(valuesAdjust), [70, 270, 365]);
});

test("cx.color.getCircleAverage", function() {
  equal(cx.color.getCircleAverage([20, 30, 40]), 30);
  equal(cx.color.getCircleAverage([290, 10]), 330);
  equal(cx.color.getCircleAverage([20, 180, 30, 270]), 305);
  equal(cx.color.getCircleAverage([20, 180, 30, 270]), 305);
  equal(cx.color.getCircleAverage([0, 180, 90, 359]), 67);
  try {
    cx.color.getCircleAverage([]);
  } catch(message) {
    equal(message, "cx.color.getCircleAverage given empty array");
  }
});

test("cx.color.getInfluencedHue", function() {
  equal(cx.color.getInfluencedHue(10, 40), 20);
  equal(cx.color.getInfluencedHue(350, 10), 0);
  equal(cx.color.getInfluencedHue(350, 350), 350);
  equal(cx.color.getInfluencedHue(350, 355), 355);
  equal(cx.color.getInfluencedHue(350, 345), 345);
  equal(cx.color.getInfluencedHue(350, 210), 340);
});