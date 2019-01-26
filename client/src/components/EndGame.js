import React from "react";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";
import "../css/endgame.css";
import "../css/app.css";


export default class EndGame extends React.Component {
  constructor(props){
    super(props);

  }

  componentDidMount () {
      var container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.props.background_pos + "%");
  }

  goHome = () => {
    this.props.socket.emit("go-back-home", "home");
  };

  render(){
    let rankOrder = this.props.deathOrder.reverse();
    let deathOrderArr = [];
    let number = 2;
    var title = null;
    var winnerGoogleId = null;

    for (var i=0; i<rankOrder.length; i++) {

      let player = JSON.stringify(rankOrder[i].userInfo.name).replace(/['"]+/g, '');

      if (i === 0) {
        var winnerGoogleId = rankOrder[i].userInfo.googleid;
        deathOrderArr.push((
          <div key={i+20} className="winner-container">
            <div key={i} className="winner-rank">1</div>
            <div key={i+10} className="winner-icon">{player}</div>
          </div>));
      }

      else {
        deathOrderArr.push((
          <div key={i+20} className="loser-container">
            <div key={i} className="loser-rank">{number}</div>
            <div key={i+10} className="loser-icon">
              <div key={i+30} className="loser-name">{player}</div>
            </div>
          </div>));
        number += 1;
      }

    }
    if (this.props.userInfo.googleid === winnerGoogleId) {
      title = "You win!";
    }
    else {
      title = "Good game!";
    }
    return (
      <div className={"game-container scroll-background-reverse"}>
        <div className="end-title">{title}</div> 
        <div className="rectangles">
          <div className="component-container">
            {deathOrderArr} 
          </div>
        </div>
        <div className="button" onClick={this.goHome}>Home</div>
      </div>
    );
  }
}