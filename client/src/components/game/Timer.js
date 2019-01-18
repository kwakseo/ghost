import React from "react";
import "../../css/game.css";

export default class Timer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"timer-box component-container"}>
        <div id={"timer-bar"}>
        	<div id={"timer-fill"}/>
        </div>
      </div>
    );
  }
}