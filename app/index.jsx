import firebase from 'firebase'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import config from './credential/key'
firebase.initializeApp(config);
ReactDOM.render( <App /> , document.getElementById('app'));
