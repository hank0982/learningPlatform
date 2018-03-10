import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import Typography from 'material-ui/Typography';

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
  
class FirmPerform extends React.Component {  
    constructor(props){
        super(props);
        let that = this;
        this.state = {
            display: false
        }
        this.roomNum = this.props.roomNum;
        this.database = this.props.database;
       
    }
    render(){
        var {classes} = this.props;
        if(this.state.display){
            return (
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
            )
        }else{
            return null
        }
    }
}
FirmPerform.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(FirmPerform)