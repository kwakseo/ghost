import React from "react";
import "../../css/app.css";

export default class Player extends React.Component{

  constructor(props) {
    super(props);
  

    this.state = {
      name: null,
      googleid: null,
      socketid: null,
      playerIndex: null,
      ghostLetters: '',
      alive: true,

    }
  }

  componentDidMount() {
        this.unpackUserInfo(this.props.players, this.props.playerIndex, this.props.indexMap);
    };

  unpackUserInfo = (players, playerIndex, indexMap) => {
    const socketid = indexMap[playerIndex];
    const playerInfo = players[socketid];
    const userInfo = playerInfo.userInfo;
    const strikes = playerInfo.ghost;

    let playerGhostLetters = ''

    for (i=0; i<strikes; i++) {
      let playerGhostLetters = playerGhostLetters + 'ghost'[i];
    }

    this.setState({name: userInfo.name, 
                  googleid: userInfo.googleid, 
                  socketid: socketid, 
                  playerIndex: playerInfo.index,
                  ghostLetters: playerGhostLetters,
                  alive: playerInfo.alive});
  };

  render() {
    let classList = "player-bubble " + "player-" + this.state.playerIndex;
    let ghostClassList= "ghost-letters ghost-player-" + this.state.playerIndex;
      if (this.props.activePlayerIndex === this.state.playerIndex) {
        classList += " player-active"
      };

    return (
      <div className="player-container">
        <div className={classList}>
          <div className="player-name">{this.state.name}</div>
        </div>
        <div className={ghostClassList}></div>
      </div>
    );
  }


  /*getUser = () => {
    fetch("/api/whoami")
        .then(res => res.json())
        .then(
            userObj => {
                if (userObj._id !== undefined) {
                    this.setState({ 
                        name: userObj.name,
                        id: userObj._id
                    });
                } else {
                    this.setState({ 
                        userInfo: null
                    });
                }
            }
        );
  } */
}