'use strict';

var assert = require('assert');
let Plays = require('../plays');
let Card = require('../card');


describe('Testing Class Plays', ()=> {
    before(()=>{
        this.hand5_3_6_same = [
            new Card(5,Card.red),
            new Card(3,Card.red),
            new Card(6,Card.red)
        ];

        this.hand3_1_2_diferent = [
            new Card(3,Card.red),
            new Card(1,Card.blue),
            new Card(2,Card.red)
        ];
    });

    describe('Checking Plays.isConsecutive()',()=>{
        it('Hand cards arent consecutive', ()=> {
            assert.equal(false, Plays.isConsecutive(this.hand5_3_6_same));
        });

        it('Example of consecutive cards',()=>{
            assert.equal(true, Plays.isConsecutive(this.hand3_1_2_diferent));
        })

    })
    
    
    describe('Checking Plays.isSameColor()',()=>{
        it('Hand cards have the same color',()=>{
            assert.equal(true,Plays.isSameColor(this.hand5_3_6_same))
        });

        it('Hand cards different color',()=>{
            assert.equal(false,Plays.isSameColor(this.hand3_1_2_diferent))
        });
    });
    

    

});