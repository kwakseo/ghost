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

    var content = null;

    if (this.props.letters === "" && this.props.socket.id === this.props.indexMap[this.props.activePlayer]) {
      content = <div className="press-any-letter">Press any letter key to start</div>
    }
    else {
      typeClassList += "letters-active typing-player-" + this.props.activePlayer;
      content = <div className={typeClassList}>{this.props.letters}</div>
    }

    return (
      <div className={"letters-box component-container"}>
        {content}
      </div>
    );
  }
}