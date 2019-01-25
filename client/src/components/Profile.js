import React from "react";
import "../css/app.css";

export default class Profile extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
    	open: false

    }
  }

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
  	var containerClasses = "profile-container";
  	var greetingClasses = "profile-greeting";
  	var contentClasses = "profile-content";

  	var wins = (this.props.history != null) ? this.props.history[0].number_wins : "0";
  	var plays = (this.props.history != null) ? this.props.history[0].number_games : "0";
  	var longestString = (this.props.history != null) ? this.props.history[0].longest_word : 'N/A';

  	if (this.state.open) {
  		containerClasses += " open";
  		contentClasses += " open";
  		greetingClasses += " open";
  	}

  	var contents = 
  		<div className={contentClasses}>
  			<div className="close-bar" onClick={this.handleClose}>|||</div>
  			<div className="no-space-rows profile-content-box">
	  			<div className="icon-container">
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
  		</div>

  	return (
  		<div>
	        <div className={containerClasses} onClick={this.handleOpen}>
	          <div className={greetingClasses}>Hello, {this.props.userInfo.name}!</div>
	        </div>
        {contents}
        </div>
    )
  }
}