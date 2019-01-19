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
  }

  handleJoin = (event) => {
    console.log(this.state.value);
    this.props.socket.emit('roomChosen', this.state.value);

    this.props.socket.on('roomChosen', (roomNo) => {
      console.log("room chosen heard");
      this.setState({validCode: true});
      if (roomNo === -1) {
        this.setState({validCode: false});
      }
      else {
        this.props.onClickSelectRoom();
      }
    });

    this.setState({value: ''});

    event.preventDefault();
  }

  handleNew = (event) => {
    let roomNo = Math.floor((Math.random() * 100000) + 1);
    this.props.socket.emit('roomCreated', roomNo);
    console.log(roomNo);
    this.props.onClickSelectAdminRoom();

    event.preventDefault();

  }

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
