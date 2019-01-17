import React from "react";
import "../../css/game.css";

export default class Letters extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"letters-bbox component-container"}>
        <div className={"letters-active"}>{this.props.letters}</div>
        <div className={"type-bar"}> | </div>
      </div>
    );
  }
}