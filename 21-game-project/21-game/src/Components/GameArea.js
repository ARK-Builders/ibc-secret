import React from "react";
import StartGameButton from "./StartGameButton";
import PlayingTable from "./PlayingTable";


let cardValues =  new Map([
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 2],
  [6, 3],
  [7, 4],
  [8, 1],
]);


export default class GameArea extends React.Component {
  constructor(props) {
    super(props);
    this.startGameButtonClick = this.startGameButtonClick.bind(this);
    this.addcards = this.addcards.bind(this);
    this.menuTableButtonClick = this.menuTableButtonClick.bind(this);
    this.oneMoreButtonClick = this.oneMoreButtonClick.bind(this);
    this.enoughButtonClick = this.enoughButtonClick.bind(this);
    this.getDeckButtonClick = this.getDeckButtonClick.bind(this);
    this.state = {
    	is_Game_started: false,
    	cardPosition: 0,
    	cardSumm: 0,
      cardSummA: 0,
    	cards: ["cardBack", "cardBack"],
    	gameResult: " ",
    	isButtonDisabled: false
    }
  }



  addcards = (newCards) => {
        if(newCards[0] !== null){
          let tempCards = [...this.state.cards];
          let curSum = this.state.cardSumm;
          let curSumA = this.state.cardSummA;
          console.log(newCards);
          for(let i = 0; i < newCards.length; i++)
          {
            tempCards[this.state.cardPosition + i] = newCards[i];
            if(curSumA > 0)
            {
              curSumA += cardValues.get(tempCards[this.state.cardPosition + i]);
              this.setState({cardSummA: curSumA});
            }
            else if((tempCards[this.state.cardPosition + i]) === 8)
            {
              curSumA = curSum + 11;
              this.setState({cardSummA: curSumA});
            }
            curSum += cardValues.get(tempCards[this.state.cardPosition + i]);
            this.setState({cardSumm: curSum});
            this.setState({cards: [...tempCards], cardPosition: this.state.cardPosition + 1 + i});
          }
          if(curSum > 21)
          {
            this.setState({gameResult: "You Lost"});
          }
        }
      }

  oneMoreButtonClick = async () => {
    let temp = [];
        try {
          await this.props.query_card(temp, this.state.cardPosition);
          console.log("kurwa");
          console.log(temp[0].deck);
          this.addcards(temp[0].deck);
        } catch (error) {
            alert("Please connect your wallet by selecting the wallet icon.");
          }
  }

  enoughButtonClick = async () => {
  	    let temp = [];
        try {
          await this.props.query_win(temp, this.state.cardPosition);
          console.log(temp[0].result);
          this.setState({gameResult: temp[0].result, isButtonDisabled: true});
        } catch (error) {
            alert("Please connect your wallet by selecting the wallet icon.");
          }
  }

  startGameButtonClick = async () => {
    let temp = [];
    try {
          await this.props.create_deck();
          await this.props.query_2cards(temp);
          this.setState({is_Game_started: true});
          console.log(temp[0].deck);
          this.addcards(temp[0].deck);
        } catch (error) {
            alert("Please connect your wallet by selecting the wallet icon.");
          }
  }
  menuTableButtonClick() {
    this.setState({is_Game_started: false,
    	cardPosition: 0,
    	cardSumm: 0,
      cardSummA: 0,
    	cards: ["cardBack", "cardBack"],
    	gameResult: " ",
    	isButtonDisabled: false
  });

  }
  getDeckButtonClick = async () => {
    let temp = [];
    try {
          await this.props.query_deck(temp);
          this.setState({cards: temp[0].deck});
          console.log(temp[0].deck);
        } catch (error) {
            alert("Please connect your wallet by selecting the wallet icon.");
          }
  }
	render(){
		return(
    <main role="main" className="inner cover">
      {
        this.state.is_Game_started ?
        <></>
        :
          <>
          <h1 className="cover-heading">Rules</h1>
          <p className="lead">The whole deck consists of 36 cards.
          Player receives 2 random cards from the dealer.
          Player can request new cards until they stop or lose.
          If sum of card values is greater than 21 then they lose.
          If sum of card values is lower than 19 then they lose.
          If sum of card values is 19, 20 or 21 then they win.</p>
          </>
      }
			<StartGameButton is_Game_started={this.state.is_Game_started} startGameButtonClick={this.startGameButtonClick}/>
			<PlayingTable is_Game_started={this.state.is_Game_started} getDeckButtonClick={this.getDeckButtonClick} enoughButtonClick={this.enoughButtonClick} menuTableButtonClick={this.menuTableButtonClick} oneMoreButtonClick={this.oneMoreButtonClick} cardSumm={this.state.cardSumm} cardSummA={this.state.cardSummA} cards={this.state.cards} gameResult ={this.state.gameResult} isButtonDisabled={this.state.isButtonDisabled}/>
		</main>
		);
	}
}