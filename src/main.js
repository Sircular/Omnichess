/* Initial script */

console.log(Vector.Create("(2p, 1{3})j; (1, 0);"));

var queen = new Piece();
queen.setMoveVectors(Vector.Create("(1, 0)+;(0, 1)+;(1, 1)+"))
	.setMoveCaptureVectors(Vector.Create("(1, 0)+;(0, 1)+;(1, 1)+"))
	.setPlayer("Alice");
// TODO: Figure out and fix why vectors are not coming out correct
console.log(queen);