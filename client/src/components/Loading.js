import React from "react";
import LoginPage from "./LoginPage";

export default class GameRules extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true
    }
  }

  goLogin = () => {
    this.setState({loading: false})
  };

  render(){
    switch (this.state.loading) {

      case true: 
      return (
        <div className="vertical-content">
          <div className="loading">Loading...</div>
          <div className="vertical-content login">
            <div className="load-fail">Login failed - please try again</div>
            <div className="button" onClick={this.goLogin}><div className="home-icon"/></div>
          </div>
        </div>
      )

      case false: 
      return (
      <LoginPage/>
      )
  }
  }
}