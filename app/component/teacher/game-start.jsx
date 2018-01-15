import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import ApplicationBar from '../AppBar'
import { CircularProgress } from 'material-ui/Progress';
import DisplayTable from '../display-table';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

const styles = theme => ({
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  root: theme.mixins.gutters({
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    }),
  console: theme.mixins.gutters({
        display: 'flex',
        justifyContent: 'right',
        flexWrap: 'wrap',
        height: '40%',
        overflowY: 'auto',
    }),
  chip: {
    margin: theme.spacing.unit,
  }
});
  
class TeacherGameStart extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.state = {
          startInfo: null,
          message:[]
      }
      this.roomNum = this.props.match.params.id;
      this.database = this.props.database;
      this.socket = this.props.socket;
      this.database.database().ref(this.roomNum).child('on').once('value').then(function(data){
          that.setState({
              startInfo: data.val()
          })
      })
      this.database.database().ref(this.roomNum).child('on').child('console').on('child_added', function(data){
          that.setState({
              message: [...that.state.message, data.val()]
          })
      })
      this.socket.on('CONNECT_TO_ROOM', function(data) {
            var messageData = {
                message: 'Group '+data.groupNum+' joined Room.'+data.roomNum,
                time: new Date().toLocaleString('en-GB', {timeZone:'Asia/Hong_Kong'})
            }
            that.addMessageToDatabase(messageData); 
        });
      this.socket.emit('GAME_SETTING',  {roomNum: this.roomNum});
  }
  addMessageToDatabase(message){
      this.database.database().ref(this.roomNum).child('on').child('console').push().set(message)
  }
  render() { 
    const { classes } = this.props;
    if(!this.state.startInfo || !this.state.message){
        return <div><CircularProgress className={classes.progress} size={50} /></div>
    }else{
        console.log(this.state.startInfo)
        return (
            <div>
            <ApplicationBar type = 'teacher_gamestart'/>
            <Grid container 
            alignItems = 'center'
            justify = 'center'
            height = '100%'
            direction = 'row'>
            <Grid item xs={10}>
                <FormControlLabel
                control={
                    <Switch
                    checked={this.state.display_table}
                    onChange={(event, checked) => this.setState({ display_table: checked })}
                    />
                }
                label="Display Table"
                />            
                {this.state.display_table && 
                    <Paper className = { classes.root } elevation = { 4 } height = '100%'>
                        <DisplayTable info = {this.state.startInfo} numberOfCompany = {this.state.startInfo.roomInfo.firmNum}/>
                    </Paper>
                }
                
                
                
            </Grid>

            <Grid item xs={10}>
            <Paper className = { classes.console } elevation = { 4 } height = '100%'>
                  <List>
                  <ListItem >
                    <Typography color = "secondary" type="title" component="h2"  > Console </Typography>
                  </ListItem>
                  {
                      this.state.message &&
                      this.state.message.map(function(data){
                          console.log(data);
                          return <ListItem >
                                    <Chip label={data.time} className={classes.chip} /> <Typography style={{margin: 'auto'}} type = 'body1'>{data.message}</Typography>
                                </ListItem>
                      })
                  }
                </List>
            </Paper>
            </Grid>

            </Grid>

            </div>
        )
    }
  }
}
TeacherGameStart.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TeacherGameStart)