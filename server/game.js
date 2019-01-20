require('isomorphic-fetch');

const initNewGame = () => ({
  roomNo: 0,
  players: {}, //alive or dead, assign all players no. 0-3, how many letters of GHOST they have
  indexMap: {}, //maps index 0-3 to socket id
  activePlayer: null,
  activePlayerIndex: 0,
  playerOrder: [],
  letters: '',
  timer: 0,
  gameOver: false,
  joinable: true,
  numPlayers: 1,
  roundEnd: false,
});

let shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const gameUpdate = (game, letters) => {
  game.roundEnd = false;
	let loser = game.indexMap[game.activePlayerIndex];
  let numPlayers = game.numPlayers;

	game.timer = 10;

  return checkWord(letters, game).then((valid) => {
      if (valid) {
        game.roundEnd = true;
        game.letters = "";
        //if player becomes ghost
        console.log("round has ended")
        if (game.players[loser].ghost === 3) {
            game.players[loser].alive = false;
            game.numPlayers -= 1;
            for (let i = 0; i < numPlayers; i++) {
                game.playerOrder = [];
                if (i != game.activePlayer) {
                    game.playerOrder.push(i)
              }
            }
        }
      
      //if player gets strike
      else {
        console.log("strike" + game.numPlayers);
        game.players[loser].ghost += 1;
      }

      //end game if one player left
      if (game.numPlayers <= 1) {
        console.log("one player");
        game.gameOver = true;
      }

      shuffleArray(game.playerOrder);
      game.activePlayerIndex = 0;
      game.activePlayer = game.playerOrder[0];

    }
  
	

	//game ongoing, change active player
  	else {
        game.letters = letters;
    		if (game.activePlayerIndex < game.numPlayers - 1) {
    			 game.activePlayerIndex += 1;

    		}
    		else {
    			 game.activePlayerIndex = 0;
    		}
    		game.activePlayer = game.playerOrder[game.activePlayerIndex];
  	}

    })
}

let gameAddUser = (game, userInfo, socketid) => {
  console.log("this is a function!");
  game.players[socketid.toString()] = userInfo;
};

const checkWord = (new_word, game) => {
  let datamuseURL = 'https://api.datamuse.com/words?max=50&sp=' + new_word + '*';
  let noSpaceWords = [];
  let result = null;

  return fetch(datamuseURL)
  .then(data => data.json())  
  .then(res => {
    for(const item of res){
      let word = item.word
      if(word.indexOf(" ") === -1){ 
        noSpaceWords.push(word);
      }
    }
    result = JSON.stringify(noSpaceWords);
    console.log(result);
    console.log('result length')
    console.log(noSpaceWords.length);

    if (noSpaceWords.length === 0 || noSpaceWords.length === 1){
      console.log('valid word');
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