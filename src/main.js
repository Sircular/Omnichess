/* Initial script */

// console.log(Vector.Create("(2p, 1{3})j; (1, 0)d;"));
// console.log(Vector.Create("(1, 1{3}+)"));

// var queen = new Piece();
// queen.setMoveVectors(Vector.Create("(1, 0)+;(0, 1)+;(1, 1)+"))
	// .setMoveCaptureVectors(Vector.Create("(1, 0)+;(0, 1)+;(1, 1)+"))
	// .setPlayer("Alice");
// console.log(queen);

// var queenObj = {};
// queenObj.move = "(1, 0)+;(0, 1)+;(1, 1)+";
// queenObj.capture = "";
// queenObj.moveCapture = "(1, 0)+;(0, 1)+;(1, 1)+";
// queenObj.player = "Bob";
// console.log(Piece.Create(queenObj));

var board = Board.Create({dimensions:"3x3"});
console.log(board);