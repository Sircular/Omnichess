/** Stores and checks a condition that could end the game
 *  Notated as:
 *    count piece_ident = 0 @ start player_ident (also <, >, and end instead of start)
 *    check piece_ident @ end player_ident
 */
class EndCondition
{
	constructor(player, win, configurationString)
	{
		this.player = player;
		this.state = win ? 1 : -1;
	}
	
	EvaluateGame(board, lastTurn, nextTurn)
	{
		if (!this.configurationString.includes(`@ end ${lastTurn.player.identifier}`)
			&& !this.configurationString.includes(`@ start ${nextTurn.player.identifier}`))
		{
			/* This condition does not apply at this time */
			return 0;
		}
		
		// Evaluate
	}
}