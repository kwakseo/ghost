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

/*  this.props.socket.on("roomCreated", (roomNoUserInfo) => {
      const userInfo = roomNoUserInfo.userInfo;
      this.setState({users:  [userInfo]});
      console.log("created, in selectroomjs, users " + users);
    });
*/

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
    /*this.props.socket.on('gameInit', (game, userInfo, socketid) => {
      console.log("heard room init");
      this.props.updateUsers(game, userInfo, socketid);
      console.log("in selectroom created room, user: " + this.props.userInfo);
/*      this.props.onClickSelectAdminRoom();*/

    

    event.preventDefault();

  };

  render(){
    const invalid = this.state.validCode ? null : <div>invalid</div>;

    return (
      <div className={"center select-title-box"}>
        <GameTitle />

        <form onSubmit={this.handleJoin}>
          <input id="m" className="center" value={this.state.value} onChange={this.handleChange} autoComplete="off"/>
          <div className="button" onClick={this.handleJoin}>Join</div>
          <div className="black-text">{invalid}</div>
          <div className="button" onClick={this.handleNew}>New Game</div>
        </form>
      </div>
    );
  }
}
