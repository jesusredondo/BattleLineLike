'use strict'

const WebSocket = require('ws');

console.log('Starting up the server...');
const wss = new WebSocket.Server({port:8081})

//When connection is open...
wss.on('connection', (ws)=>{
    console.log('New client...'); //DEBUG
    //And there is a message for one client...
    ws.on('message', (data) =>{
        wss.clients.forEach( (client)=>{ //Broadcast that message.
            if (client.readyState === WebSocket.OPEN){
                client.send(data);
            }
        })
    })

    ws.on('close',(event)=>{
        console.log('Client Logged-out'); //DEBUG
    });
});

