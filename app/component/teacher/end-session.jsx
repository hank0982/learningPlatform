import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import MarketPrice from './market-price';
import ProductionQuantity from './production-quantity'
import { querystring } from '@firebase/util';
import Button from 'material-ui/Button'
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    fullWidthButton: theme.mixins.gutters({
        marginTop: theme.spacing.unit,
        width: '100%'
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
  }
  nextRound(ev){
    let that = this;
    ev.preventDefault();
    this.database.database().ref(this.roomNum).child('on').child('round').child('currentRound').once('value').then(function(data){
        that.database.database().ref(that.roomNum).child('on').child('round').child('currentRound').set(data.val()+1);
        that.database.database().ref(that.roomNum).child('on').child('round').child('endSession').set(false)
    })
  }
  render() { 
    const { classes } = this.props;
    return (
        <Grid container alignItems = 'center' justify = 'center' direction = 'row'>
            <Grid item xs = {10} style={{marginTop:10}}>
                <Typography type="headline" gutterBottom>Market Price</Typography>
            </Grid> 
            <MarketPrice roomNum = {this.roomNum} database = {this.database}/>
            <Grid item xs = {10} style={{marginTop:10}}>
                <Typography type="headline" gutterBottom>Production Quantity of Each Firms</Typography>
            </Grid> 
            <ProductionQuantity roomNum = {this.roomNum} database = {this.database}/>
            <Grid item xs = {10} style={{marginTop:10}}>
                <Typography type="headline" gutterBottom>Profit of Each Firms (BY ROUND)</Typography>
            </Grid> 
            <ProductionQuantity roomNum = {this.roomNum} database = {this.database}/>
            <Grid item xs = {10} style={{marginTop:10}}>
                <Typography type="headline" gutterBottom>Profit of Each Firms (Accumulation)</Typography>
            </Grid> 
            <ProductionQuantity roomNum = {this.roomNum} database = {this.database}/>
            <Grid item xs = {10} style={{marginTop:10}}>
            <Button raised color="primary" className={classes.fullWidthButton} onClick = {this.nextRound.bind(this)} type="button">
            Start next round
            </Button>
            </Grid> 
        </Grid>
    )
  }
}
EndSession.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(EndSession)