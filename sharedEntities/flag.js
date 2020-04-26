'use strict';

const Card = require('./card');
const Play = require('./play');
/**
 * Represents a Flag in the Game.
 * - The flag can be taken by a player. Initially it is not taken.
 * - Each player can only play cards in one of the sides of the flag.
 * - Player IDs must be String type.
 */
module.exports = class Flag{
    constructor(p1ID, p2ID, position){ //IMPORTANT ID's MUST BE STRINGS!!!
        this.position = position
        this.sides = {
            [p1ID] : [], //the value of p1ID is the attribute.
            [p2ID] : []
        };
        this.isTakenBy = null;
    }

    /**
     * Player, "playerID" in his turn plays a card in this Flag
     * @param {*} card 
     * @returns true is card could be played 
     */
    play(playerID, card){
        if(this.isTakenBy !== null){
            return false;
        }
        if(this.sides[playerID] && this.sides[playerID].length >= 3){
            return false;
        }
        this.sides[playerID].push(card);
        return true;
    }

    /**
     * Player tries to claim this flag. 
     * - Can't claim already taken flags.
     * //TODO: To claim now, the flag must be full.
     * @param {*} playerID 
     */
    claim(playerID){
        //TODO
        //This must be redone. Now you can only claim if both sides are full.
        // A Easy approach would be passing an array of cards with all the other visible cards in the board.
        let otherPID = this.getOtherPlayerID(playerID);
        if(this.isTakenBy !== null){
            return false;
        }
        if((this.sides[playerID] && this.sides[playerID].length < 3) || 
            (this.sides[otherPID] && this.sides[otherPID].length < 3)){
            return false;
        }
        if(Play.isBetterHand(this.sides[playerID], this.sides[otherPID]) >= 0){ //TODO: Now you can claim same value plays
            this.isTakenBy = playerID;
            return true;
        }
        return false
    }

    
    //Returns the other player id
    getOtherPlayerID(playerID){
        for(let id in this.sides){
            if (id != playerID){
                return id;
            }
        }
        return null;
    }



}