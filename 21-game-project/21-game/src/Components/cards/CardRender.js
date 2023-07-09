import React from "react";

import cardBack from './cardback.jpg';

import card6 from './6.jpg';
import card7  from './7.jpg';
import card8  from './8.jpg';
import card9  from './9.jpg';
import card10  from './10.jpg';
import cardJ  from './J.jpg';
import cardQ  from './Q.jpg';
import cardK  from './K.jpg';
import cardA  from './A.jpg';


let cardArray = new Map();

cardArray["cardBack"] = cardBack;
cardArray[0] = card6;
cardArray[1] = card7;
cardArray[2] = card8;
cardArray[3] = card9;
cardArray[4] = card10;
cardArray[5] = cardJ;
cardArray[6] = cardQ;
cardArray[7] = cardK;
cardArray[8] = cardA;

function CardRender(props) {
	if(props.cardName === " ")
		return <></>;
  return (
  		<img src={cardArray[props.cardName]} alt={props.cardName} />
  );
}

export default CardRender;