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
          userInfo: null
      };
  }

<<<<<<< HEAD
=======
  componentDidMount() {
      this.getUser();
    }

/*  componentDidMount() {
      this.getUser();
  }*/
>>>>>>> ab6ebcdb292565a00993bd406c061924d7fede2e

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={LoginPage} userInfo={this.state.userInfo} />
          <Route exact path="/success" userInfo={this.state.userInfo} component={GameContainer} />
          <Route exact path="/rules" component={GameRules} />
        </Switch>
      </div>
    )
    ;
  }

}

export default withRouter(App);