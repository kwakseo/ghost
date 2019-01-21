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
    console.log('in waitingadmin');
    console.log(this.props.players);
    console.log(this.props.numPlayers);
    for (var i=0; i<this.props.numPlayers; i++) {
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
      	<div className="black-text">{this.props.roomNo}</div>
        <div className="button" onClick={this.startGame}>Start Game</div>
        <div className={"players-box component-container"}>
          {players}
        </div>
      </div>
    );
  }
}

