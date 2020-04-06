'use strict';

import '../css/base-css.css'
//import {Card} from "../../sharedEntities/Card"


//Elements:
let sendButton = document.querySelector('#bSend');
let textToRead = document.querySelector('#textToRead');
let textToSend = document.querySelector('#textToSend');

//Connection:
let server = new WebSocket("ws://localhost:8081/")
server.onopen = (event) =>{
    console.log('Established connection');
};

server.onerror = (event) => {
    alert('Error observed '+event);
}

server.onmessage = (event) =>{
    textToRead.innerHTML += event.data+'\n';
}




//Sending messages:
sendButton.addEventListener('click',(evt)=>{
    console.log(textToSend.value);
    if(textToSend.value==''){
        return;
    }

    server.send(textToSend.value);
    textToSend.value = '';
    textToSend.focus();

});
