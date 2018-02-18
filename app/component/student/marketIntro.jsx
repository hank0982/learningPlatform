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
                <Typography type='headline' gutterBottom> Description of Firms </Typography>
                <Typography style = {{whiteSpace: 'pre'}} type= 'body1' gutterBottom> {this.roomInfo.descriptionOfFirms} </Typography>
                <Typography type='headline' gutterBottom> Market Description </Typography>
                <Typography style = {{whiteSpace: 'pre'}} type= 'body1' gutterBottom> {this.roomInfo.marketDescription} </Typography>
                <Typography type='headline' gutterBottom> Goal of the Firms</Typography>
                <Typography style = {{whiteSpace: 'pre'}} type= 'body1' gutterBottom> {this.roomInfo.goalOfFirms} </Typography>
        </div>
        )
    }
}
MarketIntro.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MarketIntro)