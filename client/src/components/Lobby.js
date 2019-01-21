import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";
import Waiting from "./Waiting";
import WaitingAdmin from "./WaitingAdmin";
import Player from "./game/Player";

export default class Lobby extends React.Component {

  constructor(props) {
  	super(props);
  }

  
  render() {
    console.log("in lobbyjs");
    console.log(this.props.userInfo);
    const view = this.props.adminStatus ? 
        <WaitingAdmin 
          userInfo={this.props.userInfo} 
          roomNo={this.props.roomNo} 
          socket={this.props.socket} 
          players={this.props.players} 
          indexMap={this.props.indexMap} 
          playerOrder = {this.props.playerOrder}
          numPlayers = {this.props.numPlayers}
          background_pos = {this.props.background_pos}/> 

      : <Waiting 
          socket={this.props.socket} 
          userInfo={this.props.userInfo} 
          players={this.props.players}
          indexMap={this.props.indexMap} 
          playerOrder = {this.props.playerOrder}
          numPlayers = {this.props.numPlayers}
          background_pos = {this.props.background_pos}/>;

    return (
      <div className={"game-container scroll-background"}>
      	{view}
      </div>
    );
  }
}