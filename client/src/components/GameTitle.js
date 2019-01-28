import React from "react";
import "../css/app.css";
/*import posed from 'react-pose';*/

/*const Box = posed.div({
	  hidden: { opacity: 0 },
	  visible: { opacity: 1 },
	});*/



export default class GameTitle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return(
      <div className="title-container">
        <div className="title-logo"/>
        <div className="title-box">
          <div className="title">ghost</div>
        </div>
      </div>
    );
	}	
 }

