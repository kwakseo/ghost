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
      // this.props.updateHistory(this.props.winnerId);
      // if (this.props.newPlayer) {
      //   this.props.addHistory(this.props.winnerId);
      // }
      // else {
      //   this.props.updateHistory(this.props.winnerId);
      // }
  }

  render(){
    // let deathOrder = JSON.stringify(this.props.deathOrder);
    let deathOrderArr = []
    for (let loser in this.props.deathOrder) {
      let player = JSON.stringify(this.props.deathOrder[loser].userInfo.name).replace(/['"]+/g, '')
      deathOrderArr.push((
        <div key={loser} className="loser-order"> {player} </div>
        ))
    }
    return (
      <div className={"game-container scroll-background-reverse"}>
        <div className="title">GameOver</div> 
        <div className="rectangles">
          <div className="players-box component-container">
            {deathOrderArr} 
          </div>
        </div>
        <Link to="/" className={"button"}>Home</Link>
      </div>
    );
  }
}