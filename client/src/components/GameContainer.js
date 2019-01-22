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
      roundEnd: false,

      activePlayer: null,
      timer: null,
      background_pos: 100,
      letters: "",
      deathOrder: null,
    }

    document.addEventListener("keydown", this.keyDownBound);

    this.socket.on('gameInit', (game, userInfo, socketid) => {
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  userInfo: userInfo,
                  admin: true,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap,
                  deathOrder: game.deathOrder,});

      var container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.state.background_pos + "%");

      console.log("in container created room, user: " + this.state.userInfo);
      this.GoToRoomAdmin();
    });


    this.socket.on('roomJoined', (game, userInfo, socketid) => {
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  userInfo: userInfo,
                  playerOrder: game.playerOrder,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap,});
      
      console.log("in container joined room, user: " + this.state.userInfo)
      this.GoToRoom();

    });
    
    this.socket.on('gameStartedGo', (game) => {
      this.setState({gameStatus: 1,
                    playerOrder: game.playerOrder,
                    indexMap: game.indexMap,
                    activePlayer: game.activePlayer});
      var container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.state.background_pos + "%")
    });

    this.socket.on("game-update", (game) => {
      this.setState({
        players: game.players,
        indexMap: game.indexMap,
        activePlayer: game.activePlayer,
        numPlayers: game.numPlayers,
        timer: game.timer,
        roundEnd: game.roundEnd,
        isGameOver: game.isGameOver,
        letters: game.letters,
        playerOrder: game.playerOrder,
        deathOrder: game.deathOrder,
      });


      if (this.state.roundEnd) {
        this.setState({
          background_pos: 100,
          deathOrder: game.deathOrder,
        })

        
      }
      else {
        if (this.state.background_pos - 5 >= 0) {
            this.setState({background_pos: this.state.background_pos - 5});
            
          }
      }
      var container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.state.background_pos + "%");
    });

    this.socket.on('game-over', (game) => {
      this.setState({
        gameStatus: 2,
        deathOrder: game.deathOrder,
        })
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
      if (this.state.gameStatus === 1) {
        console.log("keydown check");
        console.log("activePlayer" + this.state.activePlayer);
        if (this.socket.id === this.state.indexMap[this.state.activePlayer]) {
          if (e.keyCode >= 65 && e.keyCode <= 90) {
            this.setState({letters: this.state.letters + e.key});
            }
            this.socket.emit("letter-added", this.state.letters);

          }
        }
    };


  GoToRoomAdmin = () => {
    this.setState({admin: true});
    this.changeGameState(true);
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
            activePlayer = {this.state.activePlayer}
            timer = {this.state.timer}
            background_pos = {this.state.background_pos}
            letters = {this.state.letters}
            deathOrder = {this.state.deathOrder}  />
        );
    }
  }


}