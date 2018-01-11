import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import ApplcationBar from '../AppBar'
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Snackbar from 'material-ui/Snackbar';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',

    }),
    barPaper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
    }),
    fullWidthButton: theme.mixins.gutters({
        marginTop: theme.spacing.unit,
        width: '100%'
    }),
    selectEmpty: theme.mixins.gutters({
        marginTop: theme.spacing.unit * 2,
    }),
    table: theme.mixins.gutters({
        minWidth: 700,
    }),
});
class GameSetting extends React.Component {
    constructor(props) {
        super(props);
        
        var initPlayerSettingState = {
                firmNum: 0,
                roundNum: 0,
                demandConstant: 0,
                demandSlope: 0,
                increaseInCapacity: false,
                advertisementImplement: false,
                taxComposition: false,
                productionDifferentiation: false,
                leader: 0,
                marketType: 'monoply',
        }
        this.state = {
            ...initPlayerSettingState,
            roomNum: this.props.match.params.id,
            gameSetting: 'block',
            
        }
        let that = this;
        this.classes = props.classes;
        this.socket = this.props.socket;
        this.socket.on('SUCCESS', function(data) {
            that.setState({
                open: true,
                snackbarMessage: data
            })
        });
        this.socket.on('ERROR', function(data) {
            that.setState({
                open: true,
                snackbarMessage: data
            })
        });
        this.socket.on('SET_GAME', function(data){
            console.log('game start')
        });
        this.handleClose = (event) => {
            this.setState({ open: false });
        };
        this.buttonOnClick = ev => {
            ev.preventDefault();
            this.setState({
                isStudent: !this.state.isStudent
            });
        };
        
        this.handleSelectOnChange = event => {
            that.setState({
                [event.target.name]: event.target.value
            });
        };
        this.handleSwitchOnChange = name => (event, checked) => {
            that.setState({
                [name]: checked
            });
        
        };
        
        this.renderSnackBar = () => {
            return(
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
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
        };
    }
    handleSubmit = ev =>{
        ev.preventDefault();
        let that = this;
        let printerror = false;
        var companys = {};
        var dataTypeInCompany = ['constant','coefficientOne','coefficientTwo','coefficientThree','maximum','minimum','assetCash','assetPPE','assetLand','liabilitiesBorrwoing','shareCapital','beg','netIncome']
        for(let i = 1; i <= that.state.firmNum; i++){
            if(!that.state['company_'+i]){
                printerror = true;
                break;
            }else{
                let company = that.state['company_'+i]
                companys['company_'+i] = company;
                dataTypeInCompany.map(function(type){
                    if(!company[type]){
                        printerror = true;
                        console.log(type)
                        return;
                    }
                })
            }

        }
        var roomInfo = {
            roomNum: this.state.roomNum,
            firmNum: this.state.firmNum,
            marketType: this.state.marketType,
            roundNum: this.state.roundNum,
            constant: this.state.demandConstant,
            slope: this.state.demandSlope,
            increaseInCapacity: this.state.increaseInCapacity,
            advertisementImplement: this.state.advertisementImplement,
            taxComposition: this.state.taxComposition,
            productionDifferentiation: this.state.productionDifferentiation
        }
        var transferData = {
            ...companys,
            roomInfo: roomInfo,
            timeStamp: new Date()
        };
        if(transferData.roomInfo.constant && transferData.roomInfo.firmNum && transferData.roomInfo.slope && transferData.roomInfo.roundNum && !printerror){
            this.socket.emit('GAME_SETTING', transferData);
            console.log(transferData);
        }else{
            that.setState({
                open: true,
                snackbarMessage: 'WARNING! Please provide sufficient data'
            })
        }
    };
    handleTextOnChange = name => event => {
        let that = this;
        this.setState({
            [name]: event.target.value,
        });
        function judge(max, min, helper){

            if(event.target.value > max || event.target.value < min){
                that.setState({
                    [name+'Helper']: helper,
                    [name+'Error']: true,
                    [name]: event.target.value > max ? max : event.target.value < min ? min : event.target.value ,
                });
            }else{
                that.setState({
                    [name+'Helper']: '',
                    [name+'Error']: false
                });
            }
        }
        if(name === 'firmNum'){
            judge(10, 0, 'Please enter number from 1 to 10',);
        }
        if(name === 'roundNum'){
            judge(10, 1, 'Please enter number from 1 to 10',);
        }
        if(name === 'demandSlope'){
            judge(9999, 1, 'Please enter number from 1 to 9999',);

        }
        if(name === 'demandConstant'){
            judge(9999, 1, 'Please enter number from 1 to 9999',);
        }
        if(name.slice(0,'constant'.length) === 'constant'){
            judge(9999, 1, 'Please enter number from 1 to 9999',);
        }
        
    };
    handleCompanyOnChange = company => event => {
        let that = this;
        let name = company.name;
        let companyID = company.id;
        var obj = {
            ...this.state['company_'+companyID],
            [name]: event.target.value
        }
        this.setState({
            ['company_'+companyID]: obj
        });
        
    };
    renderTableRowFive(key, title, id, label, less, type = "number"){
        let that = this
        if(less){
            return(
                <TableRow key={key}>
                    <TableCell padding="dense">{title}</TableCell>
                    {Array.apply(null, {length: that.state.firmNum? that.state.firmNum:1}).map(Number.call, Number).map(function(v){
                        if(v+1 <= 5){
                        let k = v+1;
                        return(
                            <TableCell key = {v+1} value={v+1} padding="dense" >
                                <TextField
                                id={id+k.toString()}
                                label={label}
                                onChange={that.handleCompanyOnChange({name: id, id:k})}
                                className={that.classes.textField}
                                fullWidth
                                type={type}
                                margin='dense'
                                />
                            </TableCell>
                        );
                    }
                    })}
                </TableRow>
                )
        }else{
            return(
                <TableRow key={key}>
                    <TableCell padding="dense">{title}</TableCell>
                    {Array.apply(null, {length: this.state.firmNum? this.state.firmNum:1}).map(Number.call, Number).map(function(v){
                        if(v+1 > 5){
                        let k = v+1;
                        return(
                            <TableCell key = {v+1} value={v+1} padding="dense" >
                                <TextField
                                id={id+k.toString()}
                                label={label}
                                onChange={that.handleCompanyOnChange({name: id, id:k})}
                                className={that.classes.textField}
                                fullWidth
                                type="number"
                                margin='dense'
                                />
                            </TableCell>
                        )
                    }
                    })}
                </TableRow>)
        }
    }
    renderTableTitle(key, title,type){
        let that = this;
        return  (<TableRow key={key}>
                    <TableCell padding="dense">
                    <Typography color = "primary" type={type} style={type === 'title'?{fontSize:'12pt'}:null}>{title}</Typography>
                    </TableCell>
                    {Array.apply(null, {length: that.state.firmNum? that.state.firmNum:1}).map(Number.call, Number).map(function(v){
                    if(v+1 <= 5){
                    return(
                        <TableCell key = {v+1} value={v+1}></TableCell>
                    )
                }
                })}                                
                </TableRow>)
    }
    renderAddUP(key, title, type, less){
        let that = this;
        var tableCells = []
        Array.apply(null, {length: this.state.firmNum? this.state.firmNum:1}).map(Number.call, Number).map(function(v){
            if(less){
                if(v+1 <= 5){
                    let k = v+1;
                    if(that.state['company_'+k]){
                        let company = that.state['company_'+k];
                        var sum = 0;
                        type.map(function(type){
                            sum = sum + (Number(company[type]) ? Number(company[type]) : 0)
                        })
                        tableCells.push(
                                <TableCell key = {v+1} value={v+1} padding="dense" >
                                    {sum}
                                </TableCell>
                        )
                    }else{
                        tableCells.push(
                            <TableCell key = {v+1} value={v+1} padding="dense" >0</TableCell>
                        )
                    }
                }
            }else{
                if(v+1 > 5){
                    let k = v+1;
                    if(that.state['company_'+k]){
                        let company = that.state['company_'+k];
                        var sum = 0;
                        type.map(function(type){
                            sum = sum + (Number(company[type]) ? Number(company[type]) : 0)
                        })
                        tableCells.push(
                                <TableCell key = {v+1} value={v+1} padding="dense" >
                                    {sum}
                                </TableCell>
                        )
                    }else{
                        tableCells.push(
                            <TableCell key = {v+1} value={v+1} padding="dense" >0</TableCell>
                        )
                    }
                    }
                }
            
        })

        return (
        <TableRow key = {key}>
            <TableCell padding="dense">
                {title}
            </TableCell>  
            {tableCells}
        </TableRow>
        )
    }
    render() {
        let classes = this.classes;
        let that = this;
        return (<div> 
                    <ApplcationBar type = 'GameSetting'/>
                    <Grid container 
                    alignItems = 'center'
                    justify = 'center'
                    height = '100%'
                    direction = 'row'>
                    <Grid item xs = {10} style={{marginTop:10}}>
                            <Typography color = "secondary" type="display1" component="h2"  > {'Room ' + this.state.roomNum} </Typography>
                            <Typography color = "secondary" type="body2" component="p"  > This page is for lecturer to set the initial setting of the game</Typography>
                    </Grid>      
                    <Grid item xs = {10}>
                    <form onSubmit={this.handleSubmit} className={classes.container} noValidate autoComplete="off">
                    <FormControlLabel
                                control={
                                    <Switch
                                    checked={this.state.playerSetting}
                                    onChange={this.handleSwitchOnChange('playerSetting')}
                                    aria-label="playerSetting"
                                    />
                                }
                                label="Player Profile"
                            />
                    <Paper style = {{display:this.state.playerSetting?'none':'block'}} className = { classes.root } elevation = { 4 } height = '100%' >
                            <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  > Player Setting </Typography>
                            <TextField
                                error = {this.state.firmNumError}
                                helperText = {this.state.firmNumHelper}
                                id="firmNum"
                                label="Number of Firms"
                                className={classes.textField}
                                onChange={this.handleTextOnChange('firmNum')}
                                type="number"
                                fullWidth
                                margin='normal'
                                required
                            />
                            <br/><br/><br/>
                            <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  > Market Information </Typography>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="market-type">Market Type</InputLabel> 
                                <Select
                                    value={this.state.marketType}
                                    onChange={this.handleSelectOnChange}
                                    input={<Input name="marketType" id="market-type" />}   
                                >
                                    <MenuItem value={'monoply'}>Monoply</MenuItem>
                                    <MenuItem value={'cournot'}>Cournot</MenuItem>
                                    <MenuItem value={'stackelberg'}>Stackelberg</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                this.state.marketType === 'stackelberg' ? 
                                <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="leader">Leader</InputLabel> 
                                <Select
                                value={this.state.leader}
                                onChange={this.handleSelectOnChange}
                                input={<Input name="leader" id="leader" />}   
                                >
                                {Array.apply(null, {length: this.state.firmNum? this.state.firmNum:1}).map(Number.call, Number).map(function(v){
                                    if(v+1 <= 10){
                                    return(
                                        <MenuItem key = {v+1} value={v+1}>{v+1}</MenuItem>
                                    )
                                }
                                })}
                                </Select>
                                </FormControl> : null
                            }
                            <br/><br/><br/>
                            <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  > Round Setting </Typography>
                            <TextField
                                error = {this.state.roundNumError}
                                helperText = {this.state.roundNumHelper}
                                id="roundNum"
                                label="Number of Rounds"
                                className={classes.textField}
                                onChange={this.handleTextOnChange('roundNum')}
                                type="number"
                                fullWidth
                                margin='normal'
                                required
                            />
                            <br/><br/><br/>
                            <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  > Demand Curve </Typography>
                            <TextField
                                error = {this.state.demandConstantError}
                                helperText = {this.state.demandConstantHelper}
                                id="demandConstant"
                                label="Constant"
                                className={classes.textField}
                                onChange={this.handleTextOnChange('demandConstant')}
                                type="number"
                                fullWidth
                                margin='normal'
                                required
                            />
                            <TextField
                                error = {this.state.demandSlopeError}
                                helperText = {this.state.demandSlopeHelper}
                                id="demandSlope"
                                label="Slope"
                                className={classes.textField}
                                onChange={this.handleTextOnChange('demandSlope')}
                                type="number"
                                fullWidth
                                margin='normal'
                                required
                            />
                            <Typography style={{marginTop:10}} color = "secondary" type="body2" component="p"  > {'Price = ' + this.state.demandConstant + ' + ' + this.state.demandSlope+' Quantity' }</Typography>
                            <br/><br/><br/>
                            <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  > Additional Setting </Typography>
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={this.state.increaseInCapacity}
                                    onChange={this.handleSwitchOnChange('increaseInCapacity')}
                                    aria-label="increaseInCapacity"
                                    />
                                }
                                label="Increase in Capacity"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={this.state.advertisementImplement}
                                    onChange={this.handleSwitchOnChange('advertisementImplement')}
                                    aria-label="advertisementImplement"
                                    />
                                }
                                label="Advertisement Implementation"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={this.state.taxComposition}
                                    onChange={this.handleSwitchOnChange('taxComposition')}
                                    aria-label="taxComposition"
                                    />
                                }
                                label="Tax Composition"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                    checked={this.state.productionDifferentiation}
                                    onChange={this.handleSwitchOnChange('productionDifferentiation')}
                                    aria-label="productionDifferentiation"
                                    />
                                }
                                label="Production Differentiation"
                            />
                            
                    </Paper>       
                    <Paper style = {{display:this.state.playerSetting?'block':'none'}} className = { classes.root } elevation = { 4 } height = '100%' >
                            <Table className={classes.table} >
                                <TableHead>
                                <TableRow>
                                <TableCell >Player Profile</TableCell>
                                {Array.apply(null, {length: this.state.firmNum? this.state.firmNum:1}).map(Number.call, Number).map(function(v){
                                    if(v+1 <= 5){
                                    return(
                                        <TableCell key = {v+1} value={v+1}>{"Company " +(v+1)}</TableCell>
                                    )
                                }
                                })}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.renderTableRowFive(1, 'Company Name', 'companyName', 'Company Name',true,null)}
                                {this.renderTableTitle(2, 'Production Cost','title')}
                                {this.renderTableRowFive(3, 'Constant', 'constant', 'Constant',true)}
                                {this.renderTableRowFive(4, 'Coefficient 1', 'coefficientOne', 'Coefficient 1',true)}
                                {this.renderTableRowFive(5, 'Coefficient 2', 'coefficientTwo', 'Coefficient 2',true)}
                                {this.renderTableRowFive(6, 'Coefficient 3', 'coefficientThree', 'Coefficient 3',true)}
                                {this.renderTableTitle(7, 'Production Capacity','title')}                          
                                {this.renderTableRowFive(8, 'Maximum', 'maximum', 'Maximum',true)}
                                {this.renderTableRowFive(9, 'Minimum', 'minimum', 'Minimum',true)}
                                {this.renderTableTitle(10, 'Balance Sheet','title',true)}                          
                                {this.renderTableTitle(11, 'Asset','subheading',true)}                          
                                {this.renderTableRowFive(12, 'Cash', 'assetCash', 'Cash',true)}
                                {this.renderTableRowFive(13, 'Plant, Property and Equipment', 'assetPPE', 'Plant..',true)}        
                                {this.renderTableRowFive(14, 'Land', 'assetLand', 'Land',true)}
                                {this.renderAddUP(15,'Total Asset',['assetCash','assetLand','assetPPE'], true)}                 
                                {this.renderTableTitle(16, 'Liabilities','subheading')}                          
                                {this.renderTableRowFive(17, 'Borrwoing', 'liabilitiesBorrwoing', 'Borrwoing',true)}
                                {this.renderAddUP(18,'Total Liabilities',['liabilitiesBorrwoing'], true)}
                                {this.renderTableTitle(19, 'Equity','subheading')}      
                                {this.renderTableRowFive(20, 'Share Capital', 'shareCapital', 'Share Capital',true)} 
                                {this.renderTableTitle(21, 'Retained Earnings',null)}
                                {this.renderTableRowFive(22, 'Beg.', 'beg', 'Beg.',true)}
                                {this.renderTableRowFive(23, 'Net income', 'netIncome', 'Net Income',true)}        
                                {this.renderAddUP(24,'Total Retained Earnings',['beg','netIncome'], true)}
                                {this.renderAddUP(25,'Total Equity',['beg','netIncome','shareCapital'], true)}
                                </TableBody>
                                </Table>
                            
                    </Paper>  
                    <Paper style = {{display:this.state.playerSetting? this.state.firmNum > 5 ? 'block':'none':'none'}} className = { classes.root } elevation = { 4 } height = '100%' >
                            <Table className={classes.table} >
                                <TableHead>
                                <TableRow>
                                <TableCell >Player Profile</TableCell>
                                {Array.apply(null, {length: this.state.firmNum? this.state.firmNum:1}).map(Number.call, Number).map(function(v){
                                    if(v+1 > 5){
                                    return(
                                        <TableCell key = {v+1} value={v+1}>{"Company " +(v+1)}</TableCell>
                                    )
                                }
                                })}
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.renderTableRowFive(1, 'Company Name', 'companyName', 'Company Name',false,null)}
                                {this.renderTableTitle(2, 'Production Cost','title')}
                                {this.renderTableRowFive(3, 'Constant', 'constant', 'Constant',false)}
                                {this.renderTableRowFive(4, 'Coefficient 1', 'coefficientOne', 'Coefficient 1',false)}
                                {this.renderTableRowFive(5, 'Coefficient 2', 'coefficientTwo', 'Coefficient 2',false)}
                                {this.renderTableRowFive(6, 'Coefficient 3', 'coefficientThree', 'Coefficient 3',false)}
                                {this.renderTableTitle(7, 'Production Capacity','title')}                          
                                {this.renderTableRowFive(8, 'Maximum', 'maximum', 'Maximum',false)}
                                {this.renderTableRowFive(9, 'Minimum', 'minimum', 'Minimum',false)}
                                {this.renderTableTitle(10, 'Balance Sheet','title',false)}                          
                                {this.renderTableTitle(11, 'Asset','subheading',false)}                          
                                {this.renderTableRowFive(12, 'Cash', 'assetCash', 'Cash',false)}
                                {this.renderTableRowFive(13, 'Plant, Property and Equipment', 'assetPPE', 'Plant..',false)}        
                                {this.renderTableRowFive(14, 'Land', 'assetLand', 'Land',false)}
                                {this.renderAddUP(15,'Total Asset',['assetCash','assetLand','assetPPE'], false)}                 
                                {this.renderTableTitle(16, 'Liabilities','subheading')}                          
                                {this.renderTableRowFive(17, 'Borrwoing', 'liabilitiesBorrwoing', 'Borrwoing',false)}
                                {this.renderAddUP(18,'Total Liabilities',['liabilitiesBorrwoing'], false)}
                                {this.renderTableTitle(19, 'Equity','subheading')}      
                                {this.renderTableRowFive(20, 'Share Capital', 'shareCapital', 'Share Capital',false)} 
                                {this.renderTableTitle(21, 'Retained Earnings',null)}
                                {this.renderTableRowFive(22, 'Beg.', 'beg', 'Beg.',false)}
                                {this.renderTableRowFive(23, 'Net income', 'netIncome', 'Net Income',false)}        
                                {this.renderAddUP(24,'Total Retained Earnings',['beg','netIncome'], false)}
                                {this.renderAddUP(25,'Total Equity',['beg','netIncome','shareCapital'], false)}
                                </TableBody>
                                </Table>
                            
                    </Paper>    
                    <Button raised color="primary" className={classes.fullWidthButton} type="submit">
                                    Submit
                            </Button>       
                    </form>

                    </Grid>
                </Grid>
                {this.renderSnackBar()}
                </div>
        );
    }
}
GameSetting.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameSetting);