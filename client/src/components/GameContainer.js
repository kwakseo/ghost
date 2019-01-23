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
/*    this.socket = io()*/
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

      history: null,
      newPlayer: true,
      winnerId: null,
      clientToSocketIdMap: [],
      playerDeath: false,
    }

    document.addEventListener("keydown", this.keyDownBound);

    this.socket.on('get-history', (history) => {
      this.setState({history: history});
    })

    this.socket.on('gameInit', (game, userInfo, socketid) => {
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  userInfo: userInfo,
                  admin: true,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap,});

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
                    activePlayer: game.activePlayer,
                    clientToSocketIdMap: game.clientToSocketIdMap});
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

      });


      if (this.state.roundEnd) {
        this.setState({
          background_pos: 100
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
      this.setState({winnerId: this.state.clientToSocketIdMap[this.state.indexMap[this.state.activePlayer]]});
      console.log('game over')
      console.log(this.state.winnerId);
      this.setState({gameStatus: 2})
    });

    // this.socket.on('player-death', (game) => {
    //   this.updateHistory();
    // });

    
 

    this.changeGameState = (newStatus) => {
      this.setState({roomSelect: newStatus});
    };
  
   }

    componentDidMount() {
       this.getUser().then(() => {
          console.log("game container did mount")
          console.log(this.state.userInfo)
          this.socket.emit("user-info", this.state.userInfo);
        });
        // this.getHistory().then(() => {
        //   console.log("in getHistory")
        //   console.log(this.state.history);
        //   this.socket.emit("get-history", this.state.history);
        // });
        // this.addHistory();    
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
    return fetch("/api/whoami")
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
            newPlayer = {this.state.newPlayer}
            winnerId = {this.state.winnerId}  />
        );
    }
  }

  // getHistory = () => {
  //       return fetch('/api/history')
  //       .then(res => res.json())
  //       .then(
  //         historyObj => {
  //           console.log("history object");
  //         console.log(historyObj);
  //         // console.log(historyObj[0]._id)
  //               if (historyObj[0] !== undefined) {
  //                 console.log('returning player')
  //                   this.setState({ 
  //                       history: historyObj,
  //                       newPlayer: false
  //                   });
  //               } else {
  //                 console.log('new player')
  //                   this.setState({ 
  //                       history: null
  //                   });
  //               }
  //           })
  //   };

}