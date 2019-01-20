import React from "react";
import "../../css/app.css";

export default class Timer extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    var timerBarClassList = "timer-bar player-" + this.props.activePlayerIndex;
    var timerFillClassList = "timer-fill timer-player-" + this.props.activePlayerIndex;
    return (
      <div className={"timer-box component-container"}>
        <div className={timerBarClassList}>
        	<div className={timerFillClassList}/>
        </div>
      </div>
    );
  }
}