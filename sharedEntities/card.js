'use strict'

class Card {
    
    constructor(value, color){
        this.value = value;
        this.color = color;
    }

    toString(){
        return `[${this.value}-${Card.colorNames[this.color]}]`
    }

    isSameCardAs(card){
        return this.value === card.value && this.color === card.color;
    }


}

//Static vars
Card.red = 0;
Card.green = 1;
Card.blue = 2;
Card.yellow = 3;
Card.purple = 4;
Card.orange = 5;
Card.colorNames =['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
Card.numberOfColors = 6;

Card.names = [
    'Skirmishers',
    'Peltasts',
    'Javalineers',
    'Hoplites',
    'Phalangists',
    'Hypaspists',
    'Light Cavary',
    'Heavy Cavary',
    'Chariots',
    'Elephants'
];
Card.numberOfValues = 10;

module.exports = Card;