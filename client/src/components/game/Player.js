import React from "react";
import "../../css/game.css";

export default class Player extends React.Component{

  constructor(props) {
    super(props);
  }

  render() {
    let classList = "player " + "player_" + this.props.player_number;
      if (this.props.player_active) {
        classList += " player_active"
      };
    return (
      <div className={classList} /> 
    );
  }
}

/*  getCellClass = (cellContent) => {
    switch (cellContent) {
      case 0:
        return "empty";
      case 1:
        return "my-snake";
      case 3:
        return "food";
      default:
        console.log("sad 😞");
        return null;
    }
  };*/
