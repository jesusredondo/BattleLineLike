'use strict';
const Card = require('./card');
const Flag = require('./flag');


/**
 * Handles the game logic.
 * - Right now there are no tactics cards, only troops.
 * - Each player is represented by his ID and hand.
 * - Keep tracks of the turn to avoid illegal plays.
 * - Only performs actions if the action is a legal movement. Each turn is based in 4 actions:
 *      - (0) Play a card. The player MUST play a card at the beginning of his turn.
 *      - (1) Draw a card. After the player play, he must draw a card.
 *      - (2) Claim flag. It is optional. At the end of the turn a player can claim a flag. If it success, you can repeat until a claim fails.
 *      - (3) End turn. After the claiming phase, the player MUST end his turn.
 */
class Game{

    constructor(p1ID, p2ID){ //IMPORTANT. Player IDs must be STRINGS.
        this.turn = null;
        this.troopDeck = [];
        this.flags = [];
        this.players = { //players and hands.
            [p1ID]: [],
            [p2ID]: []
        };
    }

    /**
     * Creates a new game. 
     * - Flips a coin for player turn.
     * - Generates deck and shuffles it.
     * - Empty hands for players.
     */
    newGame(){
        this.turn = {
            player: this.getPlayersIDArray()[Game.generateRandom(2)],
            turnStatus :Game.playStatus
        };
            
        //Shuffle 
        this.troopDeck = [];
        for(let value = 0; value < Card.numberOfValues; value++){
            for(let color = 0; color < Card.numberOfColors; color++){
                this.troopDeck.push(new Card(value, color));
            }
        }
        Game.shuffle(this.troopDeck);

        //Prepare the flags
        this.flags = [];
        for(let i = 0; i < Game.numberOfFlags; i++){
            this.flags.push(
                new Flag(this.getPlayersIDArray()[0], this.getPlayersIDArray()[1]) 
            );
        }

        // Hand out players' cards
        for(let playerID in this.players){
            this.players[playerID] = [];
            while(this.players[playerID].length < Game.initialDraw){
                this.players[playerID].push(this.troopDeck.pop());
            }
        }
    }


    /**
     * The player "playerID" plays the card "card" in the flag number "flagNumber".
     * Only works if:
     * - It is the player's turn.
     * - It is the playing phase.
     * - The player has that card in his hand
     * @param {*} playerID 
     * @param {*} card 
     */
    playTroop(playerID, card, flagNumber){
        if(
            !this.players[playerID] ||                                  //Player correct
            this.turn.player != playerID ||                             //it is his turn
            this.turn.turnStatus !== Game.playStatus ||                 //phase of playing
            flagNumber < 0 ||                                           //Flag in range [0,9]
            flagNumber > Game.numberOfFlags ||
            ! Game.handContainsTroopCard(this.players[playerID], card)  //the player has this card in his hand
        ){
            return false;
        }

        if(this.flags[flagNumber].play(playerID, card)){
            this.turn.turnStatus = Game.drawStatus;
            return true;
        }
        return false;
    }



    /**
     * Draw a troop card from the table to the playerID's hand.
     * - The playerID must be correct.
     * @param {*} playerID 
     */
    drawTroopCard(playerID){
        if( (!this.players[playerID]) ||
            (this.turn.player != playerID) ||
            (this.troopDeck.length === 0) ||
            (this.turn.turnStatus !== Game.drawStatus) 
            ){
            return false;
        }
        
        this.players[playerID].push(this.troopDeck.pop());
        return true;
    }



    claim(playerID, flagNumber){
        if(
            !this.players[playerID] ||
            this.turn.player != playerID ||
            this.turn.turnStatus !== Game.claimStatus ||
            flagNumber < 0 ||
            flagNumber > Game.numberOfFlags
        ){
            return false;
        }
        if(this.players[playerID].claim(playerID)){
            return true;
        }
        this.turn.turnStatus = Game.endTurnStatus;
        return false;
    }

    endTurn(playerID){
        if(
            !this.players[playerID] ||
            this.turn.player != playerID ||
            this.turn.turnStatus !== Game.endTurnStatus
        ){
            return false;
        }
        this.turn.player = this.getOtherPlayerID(this.turn.player);
        this.turn.turnStatus = Game.playStatus;
    }


    /**
     * Performs a query to check who has won this game.
     * - Return the player ID of the winner.
     * - If the game hasn't ended yet, return null.
     */
    whoWonTheGame(){
        //TODO
    }

    //UTILITIES


    /**
     * Return an array with the players IDS
     */
    getPlayersIDArray(){
        return Object.keys(this.players);
    }

    //Returns the other player id
    getOtherPlayerID(playerID){
        for(let id in this.players){
            if (id != playerID){
                return id;
            }
        }
        return null;
    }

    getIDPlayerTurn(){
        return this.turn.player;
    }


    /**
     * Shuffles an array by shapping all his positions.
     * @param {Array} array 
     */
    static shuffle(array){
        for(let i = 0; i < array.length; i++){
            Game.swapInArray(array, i, Game.generateRandom(array.length));
        }
    }

    static swapInArray(array,pos1,pos2){
        let aux = array[pos1];
        array[pos1] = array[pos2];
        array[pos2] = aux;
    }

    /**
     * Generates a random value [0,cap)
     * @param {*} cap 
     */
    static generateRandom(cap){
        return Math.floor(Math.random()*cap);
    }

    static handContainsTroopCard(hand, card){
        for(let cardInHand of hand){
            if(cardInHand.isSameCardAs(card)){
                return true;
            }
        }
        return false;
    }

}

Game.numberOfFlags = 9;
Game.initialDraw = 7;

Game.playStatus = 0;
Game.drawStatus = 1;
Game.claimStatus = 2;
Game.endTurnStatus = 3;
Game.statusNames = ['Play a card','Draw a card','Claim a card', 'Finish turn'];


module.exports = Game;