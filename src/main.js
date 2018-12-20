/* Initial script */

const alice = new Player("alice", [1, 1], [], []);
const bob = new Player("bob", [-1, 1], [], []);
const board = new Board(Board.Generate2D(3, 3));

const rook_alice = new Piece()
	.setPlayer(alice)
	.setIdentifier("rook");
	.setMoveCaptureVectors(Vector.Create("(1, 0)*; (0, 1)*;"));

const bishop_bob = new Piece()
	.setPlayer(bob)
	.setIdentifier("bishop");
	.setMoveCaptureVectors(Vector.Create("(1, 1)*;"));

board.contents[7] = rook_alice;
board.contents[1] = bishop_bob;

const alice_lose = new EndCondition(alice, false, "count rook = 0 @ end bob");
const bob_lose = new EndCondition(alice, false, "count bishop = 0 @ end alice");

const game = new Game(board, [alice, bob], [alice_lose, bob_lose]);