import React from "react";
import Button from 'react-bootstrap/Button';
import CardRender from "./cards/CardRender";



export default class PlayingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	is_Game_started: this.props.is_Game_started,
    }
  }


	render(){
		if(this.props.is_Game_started){
			return(
				<>
					<div className="container">
						<div className="row justify-content-md-center">
							<div className="col col-lg-2">
	      				{this.props.gameResult}
	    				</div>
						</div>
						<div className="row justify-content-md-center">
							<div className="col col-lg-2">
	      				Summ of Cards: {this.props.cardSummA > 0 && this.props.cardSummA < 22 ? this.props.cardSumm + "/ " + this.props.cardSummA : this.props.cardSumm}
	    				</div>
						</div>
						<div className="row">
							{
								this.props.cards.map((card, index) =>
                <div className="col-sm" key={index}>
	      					<CardRender cardName={card}/>
	    					</div>
      				)}
	  				</div>
	  				<div className="row">
	    				<div className="col-sm">
	      				<Button variant="outline-primary" size="lg" onClick={this.props.oneMoreButtonClick} disabled={this.props.cardSumm > 21 ? true : false || this.props.isButtonDisabled}>Take one more card</Button>
	    				</div>
	    				<div className="col-sm">
	      				<Button variant="outline-primary" size="lg" onClick={this.props.enoughButtonClick} disabled={this.props.cardSumm > 21 ? true : false || this.props.isButtonDisabled}>Enough</Button>
	    				</div>
	    				<div className="col-sm">
	      				<Button variant="outline-primary" size="lg" onClick={this.props.menuTableButtonClick}>Menu</Button>
	   				  </div>
	   				  <div className="col-sm">
	      				<Button variant="outline-primary" size="lg" onClick={this.props.getDeckButtonClick} disabled={!(this.props.cardSumm > 21 ? true : false || this.props.isButtonDisabled)}>Get Deck</Button>
	   				  </div>
	  				</div>
					</div>
		  	</>
			);
		}
	}
}