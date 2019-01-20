import React from "react";
import "../../css/app.css";

export default class Letters extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    var typeClassList = "letters-active typing-player-" + this.props.activePlayerIndex;
    return (
      <div className={"letters-box component-container"}>
        <div className={typeClassList}>{this.props.letters}</div>
      </div>
    );
  }
}