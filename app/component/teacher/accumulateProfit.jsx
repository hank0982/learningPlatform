import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Card, { CardContent } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

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
  
class AccumProfit extends React.Component {  
  constructor(props){
      super(props);
      var database = this.props.database;
      var roomNum = this.props.roomNum;
      let that = this;
      this.state = {
        display: false
      }
      this.data = [];
      database.database().ref(roomNum).child('on').child('round').once('value').then(function(data){
          var roundInfo = data.val();
          database.database().ref(roomNum).child('on').child('roomInfo').once('value').then(function(snap){
            var roomInfo = snap.val();
            for(var g = 1; g <= parseInt(roomInfo.firmNum); g++){
                that.data[g-1] = 0
            }
            for(var i = 1; i <= roundInfo.currentRound;i++){
                for(var u = 1; u <= parseInt(roomInfo.firmNum); u++){
                    that.data[u-1] = roundInfo['round'+i][u].profit + that.data[u-1]
                }
            }
            that.setState({
                display:true
            })
          })
          
      })
  }
  renderBarChart() {
    return <BarChart width={600} height={300} data={this.data} maxBarSize = {35}
    margin={{top: 20, right: 30, left: 20, bottom: 5}} layout="vertical">
        <XAxis type="number"/>
        <YAxis type="category" dataKey="name"/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Bar barsize = {10} dataKey={i} stackId="a" fill={colorPlate[i%(colorPlate.length)]} />
        </BarChart>
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
           {
               this.data.map(function(ele, i){
                   return <Grid item>
                   <Paper className={classes.root} elevation={4}>
                        <Typography type="headline" component="h3">
                        {'Firm '+i}
                        </Typography>
                        <Typography component="p">
                        {ele}
                        </Typography>
                    </Paper></Grid>
               })
           }
           {this.renderBarChart()}
           </Grid>
            </ExpansionPanelDetails>
            
        </ExpansionPanel>
        </Grid>
      )
    }else{ 
      return (  
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
AccumProfit.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(AccumProfit)