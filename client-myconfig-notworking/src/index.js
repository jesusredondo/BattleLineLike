import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './js/app';
//import * as serviceWorker from './serviceWorker'; //TODO: review why this doen't work, maybe: https://webpack.js.org/loaders/worker-loader/

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister(); //TODO review this aswell.
