import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: theme.mixins.gutters({
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    }),
});
class MarketIntro extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.roomInfo = this.props.roomInfo;
      this.roundInfo = this.props.roundInfo;
  }
  render() { 
    const { classes } = this.props;
    return (
        <div>
            <Typography type="display1" gutterBottom>{'Round ' + this.roundInfo.currentRound}</Typography>
                <Typography type='headline' gutterBottom> Market Situation </Typography>
                <Paper className={classes.root} elevation={4}>
                    <Typography style = {{whiteSpace: 'pre-line'}} type= 'body1' gutterBottom> {this.roomInfo.descriptionOfFirms} </Typography>
                </Paper><br/>
                <Typography type='headline' gutterBottom> Model of Market Structure </Typography>
                <Paper className={classes.root} elevation={4}>
                    <Typography style = {{whiteSpace: 'pre-line'}} type= 'body1' gutterBottom> {this.roomInfo.marketDescription} </Typography>
                </Paper><br/>
                <Typography type='headline' gutterBottom> Firm's Objective</Typography>
                <Paper className={classes.root} elevation={4}>
                    <Typography style = {{whiteSpace: 'pre-line'}} type= 'body1' gutterBottom> {this.roomInfo.goalOfFirms} </Typography>
                </Paper><br/>
        </div>
        )
    }
}
MarketIntro.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MarketIntro)