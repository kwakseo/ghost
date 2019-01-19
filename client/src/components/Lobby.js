import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";
import Waiting from "./Waiting";
import WaitingAdmin from "./WaitingAdmin";

export default class Lobby extends React.Component {

  constructor(props) {
  	super(props);
  };

  render() {
    const view = this.props.adminStatus ? <WaitingAdmin roomNo={this.props.roomNo} socket={this.props.socket} /> : <Waiting socket={this.props.socket} />;
    return (
      <div className={"center"}>
      	{view}
      </div>
    );
  }
}