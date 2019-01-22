import React from "react";
import "../../css/app.css";

export default class Timer extends React.Component{
  constructor(props) {
    super(props);
  }


  render() {
    console.log('rendering timer');
    var timer = document.getElementsByClassName("timer-fill");
    if (timer.length != 0) {
      console.log("there are " + timer.length + " timers");
  /*    timer[0].setAttribute("style", "animation-name: timer-reset");*/
    }
    var timerBarClassList = "timer-bar player-" + this.props.activePlayer;
    var timerFillClassList = "timer-fill timer-player-" + this.props.activePlayer;
    return (
      <div className={"timer-box component-container"}>
        <div className={timerBarClassList} >
        	<div className={timerFillClassList} style={{animation: "timer 6.148s linear forwards"}}/>
        </div>
      </div>
    );
  }
}