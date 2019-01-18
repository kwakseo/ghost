import React from "react";
import "../../css/game.css";

export default class Player extends React.Component{

  constructor(props) {
    super(props);
  }

  render() {
    let classList = "player " + "player-" + this.props.player_number;
      if (this.props.player_active) {
        classList += " player-active"
      };
    return (
      <div className={classList} /> 
    );
  }
}