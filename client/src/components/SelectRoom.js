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
    this.state = {value: ''};
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleJoin = (event) => {
    console.log(this.state.value);
    this.props.socket.emit('roomChosen', this.state.value);

    this.setState({value: ''});
    this.props.onClickSelectRoom();

    event.preventDefault();
  }

  handleNew = (event) => {
    let roomNo = Math.floor((Math.random() * 100000) + 1);
    this.props.socket.emit('roomChosen', roomNo);
    console.log(roomNo);
    this.props.onClickSelectAdminRoom();

    event.preventDefault();

  }

  render(){
    return (
      <div className={"center"}>
        <GameTitle />

        <form onSubmit={this.handleJoin}>
          <input id="m" value={this.state.value} onChange={this.handleChange} autoComplete="off"/>
          <div className="button" onClick={this.handleJoin}>Join</div>
          <div className="button" onClick={this.handleNew}>New Game</div>
        </form>

        <div className="button" onClick={this.props.onClickGoHome}>Home</div>

      </div>
    );
  }
}
