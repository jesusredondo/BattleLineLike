import React, { Component } from 'react';
import cardBackImage from '../../images/card_back.png';
import './troopDeckcss.scss';


class TroopDeckComp extends Component {
    constructor(props) {
        super(props);
        this.state = { cardsLeft : 60 }
    }

   

    render() { 
        return ( 
            <div className="deck" onClick={this.props.handleTroopDraw}>
                <img className="deckImage" src={cardBackImage} alt="deck" />
                <p>{this.state.cardsLeft}</p>
            </div>
         );
    }
}
 
export default TroopDeckComp;