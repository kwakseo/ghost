const API_ENDPOINT_START = 'http://ghost6148.herokuapp.com';

import React from "react";
import "../css/app.css";
import GameTitle from "./GameTitle";
import { Link } from 'react-router-dom';

export default class LoginPage extends React.Component {
  render() {
    return (
    <div className={"game-container"}>
      <div className={"center login-title-box"}>
      	<GameTitle/>
      	<a className={"button"} href="/auth/google">Login</a>
        <div className={"rules-box component-container"}>
          <Link to={API_ENDPOINT_START} + "/rules" className={"rule-button"}>?</Link>
          <p>How to play</p>
        </div>
      </div>
    </div>
    );
  }
}