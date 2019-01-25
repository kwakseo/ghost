import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import Link from "react-router-dom/es/Link";
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";
import Player from "./game/Player";

export default class Waiting extends React.Component {
	constructor(props) {
		super(props);



	}

  render() {
    var players = [];
    console.log('in waiting');
    for (var i=0; i<this.props.numPlayers; i++) {
      players.push(<Player 
              key = {i}
              players = {this.props.players}
              playerIndex = {i}
              indexMap={this.props.indexMap}
            />);
      console.log('inloop');

    };

    return (
      <div className={"center"}>
        <div className="waiting-text">Invite friends with your game code:</div>
        <div className="waiting-code">{this.props.roomNo}</div>
        <div className="waiting-text"> Waiting for admin to click start</div>
        <div className={"players-box component-container"}>
          {players}
        </div>
      </div>
    );
  }
}