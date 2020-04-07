'use strict';

class Play{

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


    static printPlay(hand){
        return hand.join(" ");
    }

    /**
     * Return a copy of the sorted hand
     * @param {Hand} hand 
     */
    static getSortedCopy(hand){ 
        return hand.sort((a,b)=>a.value-b.value);
    }
}


Play.Wedge = 4; //Same colour, consecutive values.
Play.Phalanx = 3; //Same value.
Play.Battalion = 2; //Same colour,
Play.Skirmush = 1; //Consecutive values, distinct colour
Play.Host = 0; //Any other

module.exports = Play;

