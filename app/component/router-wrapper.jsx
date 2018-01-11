import React from 'react';  
import { Switch, Route } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import GameSetting from './profile_setting/game-setting'
import Home from './Home'
import io from "socket.io-client";
class RouterWrapper extends React.Component {  
  constructor(props){
      super(props);
      this.socket = io('http://7a5888b1.ngrok.io');
  }
  render() { 
    return (
            <Switch>
                <Route exact path="/" render={props =><Home socket = {this.socket} {...props} />}/>
                <Route path='/game_setting/:id' render={props =><GameSetting socket = {this.socket} {...props} />}/>
            </Switch>
    )
  }
}

export default RouterWrapper