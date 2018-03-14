import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import MarketPrice from './market-price';
import ProductionQuantity from './production-quantity';
import { querystring } from '@firebase/util';
import Button from 'material-ui/Button';
import Profit from './profit';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AccumProfit from './accumulateProfit';
import FirmPerform from './firm-performance';
import DisplayTable from '../display-table';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
  } from 'material-ui/ExpansionPanel';
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    fullWidthButton: theme.mixins.gutters({
        marginTop: theme.spacing.unit,
        width: '100%',
        margin: theme.spacing.unit,
    }),
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
  
class EndSession extends React.Component {  
  constructor(props){
      super(props);
      this.roomNum = this.props.roomNum;
      this.database = this.props.database;
      this.state = {
          firmPerform: false
      }
      let that = this;
      this.toggleFirmPerform = this.toggleFirmPerform.bind(this);
      this.database.database().ref(this.roomNum).child('on').once('value').then(function(data){
        that.setState({
            startInfo: data.val()
        })
        that.setState({
            display: true
        })
      })
  }
  nextRound(ev){
    let that = this;
    ev.preventDefault();
    this.database.database().ref(this.roomNum).child('on').child('round').child('currentRound').once('value').then(function(data){
        that.database.database().ref(that.roomNum).child('on').child('round').child('currentRound').set(data.val()+1);
        that.database.database().ref(that.roomNum).child('on').child('round').child('endSession').set(false)
    })
  }
  toggleFirmPerform(ev){
    ev.preventDefault();
    let that = this;    
    this.setState({
        firmPerform: !that.state.firmPerform
    })
  }
  render() { 
    const { classes } = this.props;
    var {firmPerform} = this.state
    if(!firmPerform){
        return (
            <Grid container alignItems = 'center' justify = 'center' direction = 'row'>
                <Button style = {{height: '5%',}} size="large" raised color="accent" className={classes.fullWidthButton} onClick = {this.toggleFirmPerform} type="button">
                Market Result
                </Button>
                <Grid item xs = {10} style={{marginTop:10}}>
                    <Typography type="headline" gutterBottom>Market Price</Typography>
                </Grid> 
                <MarketPrice roomNum = {this.roomNum} database = {this.database}/>
                <Grid item xs = {10} style={{marginTop:10}}>
                    <Typography type="headline" gutterBottom>Each Firm's Output</Typography>
                </Grid> 
                <ProductionQuantity roomNum = {this.roomNum} database = {this.database}/>
                <Grid item xs = {10} style={{marginTop:10}}>
                    <Typography type="headline" gutterBottom>Each Firm's Profit (By Round)</Typography>
                </Grid> 
                <Profit roomNum = {this.roomNum} database = {this.database}/>
                <Grid item xs = {10} style={{marginTop:10}}>
                    <Typography type="headline" gutterBottom>Each Firm's Profit (By Accumulation)</Typography>
                </Grid> 
                <AccumProfit roomNum = {this.roomNum} database = {this.database}/>
                <Grid item xs = {10} style={{marginTop:10}}>
                
                <Button raised color="primary" className={classes.fullWidthButton} onClick = {this.nextRound.bind(this)} type="button">
                Go to Next Round
                </Button>
                </Grid> 
            </Grid>
        )
    }else if (this.state.display){
        return (

            <Grid container alignItems = 'center' justify = 'center' direction = 'row'>
            <Button style = {{height: '5%'}} raised size="large" color="accent" className={classes.fullWidthButton} onClick = {this.toggleFirmPerform} type="button">
                Firm Performance
                </Button>
                <Grid item xs = {10} style={{marginTop:10}}>
                    <Typography type="headline" gutterBottom>Balance Sheet</Typography>
                </Grid> 
                <Grid item xs={10}>
                    <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Table</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails> 
                    <DisplayTable info = {this.state.startInfo} numberOfCompany = {this.state.startInfo.roomInfo.firmNum} />
                    </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
                <FirmPerform database = {this.database} roomNum = {this.roomNum}/>

            </Grid>
        )
    }else{
        return null
    }
    
  }
}
EndSession.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(EndSession)