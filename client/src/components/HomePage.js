import React from "react";
import "../css/app.css";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";

export default class HomePage extends React.Component {
  render() {
    return (
      <div className={"center"}>
      	<GameTitle />
      	<Link to="/rules" className={"button"}>Rules</Link>
        <div className={"button"} onClick={this.props.onClickStart}>Start</div>
      </div>
    );
  }
}
