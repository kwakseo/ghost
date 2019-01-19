const initNewGame = () => ({
  roomNo: 0,
  players: {}, //alive or dead, assign all players no. 1-4, how many letters of GHOST they have
  activePlayer: 0,
  playerOrder: [],
  letters: '',
  timer: 0,
  gameOver: false
});

const gameUpdate = () => {
	//
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
      // this.props.onEndGame();
    }
    // document.getElementById("newText").innerText = result;
    })
  .catch(error => {console.log(error)})
}

module.exports = { initNewGame, gameUpdate };