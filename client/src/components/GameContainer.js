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
      roomNo: -1
    };

    this.socket.on("roomCreated", (roomNo) => {
      console.log("created");
      this.setState({roomNo: roomNo});
    });

    this.socket.on("roomChosen", (roomNo) => {
        console.log("room chosen heard");
        this.setState({roomNo: roomNo});
        if (roomNo === -1) {
          this.setState({gameStatus:5});
        }
        else {
          this.setState({gameStatus:4});
        }
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
          <GameBoard socket={this.socket}/>
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