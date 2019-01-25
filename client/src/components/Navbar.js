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
  	var profClasses = "profile-content";
    var leaderClasses = "leader-content";
    var rulesClasses = "rules-content";
    var contentClasses = "nav-content";
    var iconClasses = "icon-container";
    var closeBarClasses = "nav-close-bar";

    var wins = "0";
    var plays = "0";
    var longestString = "Play to track your longest string!"
    if (this.props.history != null) {
      wins = this.props.history[0].number_wins;
      plays = this.props.history[0].number_games;
      longestString = this.props.history[0].longest_word;
    }

    var leaderboardNames = [];
    var leaderboardScores = [];

    for (var i=0; i<this.props.leaderboardInfo.length; i++) {
      var leaderStats = this.props.leaderboardInfo[i];

      if (i<3) {
        leaderboardNames.push(<div key={i} className="leader-top-three">{leaderStats[0]}</div>);
        leaderboardScores.push(<div key={i+10} className="leader-top-three">{leaderStats[1]}</div>);
      }
      else {
        leaderboardNames.push(<div key={i} className="leader">{leaderStats[0]}</div>);
        leaderboardScores.push(<div key={i+10} className="leader">{leaderStats[1]}</div>);
      }
    }

  	if (this.state.open) {

    containerClasses += " open";
    profClasses += " open";
    leaderClasses += " open";
    rulesClasses += " open";
    contentClasses += " open";
    closeBarClasses += " open";
    iconClasses += " open";
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
          <div className="stats">{longestString}</div>
        </div>
      </div>
    }
    else if (this.state.page === "leader") {
      contents = 
      <div className="vertical-content">
        <div className="vertical-content">
          <div className="leaderboard-title">Leaderboard</div>
        </div>
        <div className="horizontal-content">
          <div className="winner-names">{leaderboardNames}</div>
          <div className="winner-scores">{leaderboardScores}</div>
        </div>
      </div>
    }

    else if (this.state.page === "rules") {
      contents =
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
          <div className="rule-component-letsplay">Create a game, or join one using your friend's code, to play!</div>
        </div>
      </div>
    }

    var navIcons = 
      <div className={iconClasses}> 
        <div className="leader-button icon" onClick={this.handleOpenLeader}/>
        <div className="prof-button icon" onClick={this.handleOpenProfile}/>
        <div className="howto-button icon" onClick={this.handleOpenRules}/>
      </div>;

    return (
        <div className={containerClasses}>
          {navIcons}
          <div className={contentClasses}>
            {contents}
          </div>
          <div className={closeBarClasses} onClick={this.handleClose}><div className="menu-horizontal"/></div>
        </div>
    )

  }
}