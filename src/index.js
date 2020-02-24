import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppC3 from './AppC3';
import AppK2 from './AppK2';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<AppK2 />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
