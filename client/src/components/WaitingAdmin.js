import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import Link from "react-router-dom/es/Link";
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";

export default class WaitingAdmin extends React.Component {

  constructor(props) {
  	super(props);
  };

  startGame = (event) => {
  	this.props.socket.emit('gameStarted', 'started');

  	// this.props.onClickGoToGame()

  	event.preventDefault();
  };

  render() {
    return (
      <div className={"center"}>
      	<div className="black-text">{this.props.roomNo}</div>
        <div className="button" onClick={this.startGame}>Start Game</div>
      </div>
    );
  }
}

