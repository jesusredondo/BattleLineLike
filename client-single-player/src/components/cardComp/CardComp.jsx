import React, { Component } from 'react';

import './CardCompcss.scss'

class CardComp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCardClick= ()=>{
        let newCardSelected = this.props.card;
        let newWhoSelectedCard = this.props.playerID;
        if( this.props.selectedCard && this.props.selectedCard.isSameCardAs(this.props.card) ){
            newCardSelected = null;
            newWhoSelectedCard = null;
        }
        this.props.handleSelectedCard(newCardSelected, newWhoSelectedCard);
    }


    render() { 
        return ( 
            <div className="aspect-container">
            <div className="aspect-125"></div>
            <div onClick={this.handleCardClick} className={"card card--bg-color-" + this.props.card.color + " " +(this.props.selectedCard && this.props.selectedCard.isSameCardAs(this.props.card) ? "card--selected" : "")}>
                <div className="card--top-left-corner">{this.props.card.value}</div>
                <div className="card-middle">
                </div>
                <div className="card--bottom-right-corner">{this.props.card.value}</div>
            </div>
        </div>
         );
    }
}
 
export default CardComp;


