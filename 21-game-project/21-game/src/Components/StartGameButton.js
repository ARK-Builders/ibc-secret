import React from "react";

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
	  			<p className="lead">
	  				<button type="button" className="btn btn-lg btn-secondary" onClick={this.props.startGameButtonClick}>Start Game</button>
	  			</p>
	  		</div>
			);
		}
	}
}