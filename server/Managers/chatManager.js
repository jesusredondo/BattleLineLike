module.exports = class ChatManager{
    constructor(p1Ws, p2Ws){
        //this.p1Name = p1Name;
        this.p1Ws = p1Ws;
        //this. p2Name = p2Name;
        this.p2Ws = p2Ws;
        this.ws2 = [p1Ws, p2Ws]//The connections of both players
    }

    chatMessage(message){
        this.ws2.forEach(
            (ws)=>{
                ws.send(message.text);
            }
        );
    }


}