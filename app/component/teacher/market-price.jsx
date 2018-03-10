import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Card, { CardContent } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Paper from 'material-ui/Paper';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2,

    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    column: {
    flexBasis: '33.33%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
  });
  
class MarketPrice extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.state = {
        display: false
      }
      var database = this.props.database;
      var roomNum = this.props.roomNum;
      this.pricePerRound = []
      database.database().ref(roomNum).child('on').child('round').once('value').then(function(data){
        that.setState({
          roundInfo: data.val()
        },function(){
          let roundInfo = that.state.roundInfo;
          for(var i = 1; i <= roundInfo.currentRound; i ++){
            that.pricePerRound[i-1] = {
              name: 'round'+i,
              price: roundInfo['round'+i].price
            }
          }
          that.setState({
            display:true
          })
        })
      })
  }
  render() { 
    const { classes } = this.props;
    if(this.state.display){
      return (
            
        <Grid item xs = {10}>
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Graph</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails> 
            <Grid spacing = {16}  justify="flex-start" container>
              <Grid item>
                   <Paper className={classes.root} elevation={4}>
                        <Typography type="headline" component="h3">
                        Price
                        </Typography>
                        <Typography component="p">
                        {this.pricePerRound[this.state.roundInfo.currentRound-1].price}
                        </Typography>
              </Paper></Grid>
              <Grid item xs = {12}> 
              <LineChart width={1000} height={300} data={this.pricePerRound}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
              </Grid>
              </Grid>
            </ExpansionPanelDetails>      
        </ExpansionPanel>
        </Grid>
      )
    }else{
      return(
        <Grid item xs = {10}>
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Graph</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails> 
              Please Wait
            </ExpansionPanelDetails>      
        </ExpansionPanel>
        </Grid>
      )
    }
    
  }
}
MarketPrice.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(MarketPrice)