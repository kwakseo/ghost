import React from "react";
import "../../css/app.css";
import io from "socket.io-client";
import Letters from "./Letters";
import Player from "./Player";
import Timer from "./Timer";

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
   
  };


  render() {
    var players = [];
    console.log("in board");
    for (var playerIndex of this.props.playerOrder) {
      players.push(<Player 
              key={playerIndex}
              playerIndex = {playerIndex}
              players={this.props.players}
              indexMap={this.props.indexMap}
              activePlayerIndex = {this.props.activePlayerIndex}
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
