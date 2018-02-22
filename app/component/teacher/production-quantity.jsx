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
const data = [
      {name: '1', pv: 2400,},
      {name: '2', pv: 1398,},
      {name: '3', pv: 9800,},
      {name: '4', pv: 3908,},
      {name: '5', pv: 4800,},
      {name: '6', pv: 3800,},
      {name: '7', pv: 4300,},
];
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
  
class ProductionQuantity extends React.Component {  
  constructor(props){
      super(props);
  }
  render() { 
    const { classes } = this.props;
    return (
            
            <Grid item xs = {10}>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Graph</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails> 
                <div className={classes.column, classes.helper}>
                    <Typography type="headline">
                    Price<br />
                    </Typography>
                    <Typography type="body1">
                    100
                    </Typography>
                </div>
                <BarChart width={600} height={300} data={data}
                      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                </BarChart>
                </ExpansionPanelDetails>
                
            </ExpansionPanel>
            </Grid>
    )
  }
}
ProductionQuantity.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ProductionQuantity)