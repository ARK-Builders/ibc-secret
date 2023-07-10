import React from "react";
import CardRender from "./cards/CardRender";
import Button from 'react-bootstrap/Button';


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
	      	<h1 className="cover-heading">{this.props.gameResult}</h1>
	      	<h2 className="cover-heading">Summ of Cards: {this.props.cardSummA > 0 && this.props.cardSummA < 22 ? this.props.cardSumm + "/ " + this.props.cardSummA : this.props.cardSumm}</h2>

					<div className="row">
						{
							this.props.cards.map((card, index) =>
	              <div className="col-sm rowitem" key={index}>
		      			<CardRender cardName={card}/>
		    				</div>
      			)}
	  			</div>
	  			<button type="button" className="btn btn-lg btn-secondary buttons4" onClick={this.props.oneMoreButtonClick} disabled={this.props.cardSumm > 21 ? true : false || this.props.isButtonDisabled}>Take one more card</button>
	  			<button type="button" className="btn btn-lg btn-secondary buttons4" onClick={this.props.enoughButtonClick} disabled={this.props.cardSumm > 21 ? true : false || this.props.isButtonDisabled}>Enough</button>
	  			<button type="button" className="btn btn-lg btn-secondary buttons4" onClick={this.props.menuTableButtonClick}>Menu</button>
	  			<button type="button" className="btn btn-lg btn-secondary buttons4" onClick={this.props.getDeckButtonClick} disabled={!(this.props.cardSumm > 21 ? true : false || this.props.isButtonDisabled)}>Get Deck</button>
		  	</>
			);
		}
	}
}