import React from "react";
// import "../css/homepage.css"
import "../css/app.css"
import io from "socket.io-client";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch";
import GameContainer from "./GameContainer";

export default class GameRules extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: '', validCode: true};
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
    const roomNoUserInfo = {roomNo:roomNo, userInfo: this.props.userInfo, socketId: this.props.socket.id};

    this.props.socket.emit('roomCreated', roomNoUserInfo);

    

    event.preventDefault();

  };

  render(){
    const invalid = this.state.validCode ? null : <div>invalid</div>;

    return (
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
          <div className="button" onClick={this.handleNew}>New Game</div>
          <div className={"rules-box component-container"}>
          <Link to="/rules" className={"rule-button"}>?</Link>
          <p>How to play</p>
        </div>
        </form>
      </div>
    );
  }
}
