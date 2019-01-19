import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";
import Lobby from "./Lobby";
import GameBoard from "./game/GameBoard";

export default class Room extends React.Component {

  constructor(props) {
  	super(props);

    this.state = {
      gameStatus: 0
    };

    this.changeGameState = (newStatus) => {
      this.setState({gameStatus: newStatus});
    };


    this.props.socket.on('gameStarted', (msg) => {
      this.setState({gameStatus: 1});
    });
  };

  render() {
    console.log("in room.js")
    switch (this.state.gameStatus) {
      case 0:
        return (
          <Lobby roomNo={this.props.roomNo} socket={this.props.socket} adminStatus={this.props.adminStatus} gameStatus={this.state.gameStatus} />
        );
      case 1:
        return (
          <GameBoard socket={this.props.socket} />
        );
    }
  }
}