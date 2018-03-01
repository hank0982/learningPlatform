import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
  } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
var data = [{ name: 'a', uv: 12 }];

const styles = theme => ({
  root: theme.mixins.gutters({
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    }),
  paper: theme.mixins.gutters({
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    }),
});
class EndGame extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.state = {
          companyInfo:null,
          informationOfEachRound: null
      }
      this.roomInfo = this.props.roomInfo;
      this.roundInfo = this.props.roundInfo;
      this.groupNum = this.props.groupNum;
      this.database = this.props.database;
      this.roomNum = this.roomInfo.roomNum;
      this.database.database().ref(this.roomNum).child('on').child('company_'+this.groupNum).once('value').then(function(data){
        that.setState({
            companyInfo: data.val()
        })
      })
      this.database.database().ref(this.roomNum).child('on').child('company_'+this.groupNum).on('value',function(data){
        that.setState({
            companyInfo: data.val()
        })
      }) 
    
      that.pricePerRounds = [];
      that.unitCostPerRounds = [];
      that.revenuePerRounds = [];
      that.profitPerRounds = [];
      that.profitPerCompany = [];
      that.accumprofitPerCompany = [];
      that.rounds = [];
      for(var u = 1; u<= parseInt(that.roomInfo.firmNum); u++){
        that.accumprofitPerCompany[u-1] = {
            name: 'Firm'+u,
            profit: 0
        }
      }
      for(var k = 1; k <= parseInt(that.roomInfo.firmNum); k++){
          that.rounds[k-1] = []
      }
      this.database.database().ref(this.roomNum).child('on').child('round').once('value').then(function(data){
        that.setState({
            informationOfEachRound:data.val()
        },function(){
            
            for(var i = 1; i <= data.val().currentRound; i++){
                
                for(var t = 1; t<= parseInt(that.roomInfo.firmNum); t++){
                    that.rounds[t-1][i-1] = {
                        name: i,
                        quantity: parseInt(that.state.informationOfEachRound['round'+i][t].quantityProduction)
                    }
                    if(i == data.val().currentRound){
                        that.profitPerCompany[t-1] = {
                            name: 'Firm'+t,
                            profit: parseFloat(that.state.informationOfEachRound['round'+i][t].profit)
                        }
                    }
                    console.log('this is company '+t+'accumprofit is '+that.accumprofitPerCompany[t-1].profit)
                    that.accumprofitPerCompany[t-1].profit = that.accumprofitPerCompany[t-1].profit + parseFloat(that.state.informationOfEachRound['round'+i][t].profit)
                
                }
                that.pricePerRounds[i-1] = {
                    name: i,
                    price: that.state.informationOfEachRound['round'+i].price
                }
                that.unitCostPerRounds[i-1] = {
                    name: i,
                    unitCost: that.state.informationOfEachRound['round'+i][that.groupNum].unitCost
                }
                that.revenuePerRounds[i-1] = {
                    name: i,
                    revenue: that.state.informationOfEachRound['round'+i][that.groupNum].revenue
                } 
                that.profitPerRounds[i-1] = {
                    name: i,
                    profit: that.state.informationOfEachRound['round'+i][that.groupNum].profit
                }
                
            }
        })
        that.setState({
            ready:true
        })
        
      })
  }
  render() { 
    let that = this;
    const { classes } = this.props;
    if(this.state.companyInfo && this.state.ready){
        var companyInfo = this.state.companyInfo;
        var totalAsset = parseFloat(companyInfo.assetCash) + parseFloat(companyInfo.assetLand) + parseFloat(companyInfo.assetPPE)
        var totalEquity = parseFloat(companyInfo.shareCapital) + parseFloat(companyInfo.beg) + parseFloat(companyInfo.netIncome)
        return (
        <div>
            <Typography type="display1" gutterbottom>Business Operation Analysis: {companyInfo.companyName}</Typography>
            <Typography type = "headline"> Important Factors </Typography>
            <ExpansionPanel className = {classes.paper}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Graphs</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails> 
                <Grid container alignItems = 'center' justify = 'center' direction = 'row'>
                    <Grid item xs = {3} style = {{marginTop:10}}>
                        <Typography type = "title">Price of Units Sold</Typography>
                        <LineChart width={300} height={250} data={this.pricePerRounds}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" />
                        </LineChart>
                    </Grid>
                    <Grid item xs = {3} style = {{marginTop:10}}>
                        <Typography type = "title">Units Cost</Typography>
                        <LineChart width={300} height={250} data={this.unitCostPerRounds}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Line type="monotone" dataKey="unitCost" stroke="#8884d8" />
                        </LineChart>
                    </Grid>
                    <Grid item xs = {3} style = {{marginTop:10}}>
                    <Typography type = "title">Revenue</Typography>
                        <LineChart width={300} height={250} data={this.revenuePerRounds}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                        </LineChart>
                    </Grid>
                    <Grid item xs = {3} style = {{marginTop:10}}>
                    <Typography type = "title">Profit</Typography>
                        <LineChart width={300} height={250} data={this.profitPerRounds}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Line type="monotone" dataKey="profit" stroke="#8884d8" />
                        </LineChart>
                    </Grid>
                </Grid>
                </ExpansionPanelDetails>      
            </ExpansionPanel>
            <Typography type = "headline"> Production of Each Firm </Typography>
            <ExpansionPanel className = {classes.paper}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Graphs</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails> 
                <Grid container alignItems = 'center' justify = 'flex-start' direction = 'row'>
                    {
                        Array.apply(null, {length:parseInt(this.roomInfo.firmNum)}).map(Number.call, Number).map(function(v){
                            return <Grid key={'firm'+(v+1)}item xs = {3} style = {{marginTop:10}}>
                                        <Typography type = "title">{'Firm'+(v+1)}</Typography>
                                        <LineChart width={300} height={250} data={that.rounds[v]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                                        </LineChart>
                                  </Grid>
                        })
                    }
                </Grid>
                </ExpansionPanelDetails>      
            </ExpansionPanel>

            <Grid container alignItems = 'flex-start' justify = 'flex-start' direction = 'row'>
                <Grid item xs = {6} style={{marginTop:10}}>
                <Typography type = "headline"> Balance Sheet </Typography>
                <ExpansionPanel className={classes.paper}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Asset</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails> 
                    <Grid container alignItems = 'center' justify = 'flex-start' direction = 'row'>
                        <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                            <TableCell>Cash</TableCell>
                            <TableCell>{companyInfo.assetCash}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Plant, Property and Equipment</TableCell>
                            <TableCell>{companyInfo.assetPPE}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Land</TableCell>
                            <TableCell>{companyInfo.assetLand}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Total Asset</TableCell>
                            <TableCell>{totalAsset}</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </Grid>
                    </ExpansionPanelDetails>   
                </ExpansionPanel>
                <ExpansionPanel className={classes.paper}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Liabilities</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails> 
                    <Grid container alignItems = 'center' justify = 'flex-start' direction = 'row'>
                        <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                            <TableCell>Borrowing</TableCell>
                            <TableCell>{companyInfo.liabilitiesBorrwoing}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Total Liabilities</TableCell>
                            <TableCell>{companyInfo.liabilitiesBorrwoing}</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </Grid>
                    </ExpansionPanelDetails>   
                </ExpansionPanel>
                <ExpansionPanel className={classes.paper}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Equity</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails> 
                    <Grid container alignItems = 'center' justify = 'flex-start' direction = 'row'>
                        <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                            <TableCell>Share Capital</TableCell>
                            <TableCell>{companyInfo.shareCapital}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Retained Earnings</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Beg.</TableCell>
                            <TableCell>{companyInfo.beg}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Net income</TableCell>
                            <TableCell>{companyInfo.netIncome}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Total Retained Earnings</TableCell>
                            <TableCell>{parseFloat(companyInfo.beg) + parseFloat(companyInfo.netIncome)}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Total Equity</TableCell>
                            <TableCell>{totalEquity}</TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </Grid>
                    </ExpansionPanelDetails>   
                </ExpansionPanel>        
                </Grid>
                <Grid item xs = {6} style={{marginTop:10}}>
                <Typography type = "headline"> Competitors Analysis </Typography>
                <ExpansionPanel className={classes.paper}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Profit of Each Firm</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails> 
                    <Grid container alignItems = 'center' justify = 'flex-start' direction = 'row'>
                    <BarChart width={400} height={250} data={that.profitPerCompany}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#8884d8" />
                    </BarChart>
                    </Grid>
                    </ExpansionPanelDetails>   
                </ExpansionPanel>
                <Typography type = "headline"> Cumulative Profit  </Typography>
                <ExpansionPanel className={classes.paper}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Profit of Each Firm</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails> 
                    <Grid container alignItems = 'center' justify = 'flex-start' direction = 'row'>
                    <BarChart width={400} height={250} data={that.accumprofitPerCompany}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#8884d8" />
                    </BarChart>
                    </Grid>
                    </ExpansionPanelDetails>   
                </ExpansionPanel>
                </Grid>
                
            </Grid>
        </div>
        )
    }else{
        console.log(this.state)
        return <p> Please wait </p>
    }
    }
}
EndGame.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EndGame)