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
    console.log("render board");
    console.log(this.props.playerOrder);
    console.log(this.props.activePlayer);
    var players = [];
    for (var playerIndex of this.props.playerOrder) {
      players.push(<Player 
              key={playerIndex}
              playerIndex = {playerIndex}
              players={this.props.players}
              indexMap={this.props.indexMap}
              activePlayer = {this.props.activePlayer}
            />
            )
    };
    return (

      <div className="game-container">
    {/*    <Timer activePlayer={this.props.activePlayer}/>*/}
        <Letters
            letters = {this.props.letters}
            activePlayer={this.props.activePlayer}
        />
        <div className="players-box component-container">
          {players}

        </div>
      </div>
    );
  
  }
}
