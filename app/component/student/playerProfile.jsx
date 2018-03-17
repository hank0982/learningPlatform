import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Modal from 'material-ui/Modal';
import EndGame from './end-game';
const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
    }),
    fullWidthButton: theme.mixins.gutters({
            marginTop: theme.spacing.unit,
            width: '100%'
        }),
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
});
class PlayerProfile extends React.Component {  
  constructor(props){
      super(props);
      let that = this;
      this.state = {
          checkedBorrowing: false,
          borrowing: 0,
          endSession: false,
          open: false,
          modalOpen: false,
          snackbarMessage: ''
      };
      this.renderSnackBar = () => {
        return(
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={this.handleClose}
                open={this.state.open}
                
                autoHideDuration={6000}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.snackbarMessage}</span>}
            />
        )  
      }
      this.handleClose = (event) => {
        this.setState({ open: false });
      };
      this.roomInfo = this.props.roomInfo;
      this.roundInfo = this.props.roundInfo;
      this.groupNum = this.props.groupNum;
      this.database = this.props.database;
      this.roomNum = this.roomInfo.roomNum; 
      if(this.roundInfo.currentRound == 1){
         // the round has been updated
          // remember to updata every thing
          // update the roundInfo 
          this.database.database().ref(this.roomNum).child('on').child('round').once('value').then(function(data){
            that.roundInfo = data.val()
          })
          // register a listener to listen round information change
          this.database.database().ref(this.roomNum).child('on').child('round').on('value',function(data){
            that.roundInfo = data.val()
          })
          // update the companyInfo
          this.database.database().ref(this.roomNum).child('on').child('company_'+this.groupNum).once('value').then(function(data){
            that.setState({
                companyInfo: data.val()
            })
          })
          // register a listener to listen round information change
          this.database.database().ref(this.roomNum).child('on').child('company_'+this.groupNum).on('value',function(data){
            that.setState({
                companyInfo: data.val()
            })
            console.log(data.val())
          })
        this.database.database().ref(this.roomNum).child('on').child('round').once('value').then(function(data){
            that.roundInfo = data.val();
        }).then(function(){
            that.database.database().ref(that.roomNum).child('on').child('round').child('round'+that.roundInfo.currentRound).child(that.groupNum).child('submit').once('value').then(function(data){
                that.setState({
                    submit: data.val()
                })
                console.log(data.val())
            })
        })
        
      }else{
          // the round has been updated
          // remember to updata every thing
          // update the roundInfo 
          this.database.database().ref(this.roomNum).child('on').child('round').once('value').then(function(data){
            that.roundInfo = data.val()
          })
          // register a listener to listen round information change
          this.database.database().ref(this.roomNum).child('on').child('round').on('value',function(data){
            that.roundInfo = data.val()
          })
          // update the companyInfo
          this.database.database().ref(this.roomNum).child('on').child('company_'+this.groupNum).once('value').then(function(data){
            that.setState({
                companyInfo: data.val()
            })
          })
          // register a listener to listen round information change
          this.database.database().ref(this.roomNum).child('on').child('company_'+this.groupNum).on('value',function(data){
            that.setState({
                companyInfo: data.val()
            })
          })
        this.database.database().ref(this.roomNum).child('on').child('round').once('value').then(function(data){
            that.roundInfo = data.val();
        }).then(function(){
            that.database.database().ref(that.roomNum).child('on').child('round').child('round'+that.roundInfo.currentRound).child(that.groupNum).child('submit').once('value').then(function(data){
                that.setState({
                    submit: data.val()
                })
            })
        })
        
      }
      this.database.database().ref(this.roomNum).child('on').child('round').child('endSession').once('value').then(function(data){
        that.setState({
            endSession: data.val(),
            submit: data.val()
        })
    })
      this.database.database().ref(this.roomNum).child('on').child('round').child('endSession').on('value',function(data){
        that.setState({
            endSession: data.val(),
            submit: data.val()
        })
    })
    }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  hundleSubmit(){
    let that = this;
    let {borrowing, checkedBorrowing, quantity} = this.state;
    this.setState({
        submit: true
    })
    if( quantity > companyInfo.maximum || quantity < companyInfo.minimum ) {
        // alert
        this.setState({
            quantity: null,
            modalOpen: true,
        });
        console.log("quantity not allowed");
        // alert
        return 0;
    }
    var forSend = {
        submit: true,
        isBorrowing: checkedBorrowing,
        numBorrowing: borrowing,
        quantityProduction: quantity
    }
    var messageInfo = (forSend.isBorrowing ? (' borrowed '+forSend.numBorrowing ): ' did not borrow anything') + ' and the quantity of production is ' + forSend.quantityProduction;
    this.addMessageToDatabase({
          time: new Date().toLocaleString('en-GB', {timeZone:'Asia/Hong_Kong'}),
          message: 'Group '+this.groupNum + messageInfo
    })
    this.database.database().ref(this.roomNum).child('on').child('round').child('round'+this.roundInfo.currentRound).child(this.groupNum).set(forSend)
    this.database.database().ref(this.roomNum).child('on').child('round').child('round'+this.roundInfo.currentRound).once('value').then(function(data){
        var notYetOKForNextRound = false;
        for(var i = 1; i <= parseInt(that.roomInfo.firmNum); i ++){
            if(data.val()[i].submit != true){
                notYetOKForNextRound = true
            }
        }
        console.log(notYetOKForNextRound)
        if(notYetOKForNextRound == false){
              that.database.database().ref(that.roomNum).child('on').child('round').child('endroundbutton').set(false);
        }
    })
}   

    handleModalClose(){
        this.setState({modalOpen: false});
    }

    addMessageToDatabase(message){
        this.database.database().ref(this.roomNum).child('on').child('console').push().set(message)
    }

  renderErrorModal(){
    let that = this;
    return(<div>
    <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={that.state.modalOpen}
        onClose={that.handleModalClose}>
            <div className={that.classes.paper}>
                <Typography variant="title" id="modal-title">
                    Oopsy
                </Typography>
                <Typography variant="subheading" id="simple-modal-description">
                    It seems that your quantity is not what it should be. Check the maximum and minimum amount you can input! 
                </Typography>
            </div>
    </Modal></div>
    )
  }
  
  renderAsset(){
    const { classes } = this.props;
    let {companyInfo} = this.state;
      return (
          <div>
            <Typography type = 'title' gutterBottom> Asset </Typography>
            <Paper className={classes.root} elevation={4}>
                <Table className={classes.table}>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Cash</TableCell>
                    <TableCell >{companyInfo.assetCash}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Plant, Property and Equipment</TableCell>
                    <TableCell >{companyInfo.assetPPE}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Land</TableCell>
                    <TableCell >{companyInfo.assetLand}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Total Asset</TableCell>
                    <TableCell >{Number(companyInfo.assetLand) + Number(companyInfo.assetCash) + Number(companyInfo.assetPPE)}</TableCell>
                </TableRow>
                </Table>
            </Paper>
        </div>
      )
  }
  renderLiabilities(){
      const { classes } = this.props;
      let {companyInfo, borrowing, checkedBorrowing} = this.state;
      return (
          <Paper className={classes.root} elevation={4}>
                        <Table className={classes.table}>
                        <TableRow>
                            <TableCell style ={{width: '40%'}}>Borrowing</TableCell>
                            <TableCell >{Number(companyInfo.liabilitiesBorrwoing) + (checkedBorrowing ? Number(borrowing) : null )}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style ={{width: '40%'}}>Total Liabilities</TableCell>
                            <TableCell >{Number(companyInfo.liabilitiesBorrwoing) + Number(borrowing)}</TableCell>
                        </TableRow>
                        </Table>
                    </Paper>
      )
  }
  renderEquity(){
      const { classes } = this.props;
      let {companyInfo} = this.state;
      return (
            <Paper className={classes.root} elevation={4}>
                <Table className={classes.table}>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Share Capital</TableCell>
                    <TableCell >{companyInfo.shareCapital}</TableCell>
                </TableRow>
                </Table>
                <Typography type = 'body1' gutterBottom> Retained Earnings </Typography>
                <Table className={classes.table}>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Beg.</TableCell>
                    <TableCell >{companyInfo.beg}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Net Income</TableCell>
                    <TableCell >{companyInfo.netIncome}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Total Retained Earnings</TableCell>
                    <TableCell >{Number(companyInfo.netIncome) + Number(companyInfo.beg)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style ={{width: '40%'}}>Total Equity</TableCell>
                    <TableCell >{Number(companyInfo.netIncome) + Number(companyInfo.beg) + Number(companyInfo.shareCapital)}</TableCell>
                </TableRow>
                </Table>
            </Paper>
      )
  }

  renderTotalCost() {
    let {companyInfo} = this.state;
    return (
        <Typography style = {{whiteSpace: 'pre-line'}} type= 'body1' gutterBottom> 
            {companyInfo.constant == 0 ? null : companyInfo.constant}
            {companyInfo.constant == 0 || companyInfo.coefficientOne == 0 ? null : ' + '}
            {companyInfo.coefficientOne == 0 ? null : companyInfo.coefficientOne == 1 ? 'q' : companyInfo.coefficientOne+'q' }
            {companyInfo.coefficientOne == 0 || companyInfo.coefficientTwo == 0 ? null : ' + '}
            {companyInfo.coefficientTwo == 0 ? null : companyInfo.coefficientTwo == 1 ? 'q' : companyInfo.coefficientTwo+'q' }{companyInfo.coefficientTwo == 0 ? null : <sup>2</sup>}
            {companyInfo.coefficientTwo == 0 || companyInfo.coefficientThree == 0 ? null : ' + '}
            {companyInfo.coefficientThree == 0 ? null : companyInfo.coefficientThree == 1 ? 'q' : companyInfo.coefficientThree+'q'}{companyInfo.coefficientThree == 0 ? null : <sup>3</sup>}
        </Typography>
    )
  }

  renderUserInput(){
    const { classes } = this.props;
    let {companyInfo} = this.state;
    return (
    <div>
    {/* {this.renderErrorModal()} */}
    <Typography type="display1" gutterBottom>{'Name: ' + companyInfo.companyName}</Typography>
    
    <Grid container 
    alignItems = 'flex-start'
    justify = 'flex-start'
    height = '100%'
    direction = 'row'>
        <Grid item xs={6}>
            <Grid >
                    <Typography type='headline' gutterBottom> Firm Description </Typography>
                    <Paper className={classes.root} elevation={4}>
                    <Typography style = {{whiteSpace: 'pre-line'}} type= 'body1' gutterBottom> {companyInfo.companyDescription} </Typography>
                    </Paper>
            </Grid>
            <Typography type='headline' gutterBottom> Balance Sheet </Typography>
            {this.renderAsset.bind(this)()}
            <Typography type = 'title' gutterBottom> Liabilities </Typography>
            {this.renderLiabilities.bind(this)()}
            <Typography type = 'title' gutterBottom> Equity </Typography>
            {this.renderEquity.bind(this)()}
        </Grid>
        
        <Grid item xs = {1}>
        </Grid>
        <Grid item xs={5} >
            
            <Grid >
                    <Typography type='headline' gutterBottom> Production Cost </Typography>
                    <Typography type = 'title' gutterBottom> Total Cost </Typography>
                    <Paper className={classes.root} elevation={4}>
                    {this.renderTotalCost()}
                    {/* <Typography style = {{whiteSpace: 'pre-line'}} type= 'body1' gutterBottom> 
                        {companyInfo.constant + ' + '+ companyInfo.coefficientOne+'Q + ' +companyInfo.coefficientTwo+'Q'}<sup>2</sup>{' + '+companyInfo.coefficientThree+'Q'}<sup>3</sup>
                    </Typography> */}
                    </Paper>
            </Grid>
            <Grid >
                    <Typography type= 'headline' gutterBottom> Production Capacity </Typography>
                    <Paper className={classes.root} elevation={4}>
                    <Table className={classes.table}>
                    <TableRow>
                        <TableCell style ={{width: '40%'}}>Maximum</TableCell>
                        <TableCell >{companyInfo.maximum}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style ={{width: '40%'}}>Minimum</TableCell>
                        <TableCell >{companyInfo.minimum}</TableCell>
                    </TableRow>
                    </Table>
                    </Paper>
            </Grid>
            <Grid >
                <Typography type= 'headline' gutterBottom> Addtional Functions </Typography>
                <Paper className={classes.root} elevation={4}>
                <Table className={classes.table}>
                    <TableRow>
                        <TableCell style ={{width: '40%'}}>
                        <FormControlLabel
                        control={
                            <Switch
                            checked={this.state.checkedBorrowing}
                            onChange={(event, checked) => this.setState({ checkedBorrowing: checked })}
                            />
                        }
                        label="Borrowing"
                        />
                        </TableCell>
                        <TableCell >{
                    this.state.checkedBorrowing ?
                        <TextField
                        id="number"
                        label="Borrowing"
                        value={this.state.borrowing}
                        onChange={this.handleChange('borrowing')}
                        type="number"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="dense"
                        />
                    : null
                }</TableCell>
                </TableRow>
                </Table>
                </Paper>      
            </Grid>
            <Grid>
            <Typography type='headline' gutterBottom> Your Decision </Typography>
            <Paper className={classes.root} elevation={4}>
            <TextField
            id="number"
            label="Quantity of Your Production"
            value={this.state.quantity}
            onChange={this.handleChange('quantity')}
            type="number"
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            fullWidth
            margin="dense"
            />
            </Paper>
            </Grid>
            <Button raised onClick = {this.hundleSubmit.bind(this)} color="primary" className={classes.fullWidthButton}> Submit </Button>
            </Grid>

    </Grid>
    </div>
    )
  }
  render() { 
    const { classes } = this.props;
    if(this.state.endSession == true){
        return <EndGame roundInfo = {this.roundInfo} roomNum = {this.roomNum} database = {this.database} roomInfo = {this.roomInfo} groupNum = {this.groupNum} windowWidth = {this.props.windowWidth} windowHeight = {this.props.windowHeight}/>
    }else{
        if(!this.state.submit){
            if(this.state.stackelberg){
                //stackelberg game on
                //if user is leader
                if(this.state.leader){                    
                    if(this.state.companyInfo){
                        return this.renderUserInput.bind(this)()
                    }else{
                        return null
                    }
                }else{
                    return null
                }
            }else{
                if(this.state.companyInfo){
                    return this.renderUserInput.bind(this)()
                }else{
                    return null
                }
            }
            
        }else{
            return <p>Please wait for other groups</p>
        }
    }
}
}
PlayerProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PlayerProfile)