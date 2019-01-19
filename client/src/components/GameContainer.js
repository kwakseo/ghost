import React from "react";
import GameBoard from "./game/GameBoard";
import HomePage from "./HomePage";
import SelectRoom from "./SelectRoom";
import WaitingAdmin from "./WaitingAdmin";
import Waiting from "./Waiting";
import InvalidCode from "./InvalidCode";
import io from "socket.io-client";
import EndGame from "./EndGame";
import Room from "./Room";

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io("http://localhost:3000");
    this.state = {
      gameStatus: 0,
      roomNo: -1,
      admin: false,
      // numPlayers: 0
    };

    this.socket.on("roomCreated", (roomNo) => {
      console.log("created");
      this.setState({roomNo: roomNo});
    });

    // this.socket.on("numPlayers", (numPlayers) => {
    //   console.log("numPlayers"+numPlayers);
    //   this.setState({numPlayers: numPlayers});
    // });

    this.changeGameState = (newStatus) => {
      this.setState({gameStatus: newStatus});
    };
  }

  GoToRoomAdmin = () => {
    this.setState({admin: true});
    this.changeGameState(1);
    console.log("go to room admin")
  };

  GoToRoom = () => {
    this.setState({admin: false});
    this.changeGameState(1);
  };

  render() {
    console.log(this.state.gameStatus)
    switch (this.state.gameStatus) {
      case 0:
        return (
          <SelectRoom socket={this.socket} onClickSelectAdminRoom={() => {this.GoToRoomAdmin()}} onClickSelectRoom={() => {this.GoToRoom()}} />
        );
      case 1:
        return (
          <Room roomNo={this.state.roomNo} socket={this.socket} adminStatus={this.state.admin} />
        );
    }
  }


}