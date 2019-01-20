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
    console.log("socket room");
    console.log(this.socket.room);
    this.state = {
      gameStatus: 0, // 0 is not started, 1 is in session, 2 is ended
      roomSelect: false,
      roomNo: -1,
      admin: false,
      userInfo: null,

      players: null,
      numPlayers: 4,
      indexMap: null,
      playerOrder: null,

      activePlayerIndex: null,
      timer: null,
      background_pos: 100,
      letters: "",
    }

    document.addEventListener("keydown", this.keyDownBound);

    this.socket.on('gameInit', (game, userInfo, socketid) => {
      console.log("heard room init");
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  userInfo: userInfo,
                  admin: true,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap});

      console.log("in container created room, user: " + this.state.userInfo);
      this.GoToRoomAdmin();
    });


    this.socket.on('roomJoined', (game, userInfo, socketid) => {
      console.log("join heard container");
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  userInfo: userInfo,
                  playerOrder: game.playerOrder,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap});

      console.log("in container joined room, user: " + this.state.userInfo)
      this.GoToRoom();

    });
    
    this.socket.on('gameStartedGo', (game) => {
      console.log("gameStart heard container");
      this.setState({gameStatus: 1,
                    playerOrder: game.playerOrder,
                    indexMap: game.indexMap,
                    activePlayerIndex: game.activePlayerIndex});
    });

    this.socket.on("game-update", (game) => {
      console.log("update heard container");

      this.setState({
        indexMap: game.indexMap,
        activePlayerIndex: game.activePlayerIndex,
        numPlayers: game.numPlayers,
        timer: game.timer,
        roundEnd: game.roundEnd,
        isGameOver: game.isGameOver,
        letters: game.letters,
      });


      if (this.state.roundEnd) {
        this.setState({
          background_pos: 100
        })
        var container = document.getElementsByClassName("game-container");
        container[0].setAttribute("style", "background-position: " + this.state.background_pos + "%");
      }
      else {
        if (this.state.background_pos - 5 >= 0) {
            this.setState({background_pos: this.state.background_pos - 5});
          }
      }
    });

    this.socket.on('game-over', (game) => {
      this.setState({gameStatus: 2})
    });

    
 

    this.changeGameState = (newStatus) => {
      this.setState({roomSelect: newStatus});
    };
  
   }

    componentDidMount() {
        this.getUser();
    };

    keyDownBound = (e) => { 

    /* these should be moved to server eventually. 
        temporarily here for testing purposes. */

      console.log("keydown check");
      console.log("activePlayer" + this.state.activePlayerIndex);
      // console.log(this.state.indexMap);
      if (this.socket.id === this.state.indexMap[this.state.activePlayerIndex]) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          this.setState({letters: this.state.letters + e.key});
          /*if (this.state.background_pos - 5 >= 0) {
            this.setState({background_pos: this.state.background_pos - 5});
          }*/
          this.socket.emit("letter-added", this.state.letters);

        }
    };
    console.log(this.state.letters);
    console.log(this.state.background_pos);
};

  GoToRoomAdmin = () => {
    this.setState({admin: true});
    this.changeGameState(true);
    console.log("go to room admin")
  };

  GoToRoom = () => {
    this.changeGameState(true);
  };

  getUser = () => {
    fetch("/api/whoami")
        .then(res => res.json())
        .then(
            userObj => {
                if (userObj._id !== undefined) {
                    this.setState({ 
                        userInfo: userObj
                    });
                    console.log("info: def " + userObj)
                } else {
                    this.setState({ 
                        userInfo: userObj
                    });
                    console.log("info: undef " + userObj)
                }
            }
        );
  } 

  render() {
    console.log("userInfo? " +this.state.userInfo);
    switch (this.state.roomSelect) {
      case false:
        return (
          <SelectRoom 
            socket={this.socket} 
            userInfo={this.state.userInfo} 
            players={this.state.players} 
            onClickSelectAdminRoom={() => {this.GoToRoomAdmin()}} 
            onClickSelectRoom={() => {this.GoToRoom()}} 
            updateUsers={(roomNoUserInfo) => this.updateUsers(roomNoUserInfo)}
            indexMap = {this.state.indexMap}
            background_pos = {this.state.background_pos}
            letters = {this.state.letters} />
        );
      case true:
        return (
          <Room roomNo={this.state.roomNo} 
            socket={this.socket} 
            gameStatus = {this.state.gameStatus}
            playerOrder = {this.state.playerOrder}
            adminStatus={this.state.admin} 
            userInfo={this.state.userInfo} 
            players={this.state.players}
            indexMap = {this.state.indexMap}
            numPlayers = {this.state.numPlayers}
            activePlayerIndex = {this.state.activePlayerIndex}
            timer = {this.state.timer}
            background_pos = {this.state.background_pos}
            letters = {this.state.letters}  />
        );
    }
  }


}