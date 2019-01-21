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

    }
    console.log('player js');
  }

  componentDidMount() {
        this.unpackUserInfo(this.props.players, this.props.playerIndex, this.props.indexMap);
    };

  unpackUserInfo = (players, playerIndex, indexMap) => {
    const socketid = indexMap[playerIndex];
    console.log(socketid);
    const playerInfo = players[socketid];
    console.log(playerInfo);
    const userInfo = playerInfo.userInfo;
    console.log(userInfo);
    this.setState({name: userInfo.name, googleid: userInfo.googleid, socketid: socketid, playerIndex: playerIndex});
    console.log("id?: " + this.state.googleid);
  };

  render() {
    console.log("name?");
    console.log(this.state.name);
    let classList = "player-bubble " + "player-" + this.state.playerIndex;
      if (this.props.activePlayerIndex === this.state.playerIndex) {
        classList += " player-active"
      };
    return (
      <div className={classList}>
        <div className="player-name">{this.state.name}</div>
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