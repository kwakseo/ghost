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
      players: {},
      num_players: 4,
      indexMap: {},
      activePlayer: 1,
      background_pos: 100,
      letters: "",
      timer: 10,
      isGameOver: false
    };

    this.props.socket.on("game-init", (game) => {
      console.log("gameboard socket on")
      this.setState({
        players: game.players,
        num_players: game.playerOrder.length,
        indexMap: game.indexMap,
        activePlayer: game.activePlayer,
        timer: game.timer,
        isGameOver: game.isGameOver
      });
    });

      this.props.socket.on("game-update", (game) => {
      console.log("gameboard socket on")
      this.setState({
        players: game.players,
        num_players: game.playerOrder.length,
        indexMap: game.indexMap,
        activePlayer: game.activePlayer,
        timer: game.timer,
        isGameOver: game.isGameOver
      });
    });
  };

  keyDownBound = (e) => { 

    /* these should be moved to server eventually. 
        temporarily here for testing purposes. */
      console.log("keydown check");
      console.log("activePlayer" + this.state.activePlayer);
      // console.log(this.state.indexMap);
      if (this.props.socket.id === this.state.indexMap[this.state.activePlayer]) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          this.setState({letters: this.state.letters + e.key});
          if (this.state.background_pos - 5 >= 0) {
            this.setState({background_pos: this.state.background_pos - 5});
          }
          this.props.socket.emit("letter-added", this.state.letters);

          var container = document.getElementsByClassName("game-container");
          container[0].setAttribute("style", "background-position:" + "0% " + this.state.background_pos + "%");
        console.log(this.state.letters);
        console.log(this.state.background_pos);

        // if (this.state.letters === "hello"){
        //   this.props.onEndGame();
        // }

        }
    };
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
