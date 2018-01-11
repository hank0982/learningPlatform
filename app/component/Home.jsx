import React from "react";
import io from "socket.io-client";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import ApplcationBar from './AppBar'

const styles = theme => ({
    root: theme.mixins.gutters({
      paddingTop: 16,
      paddingBottom: 16,
      marginTop: theme.spacing.unit * 3,
    }),
    middleOfPage: theme.mixins.gutters({
      position: 'absolute',
      margin: 'auto',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }),
    fullWidthButton: theme.mixins.gutters({
        marginTop: theme.spacing.unit,
        width: '100%'
      }),
  });
class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isStudent: true,
            open: false,
            snackbarMessage: ''
        }
        let that = this;
        this.classes = props.classes;
        let classes = this.classes;
        this.socket = this.props.socket;
        this.socket.on('SUCCESS', function(data){
            console.log(data)
            that.setState({
                open: true,
                snackbarMessage: data.msg
            })
            if(data.type === 'success-2'){
                that.setState({
                    gameSetting: true
                })
            }
        })
        this.socket.on('ERROR', function(data){
            console.log(data)
            that.setState({
                open:true,
                snackbarMessage: data.msg
            })
        })
        this.handleClose = (event) => {
            this.setState({ open: false });
        };
        this.buttonOnClick= ev =>{
            ev.preventDefault();
            this.setState({
                isStudent: !this.state.isStudent
            });
        };
        this.handleTextOnChage = name => event =>{
            this.setState({
                [name]: event.target.value,
              });
        };
        this.handleSubmit = ev =>{
            ev.preventDefault();
            if(this.state.isStudent){
                if(this.state.stuRoomNum && this.state.stuGroupNum){
                    let transferData = {
                        roomNum: this.state.stuRoomNum,
                        groupNum: this.state.stuGroupNum
                    };
                    this.socket.emit('JOIN_ROOM',transferData);
                }else{
                    that.setState({
                        open: true,
                        snackbarMessage: 'WARNING! Please provide sufficient data'
                    });
                }
            }else{
                if(this.state.lecRoomNum && this.state.lecPass){
                    let transferData = {
                        roomNum: this.state.lecRoomNum,
                        lecPass: sha256(this.state.lecPass)
                    };
                    that.setState({
                        roomNum: this.state.lecRoomNum
                    });
                    this.socket.emit('CREATE_ROOM',transferData);
                    

                }else{
                    that.setState({
                        open: true,
                        snackbarMessage: 'WARNING! Please provide sufficient data'
                    });
                }
            }
        };
        this.renderForm = () =>{
            return this.state.isStudent ? 
                        <div>
                            <form onSubmit={this.handleSubmit} autoComplete="off">
                                <TextField
                                    id="stu-room-num"
                                    label="Please Enter The Room Number."
                                    type="number"
                                    margin="normal"
                                    onChange = {this.handleTextOnChage('stuRoomNum')}
                                    fullWidth
                                    autoFocus
                                />
                                <TextField
                                    id="stu-group-num"
                                    label="Please Enter Your Group Number."
                                    type="number"
                                    onChange = {this.handleTextOnChage('stuGroupNum')}
                                    margin="normal"
                                    fullWidth
                                />
                                <Button raised color="primary" className={classes.fullWidthButton} type="submit">
                                    Submit
                                </Button>
                            </form>

                            <Button raised color="accent" className={classes.fullWidthButton} onClick={this.buttonOnClick}>
                                Lecturers
                            </Button>
                            
                        </div>
                        : 
                        <div>
                            <Typography align="center" component="p">
                                Please create a new room before start stimulation game.
                            </Typography>
                            <form onSubmit={this.handleSubmit} autoComplete="true">
                                <TextField
                                    id="lec-room-num"
                                    label="Please Enter The Room Number."
                                    type="number"
                                    onChange = {this.handleTextOnChage('lecRoomNum')}
                                    margin="normal"
                                    fullWidth
                                    autoFocus
                                />
                                <TextField
                                    id="lec-pass"
                                    label="Please Enter Your Password."
                                    onChange = {this.handleTextOnChage('lecPass')}
                                    margin="normal"
                                    autoComplete="new-password"
                                    fullWidth
                                    type="password"
                                />
                                <Button raised color="primary" className={classes.fullWidthButton} type="submit">
                                    Submit
                                </Button>
                            </form>
                            <Button raised color="accent" className={classes.fullWidthButton} onClick={this.buttonOnClick}>
                                Students
                            </Button>
                        </div>
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
    }
    
    render(){
        let classes = this.classes
        if(this.state.gameSetting){
            return <Redirect push to={"/game_setting/" + this.state.roomNum} />;
        }
        return (
            <div>
            <ApplcationBar type = 'Home'/>
            <Grid container className = {classes.middleOfPage} alignItems='center' justify='center' height='100%'>
                <Paper className={classes.root} elevation={4} height='100%'>
                    <Typography align="center" type="headline" component="h1">
                        Business Strategy Stimulation System 
                    </Typography>
                    {this.renderForm()}
                    {this.renderSnackBar()}
                </Paper>
            </Grid>
            </div>
        );
    }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(Home);
