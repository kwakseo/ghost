import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";
import Lobby from "./Lobby";
import GameBoard from "./game/GameBoard";
import EndGame from "./EndGame";

export default class Room extends React.Component {

  constructor(props) {
  	super(props);

  }

  render() {
    switch (this.props.gameStatus) {
      case 0:
        return (
          <Lobby 
            roomNo={this.props.roomNo} 
            socket={this.props.socket} 
            adminStatus={this.props.adminStatus} 
            gameStatus={this.props.gameStatus} 
            userInfo={this.props.userInfo} 
            players={this.props.players} 
            indexMap={this.props.indexMap}
            numPlayers = {this.props.numPlayers}
            background_pos = {this.props.background_pos} />
        );
      case 1:
        return (
          <GameBoard 
            socket={this.props.socket} 
            userInfo={this.props.userInfo} 
            players={this.props.players} 
            indexMap={this.props.indexMap} 
            playerOrder = {this.props.playerOrder}
            numPlayers = {this.props.numPlayers}
            activePlayer = {this.props.activePlayer}
            timer = {this.props.timer}
            background_pos = {this.props.background_pos}
            gameStatus={this.props.gameStatus} 
            letters = {this.props.letters} 

            />
          );
      case 2: 
        return (
          <EndGame 
            background_pos = {this.props.background_pos}
          />
        );
    }
  }
} 
  
