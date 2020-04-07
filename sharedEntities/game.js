'use strict';
const Card = require('./card');


/**
 * Right now there are no tactics cards, only troops.
 */
module.exports = class Game{

    constructor(){
        this.isP1Turn = false;
        this.troopDeck = [];
        this.flags = []; //array of Flags. 
        //Each Flag is nothing but 2 arrays (one for each player) where the cards are played.
        // If the flag is taken "isTakenByP1" change from "null" to "true" or "false".
        this.P1Hand = [];
        this.P2Hand = [];
    }


    newGame(){
        this.isP1Turn = Math.random() > 0,5;
        
        for(let i = 0; i < 60; i++){
           this.troopDeck.push(new Card(i%10,i/10)); 
        }
        
        this.flags = new Array(9).fill({
            
        })


    }




}