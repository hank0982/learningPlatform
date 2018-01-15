import React from 'react';  
import { Switch, Route } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import GameSetting from './teacher/game-setting'
import TeacherGameStart from './teacher/game-start'
import Home from './Home'
import io from "socket.io-client";
import firebase from 'firebase'
import config from '../credential/key'
class RouterWrapper extends React.Component {  
  constructor(props){
      super(props);
      this.socket = io('http://4fcd3b3e.ngrok.io');
      this.database = firebase.initializeApp(config,'database')
  }
  
  render() { 
    return (
            <Switch>
                <Route exact path="/" render={props =><Home socket = {this.socket} database = {this.database} {...props} />}/>
                <Route path = '/teacher_gamestart/:id' render = {props => <TeacherGameStart socket = {this.socket} database = {this.database} {...props}/>}/>
                <Route path='/game_setting/:id' render={props =><GameSetting socket = {this.socket} database = {this.database}{...props} />}/>
            </Switch>
    )
  }
}

export default RouterWrapper