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
  }

  render(){
    // let deathOrder = JSON.stringify(this.props.deathOrder);
    let deathOrderArr = [];
    let rankingArr = [];
    for (let loser in this.props.deathOrder.reverse()) {
      let player = JSON.stringify(this.props.deathOrder[loser].userInfo.name).replace(/['"]+/g, '')
      deathOrderArr.push((
        <div key={loser} className="loser-order"> {player} </div>
        ))
      rankingArr.push((
        <div key={loser} className="loser-order"> {loser} </div>
        ))
    }
    return (
      <div className={"game-container scroll-background-reverse"}>
        <div className="title">GameOver</div> 
        <div className="rectangles">
          <div className="component-container">
            {deathOrderArr} 
          </div>
          <div className="component-container">
            {rankingArr} 
          </div>
        </div>
        <div className="button" onClick={this.goHome}>Home</div>
      </div>
    );
  }
}