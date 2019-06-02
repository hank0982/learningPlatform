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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

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

class Profit extends React.Component {
  constructor(props) {
    super(props);
    var database = this.props.database;
    var roomNum = this.props.roomNum;
    let that = this;
    this.state = {
      display: false,
    };
    this.data = [];
    database
      .database()
      .ref(roomNum)
      .child('on')
      .child('round')
      .once('value')
      .then(function(data) {
        var roundInfo = data.val();
        database
          .database()
          .ref(roomNum)
          .child('on')
          .child('roomInfo')
          .once('value')
          .then(function(snap) {
            var roomInfo = snap.val();
            for (var k = 1; k <= roundInfo.currentRound; k++) {
              that.data[k - 1] = {
                name: 'Round ' + k,
              };
            }
            for (var i = 1; i <= roundInfo.currentRound; i++) {
              for (var u = 1; u <= parseInt(roomInfo.firmNum); u++) {
                that.data[i - 1]['Firm ' + u] = roundInfo['round' + i][u].price;
              }
            }
            console.log(that.data);
            that.setState({
              display: true,
              firmNum: roomInfo.firmNum,
            });
          });
      });
  }

  renderProfit() {
    var color = ['#03A9F4', '#8BC34A', '#FFEB3B', '#FF9800'];
    var renderDOM = [];
    for (var i = 1; i <= this.state.firmNum; i++) {
      renderDOM.push(
        <Line type="linear" dataKey={'Firm ' + i} stroke={color[i % 4]} />,
      );
    }
    return renderDOM;
  }

  render() {
    const { classes } = this.props;
    if (this.state.display) {
      console.log(this.data);
      return (
        <Grid item xs={10}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Graph</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid item xs={12}>
                <LineChart
                  width={1000}
                  height={300}
                  data={this.data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  {this.renderProfit()}
                </LineChart>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={10}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Graph</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>Please Wait</ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      );
    }
  }
}
Profit.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Profit);
