import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import Link from "react-router-dom/es/Link";
import GameTitle from "./GameTitle";
import GameContainer from "./GameContainer";

export default class InvalidCode extends React.Component {
  render() {
    return (
      <div className={"center"}>
        <div className="black-text"> Invalid code. Please try again or press start new. </div>
        <div className="button" onClick={this.props.onClickGoBack}>Go Back</div>
      </div>
    );
  }
}