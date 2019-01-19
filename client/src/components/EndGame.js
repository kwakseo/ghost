import React from "react";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";

export default class EndGame extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={"center"}>
        <GameTitle />
          Game Over
        <Link to="/" className={"button"}>Home</Link>

      </div>
    );
  }
}