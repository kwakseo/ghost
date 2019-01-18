import React from "react";
import "../../css/game.css";
import io from "socket.io-client";
import Letters from "./Letters";
import Player from "./Player";
import Timer from "./Timer";

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    // this.socket = io("http://localhost:3000");
    // this.socket.on("new_game", (msg) => {
    document.addEventListener("keydown", this.keyDownBound);
    // });

    this.props.socket.on("letter-added", (letter) => {
        console.log(letter);
        this.setState({letters: this.state.letters + letter});
        if (this.state.background_pos - 5 >= 0) {
          this.setState({background_pos: this.state.background_pos - 5});
        }
        var container = document.getElementsByClassName("game-container");
        container[0].setAttribute("style", "background-position:" + "0% " + this.state.background_pos + "%");
      });

    this.state = {
      num_players: 4,
      active_player: 1,
      background_pos: 100,
      letters: "",
      isGameOver: false,
    };
  }

  keyDownBound = (e) => { 

    /* these should be moved to server eventually. 
        temporarily here for testing purposes. */

      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.setState({letters: this.state.letters + e.key});
        if (this.state.background_pos - 5 >= 0) {
          this.setState({background_pos: this.state.background_pos - 5});
        }
        this.props.socket.emit("letter-added", e.key);

        var container = document.getElementsByClassName("game-container");
        container[0].setAttribute("style", "background-position:" + "0% " + this.state.background_pos + "%");
      console.log(this.state.letters);
      console.log(this.state.background_pos);

      let datamuseURL = 'https://api.datamuse.com/words?max=50&sp=' + this.state.letters + '*';
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
          this.props.onEndGame();
        }
        // document.getElementById("newText").innerText = result;
        })
      .catch(error => {console.log(error)})

      // if (this.state.letters === "hello"){
      //   this.props.onEndGame();
      // }

      }
  }

  render() {

    return (

      <div className="game-container">
        <Timer/>
        <Letters
            letters = {this.state.letters}
        />
        <div className="players-box component-container">
          <Player
              player_number = {1}
              player_active = {true}
          />
          <Player
              player_number = {2}
              player_active = {true}
          />
          <Player
              player_number = {3}
              player_active = {true}
          />
          <Player
              player_number = {4}
              player_active = {true}
          />

        </div>
      </div>
    );
  }
}
