let assert = require('assert');
const Config = require('../../sharedEntities/configuration');



describe('Setting up connection:', () => {

    //SETTING UP THE CONNECTION
    //There must recieve the server confirmation.
    describe('Connection to Server',() => {
        it('Send a user login -> recieve a response', ()=>{

            
            //TODO:
            /*
            const server = new WebSocket('ws://localhost:'+Config.PORT);
            server.onmessage = (event)=>{
                message = event.data;
                assert.equal(message.)
            }
*/

            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});