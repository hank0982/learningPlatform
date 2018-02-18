import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import MarketPrice from './market-price';
import ProductionQuantity from './production-quantity'
const styles = theme => ({
    root: {
        flexGrow: 1,
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
  
class EndSession extends React.Component {  
  constructor(props){
      super(props);
      
  }
  render() { 
    const { classes } = this.props;
    return (
        <Grid container alignItems = 'center' justify = 'center' direction = 'row'>
            <Grid item xs = {10} style={{marginTop:10}}>
                <Typography type="headline" gutterBottom>Market Price</Typography>
            </Grid> 
            <MarketPrice/>
            <Grid item xs = {10} style={{marginTop:10}}>
                <Typography type="headline" gutterBottom>Production Quantity of Each Firms</Typography>
            </Grid> 
        </Grid>
    )
  }
}
EndSession.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(EndSession)