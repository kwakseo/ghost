import React from "react";
import "../css/app.css";
import GameTitle from "./GameTitle";

export default class HomePage extends React.Component {
  render() {
    return (
      <div className={"center"}>
      	<GameTitle />
        <div className={"button"} onClick={this.props.onClickStart}>Start</div>
      </div>
    );
  }
}
