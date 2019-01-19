import React from "react";
import GameBoard from "./game/GameBoard";
import HomePage from "./HomePage";
import SelectRoom from "./SelectRoom";
import WaitingAdmin from "./WaitingAdmin";
import Waiting from "./Waiting";
import InvalidCode from "./InvalidCode";
import io from "socket.io-client";

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:3000");
    this.state = {
      gameStatus: 0,
      roomNo: -1,
      numPlayers: 0
    };

    this.socket.on("roomCreated", (roomNo) => {
      console.log("created");
      this.setState({roomNo: roomNo});
    });

    this.socket.on("numPlayers", (numPlayers) => {
      console.log("numPlayers"+numPlayers);
      this.setState({numPlayers: numPlayers});
    });

    this.socket.on('gameStarted', (msg) => {
      this.setState({gameStatus:3});
    });

    this.changeGameState = (newStatus) => {
      this.setState({gameStatus: newStatus});
    };
  }

  render() {
    console.log(this.state.gameStatus)
    switch (this.state.gameStatus) {
      case 0:
        return (
          <div>
            <HomePage onClickStart={() => {this.changeGameState(1);}} />
          </div>
        );
      case 1:
        return (
          <SelectRoom socket={this.socket} roomNo={this.state.roomNo} onClickSelectAdminRoom={() => {this.changeGameState(2);}} onClickSelectRoom={() => {this.changeGameState(4);}} onClickGoHome={() => {this.changeGameState(0);}}/>
        );

      case 2:
        return (
          <WaitingAdmin socket={this.socket} roomNo={this.state.roomNo} onClickGoToGame={() => {this.changeGameState(3);}} />
        );
      case 3:
        return (
          <GameBoard numPlayers={this.state.numPlayers} socket={this.socket}/>
        )
      case 4:
        return (
          <Waiting roomNo={this.state.roomNo} socket={this.socket} />
        )
      case 5:
        return (
          <InvalidCode onClickGoBack={() => {this.changeGameState(1);}}/>
        )
    }
  }


}