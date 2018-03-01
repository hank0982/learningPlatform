import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Tabs, { Tab } from 'material-ui/Tabs';
import ClassIcon from 'material-ui-icons/Class';
import InfoIcon from 'material-ui-icons/Info';
import PersonIcon from 'material-ui-icons/Person';
import Typography from 'material-ui/Typography';
import Introduction from './introduction'
import MarketIntro from './marketIntro'
import PlayerProfile from './playerProfile'
const styles = theme => ({
  root: theme.mixins.gutters({
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    }),
});
class GameTab extends React.Component {
    constructor(props){
        super(props);
        this.state = {
              value: 0
        }
        this.handleChange = this.props.handleChange
    }
    handleChangeInTab = (event, value) =>{
        this.setState({ value });
        this.handleChange(value);
    }
    render(){
        let {value} = this.state;
        return(
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChangeInTab}>
            <Tab label="General Introduction" />
            <Tab label="Market Introduction" />
            <Tab label="Player Profile" />
          </Tabs>
        </AppBar>
        )
    }
}
class Game extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.roomNum = this.props.match.params.id;
      this.database = this.props.database;
      this.socket = this.props.socket;
      this.state = {
          tab: 0
      }
      
      var roomRef = this.database.database().ref(this.roomNum);
      roomRef.child('on').child('roomInfo').once('value').then(function(data){
        that.setState({
            roomInfo: data.val()
        })
      })
      roomRef.child('on').child('round').once('value').then(function(data){
        that.setState({
            roundInfo: data.val()
        })
      })
      roomRef.child('on').child('roomInfo').on('value',function(data){
          that.setState({
              roomInfo: data.val()
          })
      })
      roomRef.child('on').child('round').on('value', function(data){
          that.setState({
              roundInfo: data.val()
          })
      })
      var getGroup = this.socket.on('CONNECT_TO_ROOM', function(data) {
            var messageData = {
                message: 'Group '+data.groupNum+' joined Room.'+data.roomNum,
                time: new Date().toLocaleString('en-GB', {timeZone:'Asia/Hong_Kong'})
            }
            console.log(messageData);
            that.addMessageToDatabase(messageData); 
            that.setState({
                groupNum: data.groupNum
            },function(){
                getGroup.off('CONNECT_TO_ROOM')
            })  
      }); 
  }
  addMessageToDatabase(message){
      this.database.database().ref(this.roomNum).child('on').child('console').push().set(message)
  }
  handleTabChange = (value) => {
     this.setState({ tab: value });
  };
  renderContent(value){
      let {roomInfo, roundInfo, groupNum} = this.state;
      if(value == 0){
          if(roomInfo)
            return <Introduction roomInfo = {roomInfo}/>
      }else if(value == 1){
          if(roundInfo && roomInfo)
            return <MarketIntro roomInfo = {roomInfo} roundInfo = {roundInfo}/>
      }else if(value == 2){
           if(roomInfo && roundInfo && groupNum){
            return <PlayerProfile database = {this.database} roomInfo = {roomInfo} roundInfo = {roundInfo} groupNum = {groupNum}/>
           }
      }
  };
  render() { 
    const { classes } = this.props;
    return (  
            <div>
            <Grid container 
            alignItems = 'center'
            justify = 'center'
            height = '100%'
            direction = 'row'>
            <GameTab handleChange = {this.handleTabChange.bind(this)}/>
            <Grid item xs={10}>
                {
                    this.renderContent.bind(this)(this.state.tab)
                }
            </Grid>
            </Grid>
            </div>
        )
    }
}
Game.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Game)