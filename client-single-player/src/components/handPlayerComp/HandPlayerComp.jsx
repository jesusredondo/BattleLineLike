import React, { Component } from 'react';
import CardComp from '../cardComp/CardComp';

import './HandPlayerCompcss.scss';

class HandPlayerComp extends Component {
    constructor(props) {
        super(props);
        this.setState = {};
    }


    renderCards() {
        return (
            this.props.hand.map(c =>
                <CardComp key={c} card={c} selectedCard={this.props.selectedCard} handleSelectedCard={this.props.handleSelectedCard} playerID={this.props.playerID}></CardComp>
            )
        );

    }

    render() {
        return (
            <div>
                <h4 className="centered">{this.props.playerID}</h4>
                <div className="hand-player">
                    {this.renderCards()}
                </div>
            </div>
        );
    }
}

export default HandPlayerComp;