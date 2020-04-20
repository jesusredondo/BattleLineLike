import React, { Component } from 'react';
import './CardHolderCompcss.scss';


class CardHolderComp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
           
         }
    }
    render() { 

        if(!this.props.card){
            return <div className="card-holder--empty"></div>;
        }
        else{
            return ( 
                <div className={"card-holder card-holder--bg-color-" + this.props.card.color}>
                    {this.props.card.value}         
                </div>
             );
        }
        
    }
}
 
export default CardHolderComp;