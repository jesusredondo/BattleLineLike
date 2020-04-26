import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './showMessages.scss';   



class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fade: 'faded'
        };
    }


    componentDidMount(){
    setTimeout(()=>{
        this.props.renderingComponent.remove();
    }, 50000);
        
        
    }

    render() { 
        return ( 
            <div className={"show-message show-message--"+this.props.kind+" "+this.state.fade}>
                {this.props.message}
                </div>
         );
    }
}
 


function showMessage(message, kind){
    let mainContainer = document.querySelector('#mainContainer');
    let messageInDOM = document.createElement("div");
    mainContainer.appendChild(messageInDOM);
    ReactDOM.render( <Message message={message} renderingComponent={messageInDOM} kind={kind}></Message>, messageInDOM);

}


export default showMessage;

