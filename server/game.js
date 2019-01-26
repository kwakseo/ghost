require('isomorphic-fetch');

const initNewGame = () => ({
  roomNo: 0,
  players: {}, //alive or dead, assign all players no. 0-3, how many letters of GHOST they have
  indexMap: {}, //maps index 0-3 to socket id
  gameStatus: 0, // 0 is not started, 1 is in session, 2 is ended
  activePlayer: null,
  lastActivePlayer: null,
  activePlayerIndex: 0,
  playerOrder: [],
  letters: '',
  timer: 0,
  gameOver: false,
  joinable: true,
  numPlayers: 1,
  totalPlayers: 1,
  roundEnd: false,
  playerDeath: false,
  deadPlayers: new Set(),
  clientToSocketIdMap: [],
  deathOrder: [],
  lastWords: [],
  leaderBoard: null
});

let shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const gameUpdate = (game, letters) => {
  game.lastActivePlayer = game.activePlayer;
  console.log('changed it here')
  console.log(game.lastActivePlayer)
  console.log()
  game.roundEnd = false;
	let loser = game.indexMap[game.activePlayer];
	game.timer = 10;
  return checkWord(letters, game).then((valid) => {
      if (valid) {
        console.log("empty letter invalid")
        game.lastWords.push(letters);
        game.roundEnd = true;
        game.letters = '';
        //if player becomes ghost
        console.log("round has ended")
        if (game.players[loser].ghost >= 2) {
          game.deadPlayers.add(game.activePlayer);
        	// let tempNumPlayers = game.numPlayers;
            game.players[loser].alive = false;
            removePlayers(game, loser)
            // console.log(game.playerOrder);
        }
      
      //if player gets strike
      else {
        console.log("strike" + game.numPlayers);
        game.players[loser].ghost += 1;

        console.log('')
      }

      //end game if one player left
      if (game.numPlayers <= 1) {
        console.log("one player");
        game.activePlayer = game.playerOrder[0];
        console.log("active player");
        console.log(game.activePlayer);
        let winner = game.indexMap[game.activePlayer];
        game.deathOrder.push(game.players[winner])
        game.gameOver = true;
      }
      else {
        shuffleArray(game.playerOrder);
        game.activePlayer = game.playerOrder[0];
        game.activePlayerIndex = 0;
      }

    }
  
	

	//game ongoing, change active player
  	else {
      console.log('change active player');
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

const removePlayers = (game, loser) => {
    game.numPlayers -= 1;
    game.playerDeath = true;
    let oldPlayerOrder = game.playerOrder;
    game.playerOrder = [];
    console.log('debugging deathOrder')
    console.log(loser)
    console.log(game.indexMap)
    console.log(game.players) 
    game.deathOrder.push(game.players[loser]); 
    console.log('number of players now') 
    // game.totalPlayers -= 1
    console.log(game.totalPlayers)

    // delete game.players[game.indexMap[loser]] 
    // delete game.indexMap[loser]
    // console.log(loser)
    // console.log(game.players)
    // console.log(game.indexMap)


    for (let i = 0; i < game.totalPlayers; i++) {
        console.log("should be only deleting one player")
        console.log(game.activePlayer);
        if (i != game.activePlayer && !game.deadPlayers.has(i)) {
            game.playerOrder.push(i)
      }
      console.log("new player order");
      console.log(game.playerOrder);
    }
}


const checkWord = (new_word, game) => {
  let datamuseURL = 'https://api.datamuse.com/words?max=50&sp=' + new_word + '*';
  let noSpaceWords = [];
  let result = null;

  return fetch(datamuseURL)
  .then(data => data.json())  
  .then(res => {

    if (new_word === ""){
        return true;
    } else{
        for(const item of res){
          let word = item.word
          if(word.indexOf(" ") === -1){ 
            noSpaceWords.push(word);
            }
          }
        
        result = JSON.stringify(noSpaceWords);
        console.log(result);

        result = JSON.stringify(noSpaceWords)
        console.log(result)
        console.log('result length')
        console.log(noSpaceWords.length);

        console.log()

        if (noSpaceWords.length === 1){
          if (noSpaceWords[0] === game.letters) {
             return true;
          }
        }
        else {
          if (noSpaceWords.length === 0){
        	  return true;
          }
          return false;
        }
      }
    })
    .catch(error => {console.log(error)})
}

module.exports = { initNewGame, gameUpdate, shuffleArray, removePlayers };