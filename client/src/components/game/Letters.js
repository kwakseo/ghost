import React from "react";
import "../../css/app.css";

export default class Letters extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      letterRender: false
    }
  }

 /* roundEndAnimation() {
    if (this.props.roundEnd) {
      setTimeout(function() {

      }, 500)
    }
  }*/

/*    setTimeout(function() { //Start the timer
        this.setState({render: true}) //After 1 second, set render to true
    }.bind(this), 500)
  }*/
  render() {
    var typeClassList = "";
    
    if (this.props.roundEnd) {
      setTimeout(function() {
      }, 5000);
      typeClassList += "letters-fade "
    };

    typeClassList += "letters-active typing-player-" + this.props.activePlayer;
    return (
      <div className={"letters-box component-container"}>
        <div className={typeClassList}>{this.props.letters}</div>
      </div>
    );
  }
}