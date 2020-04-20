import React from 'react';
import './App.scss';
import FlagComp from './components/FlagComp/FlagComp'
import TroopDeckComp from './components/troopDeckComp/TroopDeck';
import HandPlayerComp from './components/handPlayerComp/HandPlayerComp';
import Game from './sharedEntities/game';
import showMessage from './components/utilitiesFunc/showMessages';
import GameStatusComp from './components/gameStatusComp/GameStatusComp';




/**
 * TOOLS TO USE FOR ENHANCING THE GAME:
 * https://aiartists.org/ai-generated-art-tools
 * - Cards images: http://goart.fotor.com/
 * - Backgrounds: https://aiartists.org/ai-generated-art-tools
 */

class App extends React.Component {

    constructor(props) {
        super(props);

        this.player1ID = "Jesús";
        this.player2ID = "Ana"

        this.game = new Game("Jesús", "Ana");
        this.game.newGame();

        this.state = {
            p1ID : this.player1ID,
            p2ID : this.player2ID,
            hands : {
                [this.player1ID] : this.game.players[this.player1ID].slice(), //Make a copy because online we can't use it directly.
                [this.player2ID] : this.game.players[this.player2ID].slice()
            },

            //Selection:
            selectedCard : null,
            whoSelectedCard : null,

            //Flags:
            flags: new Array(9).fill().map((e, pos) => {
                return {
                    taken: false,
                    position: pos,
                    sides : {
                        [this.player1ID] : [],
                        [this.player2ID] : []
                    }
                }
            }),

            //Turn and kind of action:
            turnID: this.game.turn.player,
            currentAction: this.game.turn.turnStatus


            
        }
      

        //Bindings:
        this.handleSelectedCard = this.handleSelectedCard.bind(this);
        this.handleClickFlag = this.handleClickFlag.bind(this);
        this.handleTroopDraw = this.handleTroopDraw.bind(this);
        this.handleClaimFlag = this.handleClaimFlag.bind(this);
        this.handleEndTurn = this.handleEndTurn.bind(this);
    }


   

    setNewGame(){
        this.game.newGame();
        this.setState({
            //New Cards in hand
            hands:{
                [this.state.p1ID] :this.game.players[this.state.p1ID].slice(),
                [this.state.p2ID] :this.game.players[this.state.p2ID].slice()
            },
            //Flags empty
            flags: new Array(9).fill().map((e, pos) => {
                return {
                    taken: false,
                    position: pos,
                    sides : {
                        [this.player1ID] : [],
                        [this.player2ID] : []
                    }
                }
            }),
            //Player and action:
            turnID: this.game.turn.player,
            currentAction: this.game.turn.turnStatus
        })
    }

    handleReset(){
        showMessage('New game!!', 'green');
        this.setNewGame();
    }

    handleSelectedCard(card, pID){
        this.setState({selectedCard: card});
        this.setState({whoSelectedCard: pID});
    }

    
    handleClickFlag(position){
        if((!this.state.selectedCard) || (!this.state.whoSelectedCard)){
            return;
        }

        if(this.game.playTroop(this.state.whoSelectedCard, this.state.selectedCard, position)){
            //Modify the state of the flag to add the card in the site.
            let flagsCopy = this.state.flags;
            flagsCopy[position].sides[this.state.whoSelectedCard].push(this.state.selectedCard);
            this.setState({
                flags: flagsCopy
            });
            //remove used card from player's hand. 
            let handState = this.state.hands;
            handState[this.state.whoSelectedCard] = this.state.hands[this.state.whoSelectedCard].filter(
                card => !card.isSameCardAs(this.state.selectedCard)
                );
            this.setState({
                hands : handState
            });
            //Next action is Drawing:
            this.setState({
                currentAction : Game.drawStatus
            })

        } else{
            showMessage("You can't make that play","red");//TODO: Better messages, probably should be handled by the game itself, instead if returning false.
        }
        //Nothing selected.
        this.setState({
            whoSelectedCard: null,
            selectedCard : null
        });
    }
 

    handleTroopDraw(){
        let drawnCard = this.game.drawTroopCard(this.state.turnID);
        if(drawnCard){ //Effective drawn:
            showMessage("Card Drafted", "green");
            let newHands = this.state.hands;
            newHands[this.state.turnID].push(drawnCard);
            this.setState({
                hands : newHands,
                currentAction : Game.claimStatus
            })
        } else{
            showMessage("You can't make that play","red");//TODO:
        }
    }


    handleClaimFlag(position){
        if(this.game.claim(this.state.turnID, position)){
            showMessage(""+this.state.turnID+" claimed the "+position+"º flag!!!","green");//TODO:
            //Update flags:
            let flagsCopy = this.state.flags;
            flagsCopy[position].taken = true;
            this.setState({
                flags: flagsCopy
            });
        } else{
            showMessage("You can't claim that flag","red");//TODO:
            this.setState({
                currentAction : Game.endTurnStatus
            })
        }
    }


    handleEndTurn(){
        if(this.game.endTurn(this.state.turnID)){
            showMessage("It is the turn of "+this.game.getOtherPlayerID(this.state.turnID), "green");//TODO:
            this.setState({
                turnID : this.game.getOtherPlayerID(this.state.turnID),
                currentAction : Game.playStatus
            })
            
           
        } else{
            showMessage("You can't finish your turn yet","red");//TODO:
            this.setState({
                currentAction : Game.endTurnStatus
            })
        }
    }


    render() {
        return (
            <div id="mainContainer">
                <div id="reset-game-container" onClick={()=>this.handleReset()}>
                    <h2>RESET</h2>
                </div>

                <GameStatusComp turnID={this.state.turnID} currentAction={this.state.currentAction} handleEndTurn={this.handleEndTurn}></GameStatusComp>


                <h1>Battle Line Single Player</h1>

                <HandPlayerComp playerID={this.state.p1ID} hand={this.state.hands[this.state.p1ID]} selectedCard={this.state.selectedCard} handleSelectedCard={this.handleSelectedCard}></HandPlayerComp>

                <div id="centralSpace">
                    <div id="flags">
                        {[0,1,2,3,4,5,6,7,8].map(
                            e=> <FlagComp p1ID={this.state.p1ID} p2ID={this.state.p2ID} flagInfo={this.state.flags[e]} handleClickFlag={this.handleClickFlag} handleClaimFlag={this.handleClaimFlag} key={e} position={e} currentAction={this.state.currentAction} selectedCard={this.state.selectedCard} />
                        )}
                    </div>
                    <div id="deckSpace">
                        <TroopDeckComp handleTroopDraw={this.handleTroopDraw}></TroopDeckComp>
                    </div>
                </div>

                <HandPlayerComp playerID={this.state.p2ID} hand={this.state.hands[this.state.p2ID]} selectedCard={this.state.selectedCard} handleSelectedCard={this.handleSelectedCard}></HandPlayerComp>
                
            </div>
        );
    }
}

export default App;
