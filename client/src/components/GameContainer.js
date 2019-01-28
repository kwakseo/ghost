import React from "react";
import GameBoard from "./game/GameBoard";
import SelectRoom from "./SelectRoom";
import WaitingAdmin from "./WaitingAdmin";
import Waiting from "./Waiting";
import InvalidCode from "./InvalidCode";
import io from "socket.io-client";
import EndGame from "./EndGame";
import Room from "./Room";
import Loading from "./Loading";

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props);
/*    this.socket = io("http://localhost:3000");*/
    this.socket=io();

    this.state = {
      gameStatus: 0, // 0 is not started, 1 is in session, 2 is ended
      roomSelect: false,
      roomNo: -1,
      admin: false,
      userInfo: null,

      players: null,
      numPlayers: null,
      totalPlayers: null,
      indexMap: null,
      playerOrder: null,
      roundEnd: false,

      activePlayer: null,
      timer: null,
      background_pos: 100,
      letters: "",
      keyPressed: new Set(),
      hadTurn: false,

      history: null,
      newPlayer: true,
      winnerId: null,
      clientToSocketIdMap: [],
      playerDeath: false,
      deathOrder: null,
      lastActivePlayer: null,
      lastWords: [],
      leaderboardInfo: null,
    }

    document.addEventListener("keydown", this.keyDownBound);

    this.socket.on('get-history', (history) => {
      this.setState({history: history});
    });

    // this.socket.on('leader-info', (leaderboardInfo) => {
    //   this.setState({leaderboardInfo: leaderboardInfo});
    //   console.log('leader info sent to client');
    //   console.log(this.state.leaderboardInfo)
    // });

    this.socket.on('gameInit', (game, userInfo, socketid) => {
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  admin: true,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap,
                  deathOrder: game.deathOrder,
                  playerOrder: game.playerOrder,
                  letters: "",
                  timer: null,
                  background_pos: 100,
                  winnerId: null,
                  deathOrder: null,
                  playerDeath: false,
                  lastWords: [],
                  leaderboardInfo: null,
                  keyPressed: new Set(),
                  hadTurn: false,
                });

      let container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.state.background_pos + "%");

      console.log("in container created room, user: " + this.state.userInfo);
      this.GoToRoomAdmin();
    });


    this.socket.on('roomJoined', (game, userInfo, socketid) => {
      const players = game.players;

      this.setState({players: players,
                  roomNo: game.roomNo,
                  playerOrder: game.playerOrder,
                  numPlayers: game.numPlayers,
                  indexMap: game.indexMap,
                  deathOrder: game.deathOrder,
                  letters: "",
                  timer: null,
                  background_pos: 100,
                  winnerId: null,
                  deathOrder: null,
                  playerDeath: false,
                  lastWords: [],
                  leaderboardInfo: null,
                  keyPressed: new Set(),
                  hadTurn: false,
                });
      
      console.log("in container joined room, user: " + this.state.userInfo)
      this.GoToRoom();

    });

    this.socket.on('only-to-joiner', (game) => {
      this.setState({
        admin: false,
      });
    });
    
    this.socket.on('gameStartedGo', (game) => {
      this.setState({gameStatus: 1,
                    playerOrder: game.playerOrder,
                    indexMap: game.indexMap,
                    activePlayer: game.activePlayer,
                    clientToSocketIdMap: game.clientToSocketIdMap});
      let container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.state.background_pos + "%")
    });

    this.socket.on("disconnect", (game) => {
        this.setState({
          playerOrder: game.playerOrder,
          indexMap: game.indexMap,
          players: game.players,
          numPlayers: game.numPlayers,
          totalPlayers: game.totalPlayers,
        })
    });

    this.socket.on("game-update", (game) => {

      roundEndAnimation(this, game);
      if (this.state.hadTurn) {
        this.setState({hadTurn: false});
      }
      
      });


    async function roundEndAnimation (item, game) {

        console.log('in round end');
        item.setState({
          roundEnd: game.roundEnd
        });

        function stalling(){
          console.log('last word');
          console.log(game.lastWords[game.lastWords.length-1]);
          item.setState({
            letters: game.lastWords[game.lastWords.length-1]
          });
          return new Promise(resolve => {
            setTimeout(() => {resolve('resolved');
            }, 900);
          });
        }

        if (item.state.roundEnd) {
          
          let result = await stalling();
          item.setState({
            background_pos: 100,
          });
        }

        else {
          if (item.state.background_pos - 5 >= 0) {
              item.setState({background_pos: item.state.background_pos - 5});
            }
        }

        item.setState({
          players: game.players,
          indexMap: game.indexMap,
          activePlayer: game.activePlayer,
          numPlayers: game.numPlayers,
          timer: game.timer,
          roundEnd: false,
          isGameOver: game.isGameOver,
          letters: game.letters,
          playerOrder: game.playerOrder,
          deathOrder: game.deathOrder,
          lastActivePlayer: game.lastActivePlayer,
          lastWords: game.lastWords,
        });

        let container = document.getElementsByClassName("game-container");
        container[0].setAttribute("style", "background-position: " + "0% " + item.state.background_pos + "%");
      
        }

    this.socket.on('game-over', (game) => {
      this.setState({activePlayer: game.activePlayer});
      this.setState({winnerId: this.state.clientToSocketIdMap[this.state.indexMap[this.state.activePlayer]]});
      console.log('game over');
      console.log(this.state.winnerId);

      this.setState({
        gameStatus: 2,
        deathOrder: game.deathOrder,
        })
      this.socket.emit("game-over", this.state.gameStatus);
    });

    this.socket.on("go-back-home", (home) => {
      this.setState({
        gameStatus: 0,
        roomSelect: false,
        roomNo: -1,
        admin: false,
        userInfo: null,

        players: null,
        numPlayers: null,
        totalPlayers: null,
        indexMap: null,
        playerOrder: null,
        roundEnd: false,

        activePlayer: null,
        timer: null,
        background_pos: 100,
        letters: "",
        keyPressed: new Set(),
        hadTurn: false,

        history: null,
        newPlayer: true,
        winnerId: null,
        clientToSocketIdMap: [],
        playerDeath: false,
        deathOrder: null,
        lastActivePlayer: null,
        lastWords: [],
        leaderboardInfo: null,
      });
      this.getUser().then(() => {
          console.log("game container did mount")
          console.log(this.state.userInfo)
          this.socket.emit("user-info", this.state.userInfo);
        });
    });

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
    };

    keyDownBound = (e) => { 

      if (this.state.gameStatus === 1 && !this.state.roundEnd && !this.state.hadTurn) {
        if (this.socket.id === this.state.indexMap[this.state.activePlayer]) {
          if (e.keyCode >= 65 && e.keyCode <= 90) {
            this.setState({hadTurn: true});
            this.setState({letters: this.state.letters + e.key}); 
            this.socket.emit("letter-added", this.state.letters);
            }

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
                        userInfo: null
                    });
                    console.log("info: undef " + userObj)
                }
            }
        );
  } 

  logout = () => {
    console.log('logging out')
        this.setState({
            userInfo: null
        })
    };

  render() {
    const isLoggedIn = this.state.userInfo !== null
    console.log('checking log in')
    console.log(this.state.userInfo);
    switch (this.state.roomSelect) {
      case false:
        return (
          <div>
        {
          isLoggedIn ? (
          <SelectRoom 
            socket={this.socket} 
            userInfo={this.state.userInfo} 
            players={this.state.players} 
            onClickSelectAdminRoom={() => {this.GoToRoomAdmin()}} 
            onClickSelectRoom={() => {this.GoToRoom()}} 
            updateUsers={(roomNoUserInfo) => this.updateUsers(roomNoUserInfo)}
            indexMap = {this.state.indexMap}
            background_pos = {this.state.background_pos}
            letters = {this.state.letters}
            logout = {this.logout} />
            ): (
            <Loading
            socket = {this.socket}/>
            
        )
        }
        </div>
        )
      case true:
        return (
          <div>
        {
          isLoggedIn ? (
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
            roundEnd = {this.state.roundEnd}
            letters = {this.state.letters}
            newPlayer = {this.state.newPlayer}
            winnerId = {this.state.winnerId} 
            deathOrder = {this.state.deathOrder}  />
          ) : (
          <Loading
            socket = {this.socket}/>
          )
        }
        </div>
        );
    }
  }

}