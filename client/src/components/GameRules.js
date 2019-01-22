import React from "react";
import GameTitle from "./GameTitle";
import Link from "react-router-dom/es/Link";

export default class GameRules extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={"game-container"}>
        <div className={"left-align"}>
          <h1>Goal</h1>
          <ol>Take turns adding a letter to a growing string of letters while avoiding actually spelling a valid word.</ol>
          <h1>Number of Players</h1>
          <ol>2 to 4</ol>
          <h1>Strikes</h1>
          <ol>There are two ways a player can get a strike:
            <li>Complete a word, UNLESS the word can be extended to another word (ex. ghost can be extended to ghostliness)</li>
            <li>Add a letter that makes the string not lead to any word (ex. ghosr)</li>
          </ol>
          <ol>5 strikes and a player is out!</ol>
          <h1>Rounds</h1>
          <ol>A round ends when a player gets a strike. The game continues until only one player remains. Order of players is randomized at the beginning of each round.</ol>
          <h2>Create a game, or join one using your friend's code, to play!</h2>
        </div>
      </div>
    );
  }
}