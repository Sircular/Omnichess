let board = new Board(Board.Generate([8, 8]));
let realizer = new Realizer(board);
let currentPieceIndex = 0;
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

	// TODO: Identify what action taken and process it
	if (document.getElementById("boardToggle").checked)
	{
		/* Toggle the cell's existence */
		console.log("Toggling the cell!");
		board.ToggleCell(cellIndex);
		realizer.Realize();
		return;
	}
	else if (document.getElementById("selectCell").checked)
	{
		/* Select the cell */
		console.log("Selecting the cell!");
		realizer.SetActiveCell(cellIndex);
		realizer.Realize();
		return;
	}
	else if (document.getElementById("removePiece").checked)
	{
		/* Remove the piece */
		console.log("Removing the piece!");
		board.contents[cellIndex] = undefined;
		realizer.SetActiveCell(undefined);
		realizer.Realize();
		return;
	}
	/* Only remaining option is adding a piece */
	console.log("Adding the piece!");
	let pieceToAdd = new Piece();
	pieceToAdd.setMoveVectors(Vector.Create(document.getElementById("move-" + currentPieceIndex).value));
	pieceToAdd.setCaptureVectors(Vector.Create(document.getElementById("capture-" + currentPieceIndex).value));
	pieceToAdd.setMoveCaptureVectors(Vector.Create(document.getElementById("moveCapture-" + currentPieceIndex).value));
	pieceToAdd.setIdentifier(document.getElementById("ident-" + currentPieceIndex).value);
	board.contents[cellIndex] = pieceToAdd;
	realizer.Realize();
}