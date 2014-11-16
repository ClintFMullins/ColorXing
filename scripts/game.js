var cx = cx || {};
 
cx.Game = function() {
  this.board = new cx.Board();
};

cx.Game.prototype.initialize = function() {
  this.board.drawGrid();
};

$(function() {
  var game = new cx.Game();
  game.initialize();
  setInterval(function() {
    game.board.oneCycle();
  },0)
});