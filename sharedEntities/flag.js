'use strict';

const Card = require('./card');
const Play = require('./play');
/**
 * Represents a Flag in the Game.
 * - The flag can be taken by a player. Initially it is not taken.
 * - Each player can only play cards in one of the sides of the flag.
 * 
 */
module.exports = class Flag{
    constructor(){
        this.p1 = new Array(3).fill(null);
        this.p2 = new Array(3).fill(null);
        this.isTakenByP1 = null;
    }

    /**
     * P1 in his turn plays a card in this Flag
     * @param {*} card 
     * @returns true is card could be played 
     */
    playP1(card){
        if(this.isTakenByP1 !== null){
            return false;
        }
        if(this.p1.length >= 3){
            return false;
        }
        this.p1.push(card);
        return true;
    }

    /**
     * Same, for player 2.
     * Keep 2 methods for readability
     */
    playP2(card){
        if(this.isTakenByP1 !== null){
            return false;
        }
        if(this.p2.length >= 3){
            return false;
        }
        this.p2.push(card);
        return true;
    }


    claimP1(){
        //TODO
        //This must be redone. Now you can only claim if both sides are full.
        if(this.p1.length < 3 || this.p2.length < 3){
            return false;
        }
        
        return Play.isBetterHand(this.p1, this.p2);
    }

    claimP2(){
        //TODO
        //This must be redone. Now you can only claim if both sides are full.
        if(this.p1.length < 3 || this.p2.length < 3){
            return false;
        }
        
        return Play.isBetterHand(this.p2, this.p1);
    }




}