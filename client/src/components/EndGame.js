import React from "react";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";

export default class EndGame extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount () {
      var container = document.getElementsByClassName("game-container");
      container[0].setAttribute("style", "background-position: " + "0% " + this.props.background_pos + "%");
  }

  render(){
    return (
      <div className={"game-container scroll-background-reverse"}>
        <GameTitle />
          Game Over
        <Link to="/" className={"button"}>Home</Link>

      </div>
    );
  }
}