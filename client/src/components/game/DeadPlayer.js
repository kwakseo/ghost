import React from "react";
import "../../css/app.css";
import logo from '../../css/ghost_logo.png';
import $ from 'jquery';
import io from "socket.io-client";

export default class DeadPlayer extends React.Component{

  constructor(props) {
    super(props);

    console.log('reached dead player component')
    this.props.socket.on("mousemove", (obj) => {
      console.log('detected move');
      $(obj.cssId).css('margin-left', obj.x);
      $(obj.cssId).css('margin-top', obj.y);
    });
  }

  componentDidMount = () => {
    const index = this.props.playerIndex;
    const socketid = this.props.indexMap[index];
    const playerStats = this.props.players[socketid];

    const userInfo = playerStats.userInfo;
    const name = userInfo.name;

    console.log('reached dead player component')
    console.log(socketid)
    console.log(this.props.socket.id)

    if (socketid === this.props.socket.id) {
      $(document).mousemove((e) => {
      var x = e.pageX;
      var y = e.pageY;
      console.log("move")
      let cssId = '#' + socketid
      console.log(cssId)
      console.log(x)
      console.log(y)
      this.props.socket.emit("mousemove", {cssId: cssId, x: x, y: y})

      $(cssId).css('margin-left', x);
      $(cssId).css('margin-top', y);
    });
    }
  }

  render() {

    const index = this.props.playerIndex;
    const socketid = this.props.indexMap[index];
    const playerStats = this.props.players[socketid];

    // const numStrikes = playerStats.ghost;
    const userInfo = playerStats.userInfo;
    const name = userInfo.name;


    return (

      <div>
        {console.log(name)}
        <div id={socketid} className = "dead-player">
          <div className="dead-player-name">{name}</div>
        </div>
      </div>
    );
  }
}