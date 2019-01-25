import React from "react";
import "../css/app.css";

export default class Profile extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
    	open: false,
      page: "nav", // nav (closed), prof (profile), leader (leaderboard), rules

    }
  }

  handleOpenLeader = (event) => {
  	this.setState({
  		open: true,
      page: "leader"
  	});
  };

  handleOpenProfile = (event) => {
    this.setState({
      open: true,
      page: "prof"
    });
  };

  handleOpenRules = (event) => {
    this.setState({
      open: true,
      page: "rules"
    });
  };

  handleClose = (event) => {
  	this.setState({
  		open: false,
      page: "nav"
  	});

  };

  render() {
  	var containerClasses = "nav-container";
    var profButtonClasses = "prof-button icon";
    var leaderButtonClasses = "leader-button icon";
    var rulesButtonClasses = "howto-button icon"
  	var profClasses = "profile-content";
    var leaderClasses = "leader-content";
    var rulesClasses = "rules-content";
    var contentClasses = "nav-content";
    var iconClasses = "icon-container";
    var closeBarClasses = "nav-close-bar";


  	var wins = (this.props.history != null) ? this.props.history[0].number_wins : "0";
  	var plays = (this.props.history != null) ? this.props.history[0].number_games : "0";
  	var longestString = null;

  	if (this.state.open) {

    containerClasses += " open";
    profButtonClasses += " open";
    leaderButtonClasses += " open";
    rulesButtonClasses += " open";
    profClasses += " open";
    leaderClasses += " open";
    rulesClasses += " open";
    contentClasses += " open";
    iconClasses += " open";
    closeBarClasses += " open";
  	};

    var contents = null;
    if (this.state.page === "prof") {
      contents =
      <div className="vertical-content">
        <div className="component-container">
          <div className="profile-icon">{this.props.userInfo.name}</div>
        </div>
        <div className="component-container">
          <div className="stats-container">
            <div className="stats-title">Wins</div>
            <div className="stats">{wins}</div>
          </div>
          <div className="stats-container">
            <div className="stats-title">Plays</div>
            <div className="stats">{plays}</div>
          </div>
        </div>
        <div className="stats-container">
          <div className="stats-title">Longest string</div>
          <div className="stats">thisisalongstring</div>
        </div>
      </div>
    }
    else if (this.state.page === "leader") {
      contents = 
      <div className="vertical-content">
        <div className="component-container">
          <h1>Leaderboard</h1>
        </div>
        <div className="component-container">
          <div className="left-content">
            <div className="winner-names">hello</div>
          </div>
          <div className="right-content">
            <div className="winner-scores">scores</div>
          </div>
        </div>
      </div>
    }

    else if (this.state.page === "rules") {
      contents = <h2>rules</h2>
{/*      <div className="vertical-content">
        <div className="horizontal-content">
          <div className="rule-component">
            <div className="rule-component-title"></div>
            <div className="rule-component-content"></div>
          </div>
          <div className="rule-component">
            <div className="rule-component-title"></div>
            <div className="rule-component-content"></div>
          </div>
        </div>
        <div className="horizontal-content">
          <div className="rule-component">
            <div className="rule-component-title"></div>
            <div className="rule-component-content"></div>
          </div>
          <div className="rule-component">
            <div className="rule-component-title"></div>
            <div className="rule-component-content"></div>
          </div>
        </div>
        <div className="vertical-content">
          <h2></h2>
        </div>*/}
/*      </div>*/
    }

    var navIcons = 
      <div className={iconClasses}> 
        <div className={leaderButtonClasses} onClick={this.handleOpenLeader}/>
        <div className="bar-divider" onClick={this.handleOpen}/>
        <div className={profButtonClasses} onClick={this.handleOpenProfile}/>
        <div className="bar-divider" onClick={this.handleOpen}/>
        <div className={rulesButtonClasses} onClick={this.handleOpenRules}/>
      </div>;

    return (
        <div className={containerClasses}>
          {navIcons}
          <div className={contentClasses}>
            {contents}
          </div>
          <div className={closeBarClasses} onClick={this.handleClose}/>
        </div>
    )

  }
}