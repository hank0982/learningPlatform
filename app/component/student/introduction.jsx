import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  }),
});
class Introduction extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.roomInfo = this.props.roomInfo;
  }
  render() { 
    const { classes } = this.props;
    return (
        <div>
            <Typography type="display1" gutterBottom>Introduction and Rules</Typography>
            <Typography type = "headline" gutterBottom> Game Rules </Typography>
            <Paper className={classes.root} elevation={4}>
                <Typography style = {{whiteSpace: 'pre-line'}}type = 'body1' gutterBottom> {this.props.roomInfo.gameRule} </Typography>
            </Paper>
            
        </div>
        )
    }
}
Introduction.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Introduction)