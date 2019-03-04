let board = new Board(Board.Generate([8, 8]));
let realizer = new Realizer(board);
let currentPieceIndex = 0;
let currentPlayerIndex = 0;
realizer.Realize();

function clickHandler()
{
	if (realizer === undefined)
		return;
	
	realizer.SetActiveCell(undefined);
	realizer.Realize();
}

function updateBoard()
{
	let lengths = document.getElementById("lengths").value.split(",");
	board = new Board(Board.Generate(lengths));
	realizer.board = board;
	realizer.Realize();
}

function registerCurrentPiece(index)
{
	currentPieceIndex = 0;
}

function processClick(event, cellIndex)
{
	event.stopPropagation();

	/* Identify what action taken and process it */
	if (document.getElementById("boardToggle").checked)
	{
		/* Toggle the cell's existence */
		board.ToggleCell(cellIndex);
		realizer.Realize();
		return;
	}
	else if (document.getElementById("selectCell").checked)
	{
		/* Select the cell */
		realizer.SetActiveCell(cellIndex);
		realizer.Realize();
		return;
	}
	else if (document.getElementById("removePiece").checked)
	{
		/* Remove the piece */
		board.contents[cellIndex] = undefined;
		realizer.SetActiveCell(undefined);
		realizer.Realize();
		return;
	}
	/* Only remaining option is adding a piece */
	console.log("Adding the piece!");
	let pieceToAdd = constructPiece();
	board.contents[cellIndex] = pieceToAdd;
	realizer.Realize();
}

function constructPiece()
{
	let newPiece = new Piece();
	newPiece.setMoveVectors(Vector.Create(document.getElementById("move-" + currentPieceIndex).value));
	newPiece.setCaptureVectors(Vector.Create(document.getElementById("capture-" + currentPieceIndex).value));
	newPiece.setMoveCaptureVectors(Vector.Create(document.getElementById("moveCapture-" + currentPieceIndex).value));
	newPiece.setIdentifier(document.getElementById("ident-" + currentPieceIndex).value);
	newPiece.setPlayer(constructPlayer());
	
	return newPiece;
}

function constructPlayer()
{
	let identifier = document.getElementById("player-" + currentPlayerIndex).value;
	let direction = document.getElementById("direction-" + currentPlayerIndex).value.split(",");
	let color = document.getElementById("color-" + currentPlayerIndex).value;
	
	return new Player(identifier, direction, [], [], color);
}