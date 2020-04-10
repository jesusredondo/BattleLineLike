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
                new Flag(this.getPlayersIDArray()[0], this.getPlayersIDArray()[1], i) 
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
            flagNumber >= Game.numberOfFlags ||
            ! Game.handContainsTroopCard(this.players[playerID], card)  //the player has this card in his hand
        ){
            return false;
        }

        if(this.flags[flagNumber].play(playerID, card)){
            //Remove the used card from the player's hand: //REMOVES ONLY THE FIRST CARD IF THERE ARE DUPLICATES.
            let indiceBorrar
            for(indiceBorrar = 0; this.players[playerID]; indiceBorrar++){
                if(this.players[playerID][indiceBorrar].isSameCardAs(card)){
                    break;
                }
            }
            this.players[playerID].splice(indiceBorrar,1); //Remove 1 position.
            this.turn.turnStatus = Game.drawStatus;
            return true;
        }
        return false;
    }



    /**
     * Draw a troop card from the table to the playerID's hand.
     * - The playerID must be correct.
     * - If there aren't more cards in the troopdeck, then return a Card.noCard.
     * @param {*} playerID 
     * @returns false if you couldn't draw the card.
     * @returns If draw is allowed, return the card drawed.
     */
    drawTroopCard(playerID){
        if( (!this.players[playerID]) ||
            (this.turn.player != playerID) ||
            (this.turn.turnStatus !== Game.drawStatus) 
            ){
            return false;
        }
        //TODO: REVIEW WHAT HAPPENS WHEN ALL CARDS ARE HANDED OUT.
        let cardDrawn;
        if(this.troopDeck.length > 0){
            cardDrawn = this.troopDeck.pop();
            this.players[playerID].push(cardDrawn);
        } else{
            cardDrawn = Card.noCard;
        }
        
        this.turn.turnStatus = Game.claimStatus;
        return cardDrawn;
    }


    
    claim(playerID, flagNumber){
        if(
            !this.players[playerID] ||
            this.turn.player != playerID ||
            this.turn.turnStatus !== Game.claimStatus ||
            flagNumber < 0 ||
            flagNumber >= Game.numberOfFlags
        ){
            return false;
        }
        if(this.flags[flagNumber].claim(playerID)){ //Claim success if return >= 0
            return true;
        }
        this.turn.turnStatus = Game.endTurnStatus;
        return false;
    }

    /**
     * The turn can be finished in the claim or "endTurn" stage
     * @param {*} playerID 
     */
    endTurn(playerID){
        if(
            !this.players[playerID] ||
            this.turn.player != playerID ||
            (this.turn.turnStatus !== Game.endTurnStatus && this.turn.turnStatus !== Game.claimStatus) //can finish turn in claim Stage
        ){
            return false;
        }
        this.turn.player = this.getOtherPlayerID(this.turn.player);
        this.turn.turnStatus = Game.playStatus;
        return true;
    }


    /**
     * Performs a query to check who has won this game.
     * - Return the player ID of the winner.
     * - If the game hasn't ended yet, return false.
     */
    whoWonTheGame(){
        let playersID = this.getPlayersIDArray();
        for(let playerID of playersID){
            if(this.hasWonTheGame(playerID)){
                return playerID;
            }
        }
        return false;
    }

    //UTILITIES

    /**
     * Return true if this player has won the game. Win conditions are:
     * - Get 3 consecutive flags.
     * - Get 5 of ther 9 flags.
     * @param {*} playerID 
     */
    hasWonTheGame(playerID){
        let flagsWon = this.flags.filter(flag => flag.isTakenBy == playerID);
        if(flagsWon.length >= 5){
            return true; //5 flags is a win.
        }
        if(Game.get3ConsecutiveFlags(flagsWon)){
            return true // 3 consecutive flags is a win.
        }
        return false; //Any other case is a game in progress.
    }

    /**
     * Return true if there are 3 consecutive flags (by position) in the flag array.
     * @param {*} flagsWon 
     */
    static get3ConsecutiveFlags(flagsWon){
        let orderedFlagsWon = flagsWon.sort((flag1, flag2) => flag1.position - flag2.position ); //From lower to higher
        let consecutiveFlags = 1;
        for(let i = 0; i < orderedFlagsWon.length -1; i++){
            if(orderedFlagsWon[i].position +1 == orderedFlagsWon[i+1].position){
                consecutiveFlags ++;
                if(consecutiveFlags == 3){
                    return true;
                }
            }else{
                consecutiveFlags = 1;
            }
        }
        return false;
    }




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