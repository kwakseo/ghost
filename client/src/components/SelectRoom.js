import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
// import io from "socket.io-client";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch";
import GameContainer from "./GameContainer";
import Profile from "./Profile";
import Navbar from "./Navbar";

export default class GameRules extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: '', validCode: true, render: false, history: null, leaderboardInfo: null};

    this.props.socket.on('leader-info', (leaderboardInfo) => {
      this.setState({leaderboardInfo: leaderboardInfo});
    });
  }

  componentDidMount() {
    this.getHistory().then(() => {
      this.props.socket.emit("get-history", this.state.history);
    });

    setTimeout(function() { //Start the timer
        this.setState({render: true}) //After 1 second, set render to true
    }.bind(this), 2000)
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  handleJoin = (event) => {

    this.props.socket.emit('roomChosen', {roomNo: this.state.value, userInfo: this.props.userInfo, socketId: this.props.socket.id});

    this.props.socket.on('roomInvalid', (roomNo) => {
      this.setState({validCode: false});
    });


    this.setState({value: ''});

    event.preventDefault();
  };

  handleNew = (event) => {
    let roomNo = Math.floor((Math.random() * 100000) + 1);
    const roomNoUserInfo = {roomNo:roomNo, userInfo: this.props.userInfo, socketId: this.props.socket.id};

    this.props.socket.emit('roomCreated', roomNoUserInfo);

    

    event.preventDefault();

  };

  render(){
    var invalid = null;
    const hello = this.state.render ? <Navbar userInfo = {this.props.userInfo} history={this.state.history} leaderboardInfo={this.state.leaderboardInfo}/> : null;
    
    if (!this.state.validCode) {
      invalid = "Invalid code"
    }

    return (
      <div>
        <div className={"game-container"}>
          <GameTitle />
          <form onSubmit={this.handleJoin} className="selectroom-container">
           <div className="component-container join-box"> 
            <input id="m" className="input-box" 
                      value={this.state.value} 
                      onChange={this.handleChange} 
                      autoComplete="off" 
                      placeholder="Enter Code"
                      onFocus={(e) => e.target.placeholder = ""} 
                      onBlur={(e) => e.target.placeholder = "Enter Code"}/>
              <div className="join-button" onClick={this.handleJoin}>Join</div>
              <div className="invalid-code">{invalid}</div>
            </div>
            <div className="button" onClick={this.handleNew}>Create Game</div>
            <div className={"rules-box component-container"}>
          </div>
          </form>
        </div>
        {hello}
      </div>
    );
  }

  getHistory = () => {
        return fetch('/api/history')
        .then(res => res.json())
        .then(
          historyObj => {
                if (historyObj[0] !== undefined) {
                    this.setState({ 
                        history: historyObj,
                    });
                } else {
                    this.setState({ 
                        history: null
                    });
                }
            })
    };
}
