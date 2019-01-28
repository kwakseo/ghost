import React from "react";
import "../../css/app.css";

export default class Player extends React.Component{

  constructor(props) {
    super(props);
  

/*    this.state = {
      name: null,
      googleid: null,
      socketid: null,
      playerIndex: null,
      ghostLetters: '',
      alive: true,

    }*/
  }

/*  componentDidMount() {
        this.unpackUserInfo(this.props.players, this.props.playerIndex, this.props.indexMap);
    };

  unpackUserInfo = (players, playerIndex, indexMap) => {
    const socketid = indexMap[playerIndex];
    const playerInfo = players[socketid];
    const userInfo = playerInfo.userInfo;
    const strikes = playerInfo.ghost;

    let playerGhostLetters = ''

    for (var i=0; i<strikes; i++) {
      let playerGhostLetters = playerGhostLetters + 'ghost'[i];
    }

    this.setState({name: userInfo.name, 
                  googleid: userInfo.googleid, 
                  socketid: socketid, 
                  playerIndex: playerInfo.index,
                  ghostLetters: playerGhostLetters,
                  alive: playerInfo.alive});
  };*/

  render() {

    const index = this.props.playerIndex;
    const socketid = this.props.indexMap[index];
    const playerStats = this.props.players[socketid];
    console.log("stats");
    console.log(playerStats);
    const numStrikes = playerStats.ghost;
    const userInfo = playerStats.userInfo;
    const name = userInfo.name;

    let ghostLetters = '';
/*    let ghostClassList = '';*/

    for (var i=0; i<numStrikes; i++) {
      ghostLetters = ghostLetters + 'ghost'[i];
    };

/*    if (ghostLetters === 'ghost') {
      classList = "dead-player";
    }*/
    let classList = "player-bubble " + "player-" + index;
    let ghostClassList = "ghost-letters ghost-player-" + index;

    if (this.props.activePlayer === index) {
        classList += " player-active"
      };


    return (
      <div className="player-container">
        <div className={classList}>
          <div className="player-name">{name}</div>
        </div>
        <div className={ghostClassList}>{ghostLetters}</div>
      </div>
    );
  }
}