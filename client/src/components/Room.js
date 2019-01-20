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

/*    this.state = {
      playerOrder:null
    };*/

/*    this.props.socket.on('gameStartedGo', (indexMap, playerOrder) => {
      this.setState({gameStatus: 1,
                    playerOrder: playerOrder});
    });*/

/*    this.props.socket.on("roomCreated", (roomNo, userInfo) => {
      console.log("created, in roomjs");
      this.setState({users: [userInfo]});

<<<<<<< HEAD
    });*/
  }

 
=======
    this.props.socket.on('gameStarted', (msg) => {
      this.setState({gameStatus: 1});
    });

    this.props.socket.on('game-over', (game) => {
      this.setState({gameStatus: 2})
    });
  };
>>>>>>> ab6ebcdb292565a00993bd406c061924d7fede2e

  render() {
    console.log("in room.js");
    console.log(this.props.activePlayerIndex);
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
            activePlayerIndex = {this.props.activePlayerIndex}
            timer = {this.props.timer}
            background_pos = {this.props.background_pos}
            gameStatus={this.props.gameStatus} 
            letters = {this.props.letters} 

            />
          );
      case 2: 
        return (
          <EndGame />
        );
      case 2: 
        return (
          <EndGame />
        );
    }
  }
} 
  
