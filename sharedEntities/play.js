'use strict';

class Play{

    /**
     * Return a copy of the sorted hand
     * @param {Hand} hand 
     */
    static getSortedCopy(hand){ 
        return hand.sort((a,b)=>a.value-b.value);
    }

    static printPlay(hand){
        return hand.join(" ");
    }

    static isConsecutive(hand_){
        let hand = this.getSortedCopy(hand_);
        for(let i = 0; i < hand.length - 1; i++){
            if(hand[i].value+1 !== hand[i+1].value){
                return false;
            }
        }
        return true;
    }

    static isSameColor(hand){
        return hand.every(card=> card.color === hand[0].color);
    }

    static isSameValues(hand){
        return hand.every(card=> card.value === hand[0].value);
    }

    static getScore(hand){
        return hand.reduce(
            (total,current) => total+=current.value,
            0
        );
    }

    /**
     * "The" Method for Play. Return the power of the hand. 
     */
    static getTypeHand(hand){
        if(hand.length < 3){
            return Play.Host;
        }

        if(Play.isSameColor(hand) && Play.isConsecutive(hand)){
            return Play.Wedge;
        }

        if(Play.isSameValues(hand)){
            return Play.Phalanx;
        }

        if(Play.isSameColor(hand)){
            return Play.Battalion;
        }

        if(Play.isConsecutive(hand)){
            return Play.Skirmush;
        }

        return Play.Host;
        
    }

    /**
     * Return positive if hand1 is higher than hand2. 0 if equal. Negative if worse.
     * @param {*} hand1 
     * @param {*} hand2 
     */
    static isBetterHand(hand1, hand2){
        let hand1Type = Play.getTypeHand(hand1);
        let hand2Type = Play.getTypeHand(hand2);
    
        if(hand1Type === hand2Type){
            return Play.getScore(hand1) - Play.getScore(hand2);
        } 
        return hand1Type - hand2Type;  
        
    }

}


Play.Wedge = 4; //Same colour, consecutive values.
Play.Phalanx = 3; //Same value.
Play.Battalion = 2; //Same colour,
Play.Skirmush = 1; //Consecutive values, distinct colour
Play.Host = 0; //Any other
Play.playNames = ['Host','Skirmush','Battalion','Phalanx','Wedge'];

module.exports = Play;

