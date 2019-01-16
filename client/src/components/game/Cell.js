import React from "react";
import "../../css/game.css";

export default class Cell extends React.Component{

  getCellClass = (cellContent) => {
    switch (cellContent) {
      case 0:
        return "cell empty";
      case 1:
        return "cell my-snake";
      case 2:
        return "cell food";
      default:
        console.log("sad 😞");
        return null;
    }
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.getCellClass(this.props.cellContent)} x={this.props.x} y={this.props.y} />
    );
  }
}