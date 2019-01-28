import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import Link from "react-router-dom/es/Link";
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";
import Player from "./game/Player";

export default class WaitingAdmin extends React.Component {

  constructor(props) {
  	super(props);

  
    

  }

  startGame = (event) => {
  	this.props.socket.emit('gameStarted', this.props.roomNo);


  	event.preventDefault();
  };


  render() {
    var players = [];
    var startButton = <div className="waiting-text waiting-load">Waiting for at least 1 more player...</div>
    
    if (this.props.numPlayers > 1) {
      startButton = <div className="button" onClick={this.startGame}>All players ready</div>
    }

    for (var i of this.props.playerOrder) {
      console.log(this.props.players);
      players.push(<Player 
              key = {i}
              players = {this.props.players}
              playerIndex = {i}
              indexMap={this.props.indexMap}
            />);
      console.log('inloop');

    };


    return (
      <div className={"center"}>
      	<div className="waiting-text">Invite friends with your game code:</div>
        <div className="waiting-code">{this.props.roomNo}</div>
        {startButton}
        <div className={"players-box component-container"}>
          {players}
        </div>
      </div>
    );
  }
}

