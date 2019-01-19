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

/*    this.state = {
    	isVisible: true,
    	word: "ghost",
    	full: true,
    	fullword: "ghost",
    };*/
  }

/*  componentDidMount() {
    setInterval(() => {
      this.setState({ full: !this.state.full });
      this.setState({ full ? this.state.word.substring(0, this.state.word.length - 1) : this.state.word.fullword});
    }, 250);
  }*/

/*  <Box className="title" >
      		{this.state.word}
      </Box>*/
  render() {
/*  	const isVisible = this.state.isVisible;*/
    return(
    	<div className="title">ghost</div>
    );
	}	
 }

