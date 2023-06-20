import React from "react";
import Button from 'react-bootstrap/Button';

export default class StartGameButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	is_Game_started: this.props.is_Game_started
    }
  }


render(){
	if(!this.props.is_Game_started){
		return(
			<div className="StartGame">
	  			<div className="vertical-center">
	  				<Button variant="primary" size="lg" onClick={this.props.startGameButtonClick}>Start Game</Button>
	  			</div>
	  		</div>
			);
		}
	}
}