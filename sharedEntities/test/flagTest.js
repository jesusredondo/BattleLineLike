'use strict';

var assert = require('assert');
let Flag = require('../flag');
let Card = require('../card');

describe('Testing Flag class', ()=> {
    beforeEach(()=>{
        this.newBoardStringIDS = new Flag("Jesus","Pepe", 0);
    });

    describe('Checking Flag constructor',()=>{
        it('Empty board has two IDs and no card in any side',()=>{
            assert.equal(0,this.newBoardStringIDS.sides["Jesus"].length);
            assert.equal(0,this.newBoardStringIDS.sides["Pepe"].length);
        });
    });

    describe('Checking #getOtherPlayerotherPlayerID(playerID)',()=>{
        it('New board, String IDS', ()=> {
            assert.equal("Jesus",this.newBoardStringIDS.getOtherPlayerID("Pepe"));
            assert.equal("Pepe",this.newBoardStringIDS.getOtherPlayerID("Jesus"));
        });
    })

    describe('Checking #play(card)',()=>{
        it('Adding a simple card to one side',()=>{
            assert(this.newBoardStringIDS.play("Jesus",new Card(3,Card.red)));
            assert.equal(
                JSON.stringify([new Card(3,Card.red)]),
                JSON.stringify(this.newBoardStringIDS.sides["Jesus"])
            );
            assert.equal(0,this.newBoardStringIDS.sides["Pepe"].length);
        });

        it('Adding three cards, one side then another',()=>{
            const card1 = new Card(3, Card.red);
            const card2 = new Card(6, Card.purple);
            const card3 = new Card(0, Card.green);
            assert(this.newBoardStringIDS.play("Jesus",card1));
            assert(this.newBoardStringIDS.play("Pepe",card2));
            assert(this.newBoardStringIDS.play("Jesus",card3));
            assert.equal(
                JSON.stringify([card1,card3]),
                JSON.stringify(this.newBoardStringIDS.sides["Jesus"])
            );
            assert.equal(
                JSON.stringify([card2]),
                JSON.stringify(this.newBoardStringIDS.sides["Pepe"])
            );
        })

        it('Cant add more cards to an already full side',()=>{
            const card1 = new Card(3, Card.red);
            const card2 = new Card(6, Card.purple);
            const card3 = new Card(0, Card.green);
            const card4 = new Card(7, Card.yellow);
            assert(this.newBoardStringIDS.play("Jesus",card1));
            assert(this.newBoardStringIDS.play("Jesus",card2));
            assert(this.newBoardStringIDS.play("Jesus",card3));
            assert.equal(false, this.newBoardStringIDS.play("Jesus",card4));
        });
    });


    describe('Checking #claim(playerID)',()=>{
        it('Cant claim an empty Flag',()=>{
            assert.equal(false, this.newBoardStringIDS.claim("Jesus"));
            assert.equal(false, this.newBoardStringIDS.claim("Pepe"));
        });

        it('Cant claim an only half full Flag //TODO: this should be reworked',()=>{ //TODO
            const card1 = new Card(3, Card.red);
            const card2 = new Card(6, Card.purple);
            const card3 = new Card(4, Card.red);
            const card4 = new Card(7, Card.yellow);
            const card5 = new Card(5, Card.red);
            this.newBoardStringIDS.play("Jesus",card1);
            this.newBoardStringIDS.play("Pepe",card2);
            this.newBoardStringIDS.play("Jesus",card3);
            this.newBoardStringIDS.play("Pepe",card4);
            this.newBoardStringIDS.play("Jesus",card5);
            assert.equal(false, this.newBoardStringIDS.claim("Jesus"));
            assert.equal(false, this.newBoardStringIDS.claim("Pepe"));
        });


        it('Can claim when full and better hand. Cant claim, already taken flags.//TODO: this should be reworked',()=>{ //TODO
            //Player 1 has a wedge.
            const p1_c1 = new Card(7, Card.red);
            const p1_c2 = new Card(6, Card.red);
            const p1_c3 = new Card(8, Card.red);
            this.newBoardStringIDS.play("Jesus",p1_c1);
            this.newBoardStringIDS.play("Jesus",p1_c2);
            this.newBoardStringIDS.play("Jesus",p1_c3);
            //Player 2 has a Battalion
            const p2_c1 = new Card(3, Card.red);
            const p2_c2 = new Card(4, Card.red);
            const p2_c3 = new Card(0, Card.red);
            this.newBoardStringIDS.play("Pepe",p2_c1);
            this.newBoardStringIDS.play("Pepe",p2_c2);
            this.newBoardStringIDS.play("Pepe",p2_c3);
            assert(this.newBoardStringIDS.claim("Jesus"));
            assert.equal(false, this.newBoardStringIDS.claim("Jesus")); //Cant take twice!
            assert.equal(false, this.newBoardStringIDS.claim("Pepe"));
            
        });

    });


});