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

    console.log("get history in select room")
    console.log(this.props.userInfo)
    console.log(this.props.history);

    this.props.socket.on('leader-info', (leaderboardInfo) => {
      this.setState({leaderboardInfo: leaderboardInfo});
      console.log('in leader info')
      console.log(leaderboardInfo);
    });
  }

  componentDidMount() {
    this.getHistory().then(() => {
      console.log("in getHistory")
      console.log(this.state.history);
      this.props.socket.emit("get-history", this.state.history);
    });

    setTimeout(function() { //Start the timer
        this.setState({render: true}) //After 1 second, set render to true
    }.bind(this), 500)
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };

  handleJoin = (event) => {
    console.log("trying to join");

    this.props.socket.emit('roomChosen', {roomNo: this.state.value, userInfo: this.props.userInfo, socketId: this.props.socket.id});

    this.props.socket.on('roomInvalid', (roomNo) => {
      console.log("room invalid heard" + roomNo);
      this.setState({validCode: false});
    });


    this.setState({value: ''});

    event.preventDefault();
  };

  handleNew = (event) => {
    let roomNo = Math.floor((Math.random() * 100000) + 1);
    console.log("socketid");
    console.log(this.props.userInfo);
    console.log('should be new game')
    console.log(roomNo);
    const roomNoUserInfo = {roomNo:roomNo, userInfo: this.props.userInfo, socketId: this.props.socket.id};

    this.props.socket.emit('roomCreated', roomNoUserInfo);

    

    event.preventDefault();

  };

  render(){
    console.log('timer');
    console.log(this.state.render);
    console.log(this.state.history);
    const hello = this.state.render ? <Navbar userInfo = {this.props.userInfo} history={this.state.history} leaderboardInfo={this.state.leaderboardInfo}/> : null;
    const invalid = this.state.validCode ? null : <div>invalid</div>;

    return (
      <div>
        <div className={"game-container"}>
          <GameTitle />
          <form onSubmit={this.handleJoin} className="selectroom-container">
           <div className={"component-container join-box"}> 
            <input id="m" className="input-box" 
                      value={this.state.value} 
                      onChange={this.handleChange} 
                      autoComplete="off" 
                      placeholder="Enter Code"
                      onFocus={(e) => e.target.placeholder = ""} 
                      onBlur={(e) => e.target.placeholder = "Enter Code"}/>
              <div className="join-button" onClick={this.handleJoin}>Join</div>
            </div>
            <div className="black-text">{invalid}</div>
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
          console.log("history object");
          console.log(historyObj);
                if (historyObj[0] !== undefined) {
                  console.log('returning player')
                    this.setState({ 
                        history: historyObj,
                    });
                } else {
                  console.log('new player')
                    this.setState({ 
                        history: null
                    });
                }
            })
    };
}
