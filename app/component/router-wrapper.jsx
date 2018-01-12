import React from 'react';  
import { Switch, Route } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import GameSetting from './profile_setting/game-setting'
import Home from './Home'
import io from "socket.io-client";
import firebase from 'firebase'
import config from '../credential/key'
class RouterWrapper extends React.Component {  
  constructor(props){
      super(props);
      this.socket = io('http://b26ab59f.ngrok.io');
      this.database = firebase.initializeApp(config,'database')
  }
  
  render() { 
    return (
            <Switch>
                <Route exact path="/" render={props =><Home socket = {this.socket} database = {this.database} {...props} />}/>
                <Route path='/game_setting/:id' render={props =><GameSetting socket = {this.socket} database = {this.database}{...props} />}/>
            </Switch>
    )
  }
}

export default RouterWrapper