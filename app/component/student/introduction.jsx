import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';

const styles = theme => ({
  root: theme.mixins.gutters({
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
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
            <Typography style = {{whiteSpace: 'pre'}}type = 'body1' gutterBottom> {this.props.roomInfo.gameRule} </Typography>
        </div>
        )
    }
}
Introduction.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Introduction)