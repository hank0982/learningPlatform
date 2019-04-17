import React from 'react';  
import { Switch, Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import GameSetting from './teacher/game-setting'
import Game from './student/game';
import TeacherGameStart from './teacher/game-start';
import Home from './Home';
import About from './about/about';
import io from "socket.io-client";
import firebase from 'firebase';
import config from '../credential/key';

class RouterWrapper extends React.Component {  
  constructor(props){
      super(props);
		this.socket = io('http://localhost:8080');
      this.database = firebase.initializeApp(config,'database')
      this.state = { windowWidth: 0, windowHeight: 0, socket: this.socket, database: this.database};
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    console.log(this.state)
  }
  render() { 
    return (
            <Switch>
                <Route exact path="/" render={props =><Home {...this.state} {...props} />}/>
                <Route path = '/teacher_gamestart/:id' render = {props => <TeacherGameStart {...this.state} {...props}/>}/>
                <Route path='/game_setting/:id' render={props =><GameSetting {...this.state} {...props} />}/>
                <Route path='/student_game/:id' render = {props => <Game {...this.state} {...props}/>}/>
                <Route path='/abouttt' render = {props => <About {...props}/>}/>
            </Switch>
    )
  }
}

export default RouterWrapper
