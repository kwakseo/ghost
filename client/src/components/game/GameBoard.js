import React from "react";
import "../../css/app.css";
import io from "socket.io-client";
import Letters from "./Letters";
import Player from "./Player";
import Timer from "./Timer";
import DeadPlayer from "./DeadPlayer";

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
   
  };


  render() {

    console.log("render board");
    console.log(this.props.playerOrder);
    console.log(this.props.activePlayer);
    var players = [];
    let deadPlayers = [];
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
    if (this.props.deathOrder != null) {
      console.log('in death order');
      console.log(this.props.deathOrder);
      for (var playerIndex of this.props.deathOrder) {
        deadPlayers.push(<DeadPlayer 
          key={playerIndex}
          playerIndex = {playerIndex.index}
          players = {this.props.players}
          indexMap = {this.props.indexMap}
          socket={this.props.socket} 
          />
          )
      }
    }
    return (
      <div>
      <div className="full-screen">
      <div className="overlap-game-container"> {deadPlayers} </div>
      </div>
      <div className="game-container">

    {/*    <Timer activePlayer={this.props.activePlayer}/>*/}
        <Letters
            roundEnd={this.props.roundEnd}
            letters = {this.props.letters}
            activePlayer={this.props.activePlayer}
        />
        <div className="players-box component-container">
          {players}

        </div>
      </div>
      </div>
    );
  
  }
}
