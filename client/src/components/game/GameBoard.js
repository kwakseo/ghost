import React from "react";
import "../../css/app.css";
import io from "socket.io-client";
import Letters from "./Letters";
import Player from "./Player";
import Timer from "./Timer";

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.props.socket.on("letter-added", (letter) => {
        console.log("letter added heard game board");
        this.setState({letters: this.state.letters + letter});
        if (this.state.background_pos - 5 >= 0) {
          this.setState({background_pos: this.state.background_pos - 5});
        }
        var container = document.getElementsByClassName("game-container");
        container[0].setAttribute("style", "background-position:" + "0% " + this.props.background_pos + "%");
      });

  }


  render() {
    var players = [];
    console.log("in board");
    for (var playerIndex of this.props.playerOrder) {
      players.push(<Player 
              key={playerIndex}
              playerIndex = {playerIndex}
              players={this.props.players}
              indexMap={this.props.indexMap}
              playerActive = {true}
            />
            )
    };
    return (

      <div className="game-container">
        <Timer activePlayerIndex={this.props.activePlayerIndex}/>
        <Letters
            letters = {this.props.letters}
            activePlayerIndex={this.props.activePlayerIndex}
        />
        <div className="players-box component-container">
          {players}

        </div>
      </div>
    );
  
  }
}
