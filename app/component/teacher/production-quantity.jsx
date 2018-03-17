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
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
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
  
class ProductionQuantity extends React.Component {  
  constructor(props){
      super(props);
      var database = this.props.database;
      var roomNum = this.props.roomNum;
      let that = this;
      this.state = {
        display: false
      }
      this.quantityPerCompany = []
      this.quantityStack = []
      database.database().ref(roomNum).child('on').child('roomInfo').once('value').then(function(data){
        that.setState({
          roomInfo: data.val()
        },
        //set anonymous function for setState callback, use the roomInfo to search final rounds quntity
        function(){
          database.database().ref(roomNum).child('on').child('round').once('value').then(function(data){
            var roundInfo = data.val()
            let roomInfo = that.state.roomInfo;
            for(var i = 1; i <=parseInt(roomInfo.firmNum); i++){
              that.quantityPerCompany[i-1] = {
                name: 'Firm'+i,
                quantity: parseFloat(roundInfo['round'+roundInfo.currentRound][i].quantityProduction)
              }
              that.quantityStack[i-1] = {
                name: 'Firm'+i,
              }
            }
            for(var u = 1; u <= parseInt(roundInfo.currentRound); u++){
              for(var k = 1; k <= parseInt(roomInfo.firmNum); k++){
                that.quantityStack[k-1][u] = parseFloat(roundInfo['round'+u][k].quantityProduction)
              }
            }
            console.log(that.quantityStack)
            // after graping the information setState to reveal the data
            that.setState({
              roundInfo: data.val(),
              display:true
            })
          })
        })
      }) 
  }
  renderQuantity(){
    var {classes} = this.props
    let roomInfo = this.state.roomInfo;
    var renderDOM = []
    for(var i = 1; i <=parseInt(roomInfo.firmNum); i++){
      var quantity = this.quantityPerCompany[i-1].quantity
      renderDOM.push(
        <Grid item><Paper className={classes.root} elevation={4}>
        <Typography type="headline" component="h3">
        Firm {i} Quantity
        </Typography>
        <Typography component="p">
        {quantity}
        </Typography>
      </Paper></Grid>
      )
    }
    return renderDOM
  }
  renderBarLineChart(){
    let roundInfo = this.state.roundInfo;
    var renderDOM = []
    let colorPlate = ['#BBDEFB','#FFEB3B','#FF7744','#FFAA33','#FFCC22','#FFFF33','#CCFF33','#99FF33']
    for(var i = 1; i <= parseInt(roundInfo.currentRound); i++){
      if(i == parseInt(roundInfo.currentRound)){
        renderDOM.push(<Bar barsize = {10} dataKey={i} stackId="a" fill={colorPlate[1]} />)
      }else{
        renderDOM.push(<Bar barsize = {10} dataKey={i} stackId="a" fill={colorPlate[0]} />)
      }
    }
    return renderDOM
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
                {this.renderQuantity.bind(this)()}
            <Grid item xs = {12}>
            <BarChart width={1000} height={300} data={this.quantityStack} maxBarSize = {35}
                  margin={{top: 20, right: 30, left: 20, bottom: 5}} layout="vertical">
            <XAxis type="number"/>
            <YAxis type="category" dataKey="name"/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            {this.renderBarLineChart.bind(this)()}
            </BarChart>
            </Grid>
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
ProductionQuantity.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProductionQuantity)