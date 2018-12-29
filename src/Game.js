/* Manages the state of the game */
class Game 
{
	constructor(board, players, endConditions)
	{
		this.board = board;
		this.players = players;
		this.endConditions = endConditions;
		this.realizer = undefined; /* Has to be added later */
		
		/* Default turn order is alternating, any legal move goes */
		const legalActions = {};
		legalActions.piece = undefined; // flag for any
		legalActions.move = true;
		legalActions.capture = true;
		this.turnOrder = [
			new Turn(this.players[0], this.board, legalActions),
			new Turn(this.players[1], this.board, legalActions)
		];
		this.turnIndex = 0;
		
		// For checking win/loss conditions at the right time
		this.nextTurn = this.turnOrder[this.turnIndex];
		this.lastTurn = undefined;
		
		/**
		 *  Keeps track of who has won or lost.
		 *  Is positive for win, negative for loss,
		 *  magnitude equal to playerIndex + 1.
		 *  Will need updating in the future.
		 */
		this.gameState = 0;
	}
	
	SetRealizer(realizer)
	{
		this.realizer = realizer;
		this.players.forEach((player) => {player.realizer = realizer; });
	}

	
	Step()
	{
		// this.CheckGameEnd();
		if (this.gameState === 0)
		{
			this.DoTurn();
			this.CheckGameEnd();
		}
		if (this.gameState !== 0)
		{
			document.getElementById("message").innerHTML = "The game is now over!";
		}
	}
	
	DoTurn()
	{
		/* Get a legal move */
		let proposedMove = this.nextTurn.GetMove();
		while (!this.Validate(proposedMove))
		{
			console.log("Game invalidated the move.");
			document.getElementById("message").innerHTML = "Illegal move.";
			proposedMove = this.nextTurn.GetMove();
		}
		document.getElementById("message").innerHTML = "";
		
		/* Make the move */
		this.CommitMove(proposedMove);
		
		/* Get the next move */
		this.lastTurn = this.nextTurn;
		this.nextTurn = this.nextTurn.EndTurn();
		if (this.nextTurn === undefined)
		{
			this.turnIndex = (this.turnIndex + 1) % this.turnOrder.length;
			this.nextTurn = this.turnOrder[this.turnIndex];
		}
		
		/* Update the vizualization */
		realizer.Update();
	}
	
	CheckGameEnd()
	{
		// TODO: Update to allow multiple simultaneous win/loss conditions
		this.endConditions.forEach((endCondition) => {
			const evaluation = endCondition.EvaluateGame(this.board, this.lastTurn, this.nextTurn);
			if (evaluation !== 0)
			{
				this.gameState = evaluation * (this.players.indexOf(endCondition.player) + 1);
			}
		});
	}
	
	/**
	 *  Validates that a move is legal.
	 *
	 *  TODO: Add support for promote, drop
	 */
	Validate(move)
	{
		let validity = false;
		const actor = this.board.contents[move.source];
		
		let vectorList = [];
		let includeCaptureEligible = false;
		
		if (move.move && !move.capture)
		{
			vectorList = actor.moveVectors;
		}
		else if (move.capture && !move.move)
		{
			vectorList = actor.captureVectors;
			includeCaptureEligible = true;
		}
		else if (move.move && move.capture)
		{
			vectorList = actor.moveCaptureVectors;
			includeCaptureEligible = true;
		}

		vectorList.forEach((vector) => {
				validity = validity || this.board.GetCellIndices(vector, move.source, includeCaptureEligible).has(move.target);
			});
		
		return validity;
	}
	
	/**
	 *  Commits a move to the board.
	 *  Move should be an object with the following properties:
	 *    move.move => true if moving, false otherwise
	 *    move.capture => true if capturing, false otherwise
	 *    move.drop => true if dropping, false otherwise
	 *    move.promote => true if promoting, false otherwise
	 *    move.source => where this action originates from, a number
	 *    move.target => the target of this move, either a number (location) or string (piece type)
	 */
	CommitMove(move)
	{
		if (move.capture)
		{
			this.nextTurn.player.capturedPieces.push(this.board.contents[move.target]);
			this.board.contents[move.target] = undefined;
		}
		if (move.move)
		{
			this.board.contents[move.target] = this.board.contents[move.source];
			this.board.contents[move.source] = undefined;
			return;
		}
		// TODO: Add support for promote, drop
	}
}
