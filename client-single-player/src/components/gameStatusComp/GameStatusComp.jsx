import React, { Component } from 'react';
import Game from '../../sharedEntities/game';

import './GameStatusCompcss.scss';


class GameStatusComp extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }


    renderAction(){
        return Game.statusNames[this.props.currentAction];
    }

    renderEndTurn(){
        
        return this.props.currentAction === Game.claimStatus || this.props.currentAction === Game.endTurnStatus ? 
        <h2 onClick={this.props.handleEndTurn}>End Turn</h2> 
        : false
    }

    render() { 
        return ( 
            <div id="game-status-container" >
                <p class="game-status-container--message">Turn: <span>{this.props.turnID}</span></p>
                <p class="game-status-container--message">Action: <span>{this.renderAction()}</span></p>
                <div id="game-status-container--end-turn-holder">
                    {this.renderEndTurn()}
                </div>
            </div>
         );
    }
}
 
export default GameStatusComp;