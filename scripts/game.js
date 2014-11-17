var cx = cx || {};
 
cx.Game = function() {
  this.board = new cx.Board();
};

cx.Game.prototype.loop = function() {
  this.board.oneCycle();
  setTimeout(this.loop.bind(this), 100);
};

$(function() {
  var game = new cx.Game();
  game.loop();
});