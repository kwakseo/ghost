import React from "react";
import "../../css/game.css"
import io from "socket.io-client";
import { GRID_LENGTH } from "../../../../config";
import GameOver from "./GameOver";
import Letters from "./Letters";
import Player from "./Player"

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:3000");
    this.socket.on("new_game", (msg) => {
/*      this*/
/*      this.updateBoard(msg);*/
      document.addEventListener("keydown", this.keyDownBound);
    });

/*    this.socket.on("update_game", (msg) => {
      this.updateBoard(msg);
    });*/

    this.socket.on("letter-added", (letter) => {
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
        this.socket.emit("letter-added", e.key);

        var container = document.getElementsByClassName("game-container");
        container[0].setAttribute("style", "background-position:" + "0% " + this.state.background_pos + "%");
      console.log(this.state.letters);
      console.log(this.state.background_pos);

      // this.socket.on("letter-added", (letter) => {
      //   this.setState({letters: this.state.letters + letter});
      // });

/*    this.socket.emit("add-letter", e);*/
      }
  }


 /* keyDownBound = (e) => {
    switch (e.key) {
      case "w":
        this.socket.emit("move", 0);
        break;
      case "a":
        this.socket.emit("move", 1);
        break;
      case "s":
        this.socket.emit("move", 2);
        break;
      case "d":
        this.socket.emit("move", 3);
        break;
    }
  };*/

/*  emptyBoard = () => {
    const rows = [];
    for (let rowNum = 0; rowNum < GRID_LENGTH; rowNum += 1) {
      rows.push([]); // push an empty row
      for (let colNum = 0; colNum < GRID_LENGTH; colNum += 1) {
        rows[rowNum].push(0);
      }
    }

    return rows;
  };*/

/*  updateBoard = (data) => {
    const newBoard = this.emptyBoard();
    newBoard[data.food.y][data.food.x] = 3;
    for (const i in data.player.snakeCoords) {
      newBoard[data.player.snakeCoords[i].y][data.player.snakeCoords[i].x] = 1;
    }
    this.setState({boardContent: newBoard});
    if (data.game_over) {
      this.setState({isGameOver: true});
    }
  };*/

  render() {

    return (

      <div className="game-container">
        <div className="timer-box component-container">
          <div className="timer"/>
        </div>
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
              player_active = {false}
          />
          <Player
              player_number = {3}
              player_active = {false}
          />
          <Player
              player_number = {4}
              player_active = {false}
          />

        </div>
      </div>
    );
  }
}
