'use strict';

var assert = require('assert');
let Play = require('../play');
let Card = require('../card');


describe('Testing Play class', ()=> {
    before(()=>{
        this.hand5_3_6_same = [
            new Card(5,Card.red),
            new Card(3,Card.red),
            new Card(6,Card.red)
        ];
        this.hand5_3_6_different = [
            new Card(5,Card.red),
            new Card(3,Card.blue),
            new Card(6,Card.green)
        ];
        this.hand3_1_2_diferent = [
            new Card(3,Card.red),
            new Card(1,Card.blue),
            new Card(2,Card.red)
        ];
        this.hand7_7_7_diferent = [
            new Card(7,Card.orange),
            new Card(7,Card.blue),
            new Card(7,Card.blue)
        ];

        //Hand types:
        this.wedge = [
            new Card(2,Card.blue),
            new Card(0,Card.blue),
            new Card(1,Card.blue)
        ];
        this.phalanx = [
            new Card(1,Card.red),
            new Card(1,Card.red),
            new Card(1,Card.red)
        ];
        this.battalion = [
            new Card(5,Card.red),
            new Card(1,Card.red),
            new Card(9,Card.red)
        ];
        this.skirmush = [
            new Card(9,Card.red),
            new Card(8,Card.purple),
            new Card(7,Card.red)
        ];
        this.host = [
            new Card(1,Card.yellow),
            new Card(5,Card.red),
            new Card(3,Card.purple)
        ];



    });

    describe('Checking Plays.isConsecutive()',()=>{
        it('Hand cards arent consecutive', ()=> {
            assert.equal(false, Play.isConsecutive(this.hand5_3_6_same));
        });

        it('Example of consecutive cards',()=>{
            assert.equal(true, Play.isConsecutive(this.hand3_1_2_diferent));
        })

    })
    
    describe('Checking Plays.isSameColor()',()=>{
        it('Hand cards have the same color',()=>{
            assert.equal(true,Play.isSameColor(this.hand5_3_6_same));
        });

        it('Hand cards different color',()=>{
            assert.equal(false,Play.isSameColor(this.hand3_1_2_diferent));
        });
    });

    describe('Checking Plays.isSameValues()',()=>{
        it('Hand cards dont the same value',()=>{
            assert.equal(false,Play.isSameValues(this.hand5_3_6_same));
        });

        it('Hand: All the cards have the same value',()=>{
            assert.equal(true,Play.isSameValues(this.hand7_7_7_diferent));
        });
    });

    describe('Checking Plays.getScore()',()=>{
        it('First hand',()=>{
            assert.equal(14,Play.getScore(this.hand5_3_6_same));
        });

        it('Second hand',()=>{
            assert.equal(6,Play.getScore(this.hand3_1_2_diferent));
        });
    });
    
    describe('Checking Plays.getTypeHand()',()=>{
        it('Checking a Wedge',()=>{
            assert.equal(Play.Wedge, Play.getTypeHand(this.wedge));
        });

        it('Checking a Phalanx',()=>{
            assert.equal(Play.Phalanx, Play.getTypeHand(this.phalanx));
        });

        it('Checking a Battalion',()=>{
            assert.equal(Play.Battalion, Play.getTypeHand(this.battalion));
        });

        it('Checking a Skirmush',()=>{
            assert.equal(Play.Skirmush, Play.getTypeHand(this.skirmush));
        });

        it('Checking a Host',()=>{
            assert.equal(Play.Host, Play.getTypeHand(this.host));
        });

    });

    describe('Checking Plays.isBetterHand(hand1, hand2)',()=>{
        it('Wedge vs Phalanx',()=>{
            assert(Play.isBetterHand(this.wedge, this.phalanx) > 0);
        });
        
        it('Asserting two hosts. Second one is better', ()=>{
            assert(Play.isBetterHand(this.host, this.hand5_3_6_different) < 0);
        });

        it('Asserting two equally powerful hands', ()=>{
            assert(Play.isBetterHand(this.host, this.host) === 0);
        });
    });
    

});