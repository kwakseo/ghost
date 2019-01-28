import React from "react";
import "../css/app.css";
import { Route, Switch, withRouter } from 'react-router-dom';
import GameContainer from "./GameContainer";
import LoginPage from "./LoginPage";
import GameRules from "./GameRules";

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
          <Route exact path="/" component={LoginPage} userInfo={this.state.userInfo} />
          <Route exact path="/success" component={GameContainer} />
        </Switch>
      </div>
    )
    ;
  }

  

}

export default withRouter(App);