import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import config from '../config'
import * as colors from 'material-ui/colors';

const styles = {
    root: {
      width: '100%',
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };
  
class ApplicationBar extends React.Component {  
  constructor(props){
      super(props);
  }
  renderBarTitle(type){
      switch(type){
          case 'Home':
            return config.app_name;
          case 'GameSetting':
            return 'Game Setting';
          case 'teacher_gamestart':
            return 'Game Start';
          case 'about':
            return 'About us';
          default:
            return type;
      }
  }
  render() { 
    const { classes } = this.props;
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography type="title" color="inherit" className={classes.flex}>
                    {this.renderBarTitle(this.props.type)}
                </Typography>
            </Toolbar>
        </AppBar>
    )
  }
}
ApplicationBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ApplicationBar)