import React, { Component } from 'react';
import cardBackImage from '../../images/card_back.png';
import './troopDeckcss.scss';


class TroopDeckComp extends Component {
    
    render() { 
        return ( 
            <div className="deck" onClick={this.props.handleTroopDraw}>
                <img className="deckImage" src={cardBackImage} alt="deck" />
            </div>
         );
    }
}
 
export default TroopDeckComp;