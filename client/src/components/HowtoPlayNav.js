import React from "react";
import "../css/app.css";

export default class Profile extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
    	open: false
    }
  };

  handleOpen = (event) => {
  	this.setState({
  		open: true
  	});
  };

  handleClose = (event) => {
  	this.setState({
  		open: false
  	});
  };

  render() {
    var containerClasses = "nav-container home";
    var rulesClasses = "rules-content";
    var contentClasses = "nav-content";
    var howtoplayClasses = "how-to-play-title";
    var closeBarClasses = "nav-close-bar";

    if (this.state.open) {

    containerClasses += " open";
    rulesClasses += " open";
    contentClasses += " open";
    closeBarClasses += " open";
    howtoplayClasses += " open";
    };

    var contents =
      <div className="vertical-content">
        <div className="horizontal-content">
          <div className="rule-component goal">
            <div className="rule-component-title">Goal</div>
            <div className="rule-component-content">
            Take turns adding a letter to a growing string of letters while avoiding actually spelling a valid word. 
            </div>
          </div>
          <div className="rule-component players">
            <div className="rule-component-title">Players</div>
            <div className="rule-component-content">2 to 4</div>
          </div>
        </div>
        <div className="rule-component strikes">
          <div className="rule-component-title">Strikes</div>
          <div className="rule-component-content">A player gets a strike if they:</div>
          <div className="rule-component-content">1.  Complete a word UNLESS the word can be extended to another word</div>
          <div className="rule-component-content italic">(ex. ghost can be extended to ghostliness)</div>
          <div className="rule-component-content">2.  Add a letter that makes the string not lead to any word</div>
          <div className="rule-component-content italic">(ex. ghosr)</div>
          <div className="rule-component-content">5 strikes and a player is out!</div>
        </div>
        <div className="rule-component rounds">
          <div className="rule-component-title">Rounds</div>
          <div className="rule-component-content">
          A round ends when a player gets a strike - the game continues until only one player remains. Order of players is randomized at the beginning of each round.
          </div>
        </div>
        <div className="vertical-content">
          <div className="rule-component-letsplay">Login to join a game using your friend's code or create your own!</div>
        </div>
      </div>

    return (
        <div className={containerClasses}>
          <div className={howtoplayClasses} onClick={this.handleOpen}>How to Play</div>
          <div className={contentClasses}>
            {contents}
          </div>
          <div className={closeBarClasses} onClick={this.handleClose}><div className="menu-horizontal"/></div>
        </div>
    )

  }
}