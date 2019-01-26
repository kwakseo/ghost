import React from "react";
import "../css/app.css";
import GameTitle from "./GameTitle";
import { Link } from 'react-router-dom';
import HowtoPlayNav from "./HowtoPlayNav";

export default class LoginPage extends React.Component {

  render() {
    return (
    <div className={"game-container"}>
      <div className={"center login-title-box"}>
      	<GameTitle/>
      	<a className={"button"} href="/auth/google">Login through Google</a>
      </div>
      <HowtoPlayNav/>
    </div>
    );
  }
}