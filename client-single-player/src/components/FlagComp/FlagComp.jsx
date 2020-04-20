import React, { Component } from 'react';
import './FlagCompcss.scss';
import flagImage from '../../images/Red_flag.png';
import CardHolderComp from '../CardHolderComp/CardHolderComp';
import Game from '../../sharedEntities/game';

class FlagComp extends Component {
    constructor(props) {
        super(props);

        this.state = {
        } 
        
    }


    handleClick(){
        if(this.props.currentAction === Game.claimStatus){
            this.props.handleClaimFlag(this.props.position);
        }
        this.props.handleClickFlag(this.props.position);
        

        
    }


    renderSide(pID){
        return (
            [2,1,0].map(position =>
                <CardHolderComp key={position} card={this.props.flagInfo.sides[pID][position]}></CardHolderComp>
            )
        );
    }

    renderImageClassesStatus(){
        if(this.props.flagInfo.taken){ //If taken dont animate
            return "flag-image--grayscale";
        }

        let classes = "flag-image";
        
        if(this.props.currentAction === Game.claimStatus || this.props.selectedCard ){
            classes += " flag-image--bouncing";
        }
        return classes;
    }


    render() { 
        return ( 
            <div className="flag" onClick={()=>this.handleClick()}>
                {this.renderSide(this.props.p1ID)}
                <img className={this.renderImageClassesStatus()} src={flagImage} alt="red flag" />
                {this.renderSide(this.props.p2ID)}
            </div>
         );
    }
}
 
export default FlagComp;