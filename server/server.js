'use strict'

const WebSocket = require('ws');

const wss = WebSocket.Server({port:8081})


wss.on('connection', (ws)=>{
   
    ws.on('message', (data) =>{
        wss.clients.forEach
    })
});