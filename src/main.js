let game = undefined;
let realizer = undefined;

async function startGame()
{
	game = await Parser.Parse("./src/config/test01.js");
	
	realizer = new Realizer(game);
	
	game.SetRealizer(realizer);
	
	setInterval(() => {realizer.Realize();}, 500);
	
	// game.PlayGame();
}

startGame();
