require('isomorphic-fetch');

const initNewGame = () => ({
  roomNo: 0,
  players: {}, //alive or dead, assign all players no. 1-4, how many letters of GHOST they have
  indexMap: {},
  activePlayer: 0,
  activePlayerIndex: 0,
  playerOrder: [],
  letters: '',
  timer: 0,
  gameOver: false
});

let shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const gameUpdate = (game, letters) => {
	console.log(game);
	let loser = game.indexMap[game.activePlayer];
	let numPlayers = game.playerOrder.length;

	game.timer = 10;

	if (checkWord(letters)) {
		//if player becomes ghost
		if (game.players[loser].ghost === 5) {
			game.players[loser].alive = false;
			for (let i = 0; i < numPlayers; i++) {
				game.playerOrder = [];
				if (i != game.activePlayer) {
					game.playerOrder.push(i)
				}
			}
		}
		//if player gets strike
		else {
			game.players[loser].ghost += 1;
		}
		shuffleArray(game.playerOrder);
		game.activePlayerIndex = 0;
		game.activePlayer = game.playerOrder[0];

	}
	//game ongoing, change active player
	else {
		if (game.activePlayerIndex < game.playerOrder.length - 1) {
			game.activePlayerIndex += 1;
		}
		else {
			game.activePlayerIndex = 0;
		}
		game.activePlayer = game.playerOrder[game.activePlayerIndex];
	}

};

const checkWord = (new_word) => {
  let datamuseURL = 'https://api.datamuse.com/words?max=50&sp=' + new_word + '*';
  let noSpaceWords = [];

  fetch(datamuseURL)
  .then(data => data.json())  
  .then(res => {
    for(const item of res){
      let word = item.word
      if(word.indexOf(" ") === -1){ 
        noSpaceWords.push(word)
      }
    }
    let result = JSON.stringify(noSpaceWords)
    console.log(result)
    console.log('result length')
    console.log(noSpaceWords.length)

    if (noSpaceWords.length === 0 || noSpaceWords.length === 1){
    	return true;
      // this.props.onEndGame();
    }
    else {
    	return false;
    }
    // document.getElementById("newText").innerText = result;
    })
  .catch(error => {console.log(error)})
}

module.exports = { initNewGame, gameUpdate, shuffleArray };