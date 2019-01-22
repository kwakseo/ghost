const API_ENDPOINT_START = 'http://ghost6148.herokuapp.com';

import React from "react";
import "../css/app.css";
import { Route, Switch, withRouter } from 'react-router-dom';
import GameContainer from "./GameContainer";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import GameRules from "./GameRules";
import SelectRoom from "./SelectRoom";
import WaitingAdmin from "./WaitingAdmin";
import GameBoard from "./game/GameBoard";

class App extends React.Component {
  constructor(props) {
      super(props);
  this.state = {
    userInfo: null,
  }

  }



  render() {
    return (
      <div>
        <Switch>
          <Route exact path={API_ENDPOINT_START} component={LoginPage} userInfo={this.state.userInfo} />
          <Route exact path={API_ENDPOINT_START} + "/success" component={GameContainer} />
          <Route exact path={API_ENDPOINT_START} + "/rules" component={GameRules} />
        </Switch>
      </div>
    )
    ;
  }

}

export default withRouter(App);