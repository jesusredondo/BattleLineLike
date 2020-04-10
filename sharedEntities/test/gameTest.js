'use strict';

var assert = require('assert');
let Flag = require('../flag');
let Card = require('../card');
let Game = require('../game');

describe('Testing Game class', ()=> {
    beforeEach(()=>{
        this.newEmptyGame = new Game("Jesus","Pepe");
        this.newEmptyGame.newGame();
        this.playerWithTurn = this.newEmptyGame.getIDPlayerTurn();
        this.theOtherPlayer = this.newEmptyGame.getOtherPlayerID(this.playerWithTurn);
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

            assert.equal(false, this.newEmptyGame.drawTroopCard(this.theOtherPlayer));
            assert(this.newEmptyGame.drawTroopCard(this.playerWithTurn));
            assert.equal(false, this.newEmptyGame.drawTroopCard(this.theOtherPlayer));
        });

        it('Drawing a card is only possible in drawing stage',()=>{
            //Set phase to play:
            this.newEmptyGame.turn.turnStatus = Game.playStatus;
            assert.equal(false, this.newEmptyGame.drawTroopCard(this.playerWithTurn));
            //Set phase to claim:
            this.newEmptyGame.turn.turnStatus = Game.claimStatus;
            assert.equal(false, this.newEmptyGame.drawTroopCard(this.playerWithTurn));
            //Set phase to endTurn:
            this.newEmptyGame.turn.turnStatus = Game.endTurnStatus;
            assert.equal(false, this.newEmptyGame.drawTroopCard(this.playerWithTurn));
            //Set phase to draw: //here its is possible
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            assert(this.newEmptyGame.drawTroopCard(this.playerWithTurn));
        });

        it('Drawing a card work as intended',()=>{
            //Set un drawing phase
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            //Expected values
            let expectedCard = this.newEmptyGame.troopDeck.slice(-1)[0];
            let expectedNumberOfCards = this.newEmptyGame.troopDeck.length -1 ;
            //Draw & Assert
            assert.equal(false, Game.handContainsTroopCard(this.newEmptyGame.players[this.playerWithTurn], expectedCard));
            let cardDrawn = this.newEmptyGame.drawTroopCard(this.playerWithTurn);
            assert.equal(JSON.stringify(expectedCard), JSON.stringify(cardDrawn));
            assert(Game.handContainsTroopCard(this.newEmptyGame.players[this.playerWithTurn], expectedCard));
            assert.equal(expectedNumberOfCards, this.newEmptyGame.troopDeck.length);
            //Assert turn changes properly:
            assert.equal(this.playerWithTurn, this.newEmptyGame.turn.player);
            assert.equal(Game.claimStatus, this.newEmptyGame.turn.turnStatus);
        });

        it('Drawing from empty table gets "noCard" card.',()=>{
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            this.newEmptyGame.troopDeck = [];
            assert.equal(Card.noCard, this.newEmptyGame.drawTroopCard(this.playerWithTurn));
            //Both comparisions, by value is preferable.
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            assert(Card.noCard.isSameCardAs(this.newEmptyGame.drawTroopCard(this.playerWithTurn)));
        });
    });


    describe('Checking playTroop(playerID, card, flagNumber)',()=>{
        it('In the play stage, the player can play a card that it is his hand',()=>{
            let cardToPlay = this.newEmptyGame.players[this.playerWithTurn][Game.generateRandom(this.newEmptyGame.players[this.playerWithTurn].length)];
            assert.equal(false,this.newEmptyGame.playTroop(this.playerWithTurn, cardToPlay, -1)); //Invalid Flag number
            assert.equal(false,this.newEmptyGame.playTroop(this.playerWithTurn, cardToPlay, 9)); //Invalid Flag number
            assert(this.newEmptyGame.playTroop(this.playerWithTurn, cardToPlay, 0));
            //Card is no longer in hand
            assert.equal(false, Game.handContainsTroopCard(this.newEmptyGame.players[this.playerWithTurn], cardToPlay));
        });

        it('Cant play a card that is not in your hand', ()=>{
            let cardNotInHand = this.newEmptyGame.troopDeck[0];
            assert.equal(false,this.newEmptyGame.playTroop(this.playerWithTurn, cardNotInHand, 0));
        });


        it('playTroop Work as intended', ()=>{
            let cardToPlay = this.newEmptyGame.players[this.playerWithTurn][Game.generateRandom(this.newEmptyGame.players[this.playerWithTurn].length)];
            let expectedLength = this.newEmptyGame.players[this.playerWithTurn].length -1;
            assert(this.newEmptyGame.playTroop(this.playerWithTurn, cardToPlay, 8));
            assert.equal(expectedLength, this.newEmptyGame.players[this.playerWithTurn].length);
            assert.equal(Game.drawStatus, this.newEmptyGame.turn.turnStatus);
            assert.equal(this.playerWithTurn, this.newEmptyGame.turn.player);
        });
    });


    describe('Checking claim(playerID, flagNumber)',()=>{
        it('claim(playerID, flagnumber) works as intended',()=>{
            let preparedGame = new Game("Marcos", "Ana");
            preparedGame.newGame();
            let playerWhoStart = preparedGame.turn.player;
            let theOtherPlayer = preparedGame.getOtherPlayerID(playerWhoStart);
            //Player 1 plays a Wedge
            preparedGame.players[playerWhoStart] = [
                new Card(5,Card.red),
                new Card(6,Card.red),
                new Card(7,Card.red)
            ];
            //Player 2 plays a Phalanx
            preparedGame.players[theOtherPlayer] = [
                new Card(5,Card.purple),
                new Card(5,Card.orange),
                new Card(5,Card.blue)
            ];
            //p1 play a complete turn: Card 5-red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 0));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart)); //No need to claim. 
            //p2 play a complete turn: Card 5-purple 
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 0));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert.equal(false, preparedGame.claim(theOtherPlayer, 0)); //We could claim, but just once.
            assert.equal(Game.endTurnStatus, preparedGame.turn.turnStatus);
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 6 - red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 0));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 5 - orange
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 0));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 7 - red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 0));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 5 - blue
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 0));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - Play any card and claim sucessfully flag number 1.
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 1));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.claim(playerWhoStart, 0));
            assert.equal(Game.claimStatus, preparedGame.turn.turnStatus); //Can claim again
            assert.equal(false, preparedGame.claim(playerWhoStart, 0)); //Can't clam twice same flag!!
            assert.equal(Game.endTurnStatus, preparedGame.turn.turnStatus); //Turn finish

        });
    });


    describe('Checking endTurn(playerID)',()=>{
        it('It is only possible to endTurn from "claim" and "endTurn" stages',()=>{
            //Play
            assert.equal(false, this.newEmptyGame.endTurn(this.playerWithTurn));
            //Draw
            this.newEmptyGame.turn.turnStatus = Game.drawStatus;
            assert.equal(false, this.newEmptyGame.endTurn(this.playerWithTurn));
            //Claim
            this.newEmptyGame.turn.turnStatus = Game.claimStatus;
            assert(this.newEmptyGame.endTurn(this.playerWithTurn));
            //EndTurn
            this.newEmptyGame.turn.turnStatus = Game.endTurnStatus;
            this.newEmptyGame.turn.player = this.playerWithTurn;
            assert(this.newEmptyGame.endTurn(this.playerWithTurn));
        });

        it('endTurn(playerID) works as intended', ()=>{
            this.newEmptyGame.turnStatus = Game.endTurnStatus;
            this.newEmptyGame.endTurn(this.playerWithTurn);
            this.newEmptyGame.turnStatus = Game.playStatus;
            this.newEmptyGame.players = this.theOtherPlayer;
        });
    });

    describe('Checking whoWonTheGame()',()=>{
        it('Simulate a full prepared game - Win by 3 consecutives flags.',()=>{
            let preparedGame = new Game("Marcos", "Ana");
            preparedGame.newGame();
            let playerWhoStart = preparedGame.turn.player;
            let theOtherPlayer = preparedGame.getOtherPlayerID(playerWhoStart);
            //Player1
            preparedGame.players[playerWhoStart] = [
                new Card(5,Card.red),//Wedge
                new Card(6,Card.red),
                new Card(7,Card.red),
                //flag2
                new Card(3,Card.yellow), //Phalanx
                new Card(3,Card.orange),
                new Card(3,Card.purple),
                //flag3
                new Card(0,Card.red), //Battalion
                new Card(9,Card.red),
                new Card(8,Card.red),

            ];
            //Player
            preparedGame.players[theOtherPlayer] = [
                new Card(5,Card.purple), //Phalanx
                new Card(5,Card.orange),
                new Card(5,Card.blue),
                //flag2
                new Card(1,Card.yellow), //Phalanx - lower than enemy
                new Card(1,Card.orange),
                new Card(1,Card.blue),
                //flag3
                new Card(0,Card.blue), //Host
                new Card(9,Card.orange),
                new Card(8,Card.purple),
            ];
            //p1 play a complete turn: Card 5-red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 0));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart)); //No need to claim. 
            //p2 play a complete turn: Card 5-purple 
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 0));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 6 - red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 0));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 5 - orange
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 0));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 7 - red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 0));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 5 - blue
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 0));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));


            assert.equal(false, preparedGame.whoWonTheGame());
            //SECOND FLAG
            //p1 - 3,Card.yellow
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 1));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.claim(playerWhoStart, 0));
            assert(preparedGame.endTurn(playerWhoStart));
            //PLAYER 1 GETS THE FIRST FLAG
            //p2 1,Card.yellow
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 1));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 3,Card.orange
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 1));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 1,Card.orange
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 1));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 3,Card.orange
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 1));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 1,Card.blue
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 1));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));

            assert.equal(false, preparedGame.whoWonTheGame());
            
            //THIRD FLAG
            //p1 - 0,Card.red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 2));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.claim(playerWhoStart, 1));
            assert(preparedGame.endTurn(playerWhoStart));
            //PLAYER 1 GETS THE SECOND FLAG
            //p2 0,Card.blue
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 2));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert.equal(false, preparedGame.claim(theOtherPlayer, 0)); //We could claim, but just once.
            assert.equal(Game.endTurnStatus, preparedGame.turn.turnStatus);
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 9,Card.red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 2));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 9,Card.orange
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 2));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));
            //p1 - 8,Card.red
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 2));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.endTurn(playerWhoStart));
            //p2 - 8,Card.purple
            assert(preparedGame.playTroop(theOtherPlayer, preparedGame.players[theOtherPlayer][0], 2));
            assert(preparedGame.drawTroopCard(theOtherPlayer));
            assert(preparedGame.endTurn(theOtherPlayer));


            //END RESULT:
            assert.equal(false, preparedGame.whoWonTheGame()); //Still last one not claimed
            assert(preparedGame.playTroop(playerWhoStart, preparedGame.players[playerWhoStart][0], 3));
            assert(preparedGame.drawTroopCard(playerWhoStart));
            assert(preparedGame.claim(playerWhoStart, 2));
            
            //Once claimed, we have a winner
            assert.equal(playerWhoStart, preparedGame.whoWonTheGame());

        });
    });


});