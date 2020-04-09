'use strict';

var assert = require('assert');
let Flag = require('../flag');
let Card = require('../card');
let Game = require('../game');

describe('Testing Game class', ()=> {
    beforeEach(()=>{
        this.newEmptyGame = new Game("Jesus","Pepe");
        this.newEmptyGame.newGame();
    });

    describe('Checking Game constructor',()=>{
        it('All cards are in the game, no duplicates',()=>{
            let allCardsGenerated = [];
            for(let value = 0; value < 10; value++){
                for(let color = 0; color < 6; color++){
                    allCardsGenerated.push(new Card(value, color));
                }
            }

            let allCardsInGame = this.newEmptyGame.players["Jesus"];
            allCardsInGame.push(...this.newEmptyGame.players["Pepe"]);
            allCardsInGame.push(...this.newEmptyGame.troopDeck);

            for(let card of allCardsGenerated){
                assert(Game.handContainsTroopCard(allCardsInGame, card));
            }

        });

        if('The game starts in Play phase',()=>{
            assert.equal(Game.playStatus, this.newEmptyGame.turn.turnStatus);
        });

        it('Every player have 7 cards in his hand',()=>{
            assert.equal(7, this.newEmptyGame.players["Jesus"].length);
            assert.equal(7, this.newEmptyGame.players["Pepe"].length);
        });
        
    });

    
    describe('Checking drawTroopCard(playerID)',()=>{
        it('Only the player in his turn can draw',()=>{
            //Set phase to drawing:
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            //Get players
            let playerWithTurn = this.newEmptyGame.getIDPlayerTurn();
            let theOtherPlayer = this.newEmptyGame.getOtherPlayerID(playerWithTurn);

            assert.equal(false, this.newEmptyGame.drawTroopCard(theOtherPlayer));
            assert(this.newEmptyGame.drawTroopCard(playerWithTurn));
            assert.equal(false, this.newEmptyGame.drawTroopCard(theOtherPlayer));
        });

        it('Drawing a card is only possible in drawing stage',()=>{
            //Get player
            let playerWithTurn = this.newEmptyGame.getIDPlayerTurn();
            //Set phase to play:
            this.newEmptyGame.turn.turnStatus = Game.playStatus;
            assert.equal(false, this.newEmptyGame.drawTroopCard(playerWithTurn));
            //Set phase to claim:
            this.newEmptyGame.turn.turnStatus = Game.claimStatus;
            assert.equal(false, this.newEmptyGame.drawTroopCard(playerWithTurn));
            //Set phase to endTurn:
            this.newEmptyGame.turn.turnStatus = Game.endTurnStatus;
            assert.equal(false, this.newEmptyGame.drawTroopCard(playerWithTurn));
            //Set phase to draw: //here its is possible
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            assert(this.newEmptyGame.drawTroopCard(playerWithTurn));
        });

        it('Drawing a card work as intended',()=>{

        });
    });


});