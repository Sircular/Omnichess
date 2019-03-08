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
	currentPieceIndex = index;
}

function registerCurrentPlayer(index)
{
	currentPlayerIndex = index;
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
	newPiece.setDirection(newPiece.player.direction);
	
	return newPiece;
}

function constructPlayer()
{
	let identifier = document.getElementById("playerIdent-" + currentPlayerIndex).value;
	let direction = document.getElementById("direction-" + currentPlayerIndex).value.split(",");
	let color = document.getElementById("color-" + currentPlayerIndex).value;
	
	return new Player(identifier, direction, [], [], color);
}

function addNewPlayer()
{
	const playerPane = document.getElementById("playerPane");
	
	const newPlayerCell = document.createElement("div");
	newPlayerCell.className = "vdimension cell";
	const playerIndex = playerPane.childElementCount;
	newPlayerCell.innerHTML = "<span><label>Select Player</label><input id='player-" + playerIndex + "' type='radio' name='player' onchange='if(document.getElementById(\"player-" + playerIndex +"\").checked) registerCurrentPlayer(" + playerIndex + ");'/></span>" + 
	"<span>Identifier: <input id='playerIdent-" + playerIndex + "' type='text' value='" + playerIndex + "' /></span>" + 
	"<span>Direction: <input id='direction-" + playerIndex + "' type='text' value='1,1' /></span>" + 
	"<span>Color: <input id='color-" + playerIndex + "' type='color' value='#0088FF' /></span>";
	
	playerPane.appendChild(newPlayerCell);
}

function addNewPiece()
{
	const piecePane = document.getElementById("piecePane");
	
	const newPieceCell = document.createElement("div");
	newPieceCell.className = "vdimension cell";
	const pieceIndex = piecePane.childElementCount;
	newPieceCell.innerHTML = "<span><label for='placePiece" + pieceIndex + "'>Place Piece</label>" + 
		"<input id='placePiece" + pieceIndex + "' type='radio' name='action' onchange='if(document.getElementById(\"placePiece" + 
		pieceIndex + "\").checked) registerCurrentPiece(" + pieceIndex + ");'/></span><span>Piece Identifier: <input id='ident-" + 
		pieceIndex + "' type='text' value='p' /></span><span>Movement: <input id='move-" + pieceIndex + "' type='text' value='(0, 1d);' />" + 
		"</span><span>Capture: <input id='capture-" + pieceIndex + "' type='text' value='' /></span><span>Capture-Movement: " + 
		"<input id='moveCapture-" + pieceIndex + "' type='text' value='(1, 1d);' /></span>";

	piecePane.appendChild(newPieceCell);
}