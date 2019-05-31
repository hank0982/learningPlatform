import React from 'react';
// node js library
import PropTypes from 'prop-types';

// material-ui library
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Snackbar from 'material-ui/Snackbar';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';

// other libraries
import { Redirect } from 'react-router';

import ApplicationBar from '../AppBar';
import CostFunction from './cost_function';

// config file
import config from '../../config';
import { findValue } from '@firebase/util';

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
    width: '100%',
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
      firmNum: 1,
      roundNum: 0,
      demandConstant: 0,
      demandSlope: 0,
      increaseInCapacity: false,
      advertisementImplement: false,
      taxComposition: false,
      productionDifferentiation: false,
      leader: 0,
      marketType: 'monoply',
      tax1: '0',
      tax2: '0',
    };
    this.state = {
      ...initPlayerSettingState,
      roomNum: this.props.match.params.id,
      playerSetting: false,
      generalSetting: false,
      companyDescription: false,
      gameStart: false,
      costFunction: false,
    };
    let that = this;
    this.classes = props.classes;
    this.socket = this.props.socket;
    this.database = this.props.database;

    this.socket.on('SUCCESS', function(data) {
      that.setState({
        open: true,
        snackbarMessage: data,
      });
    });
    this.socket.on('ERROR', function(data) {
      that.setState({
        open: true,
        snackbarMessage: data,
      });
    });
    this.socket.on('SET_GAME', function() {
      console.log('game start');
    });
    this.handleClose = () => {
      this.setState({ open: false });
    };
    this.buttonOnClick = ev => {
      ev.preventDefault();
      this.setState({
        isStudent: !this.state.isStudent,
      });
    };

    this.handleSelectOnChange = event => {
      that.setState({
        [event.target.name]: event.target.value,
      });
    };

    this.handleSwitchOnChange = name => (_event, checked) => {
      let { marketType } = this.state;

      if (
        name === 'productionDifferentiation' &&
        marketType === 'monoply' &&
        checked === true
      ) {
        this.setState({
          marketType: 'cournot',
        });
      }

      that.setState({
        [name]: checked,
      });
    };

    this.renderSnackBar = () => {
      return (
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
      );
    };

    this.handleStateChange = this.handleStateChange.bind(this);
  }
  componentDidMount() {
    var that = this;
    this.database
      .database()
      .ref(this.state.roomNum)
      .once('value', function(data) {
        var exists = data.val() !== null;
        if (exists) {
          that.setState({
            roomExist: true,
          });
        }
      });
  }
  handleTextOnChange = name => event => {
    let that = this;
    var value;
    value = event.target.value;
    this.setState({
      [name]: value,
    });
    function judge(max, min, helper) {
      if (event.target.value > max || event.target.value < min) {
        that.setState({
          [name + 'Helper']: helper,
          [name + 'Error']: true,
          [name]:
            event.target.value > max
              ? max
              : event.target.value < min
              ? min
              : event.target.value,
        });
      } else {
        that.setState({
          [name + 'Helper']: '',
          [name + 'Error']: false,
        });
      }
    }
    if (name === 'firmNum') {
      judge(10, 0, config.warning_firmNum_exception);
    }
    if (name === 'roundNum') {
      judge(10, 1, config.warning_roundNum_exception);
    }
    if (name === 'demandConstant') {
      judge(9999, 1, config.warning_demandConstant_exception);
    }
    if (name.slice(0, 'constant'.length) === 'constant') {
      judge(9999, 1, 'Please enter number from 1 to 9999');
    }
  };
  handleStateChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  handleCompanyOnChange = company => event => {
    let name = company.name;
    let companyID = company.id;
    var value = NaN;
    value = event.target.value;
    var obj = {
      ...this.state['company_' + companyID],
      [name]: value,
    };
    this.setState({
      ['company_' + companyID]: obj,
    });
  };
  renderTableRowFive(key, title, id, label, less, type = 'number') {
    let that = this;
    if (less) {
      return (
        <TableRow key={key}>
          <TableCell padding="dense" width="25%">
            {title}
          </TableCell>
          {Array.apply(null, {
            length: that.state.firmNum ? that.state.firmNum : 1,
          })
            .map(Number.call, Number)
            .map(function(v) {
              if (v + 1 <= 5) {
                let k = v + 1;
                return (
                  <TableCell key={v + 1} value={v + 1} padding="dense">
                    <TextField
                      id={id + k.toString()}
                      label={label}
                      onChange={that.handleCompanyOnChange({ name: id, id: k })}
                      className={that.classes.textField}
                      fullWidth
                      type={type}
                      margin="dense"
                    />
                  </TableCell>
                );
              }
            })}
        </TableRow>
      );
    } else {
      return (
        <TableRow key={key}>
          <TableCell padding="dense" width="25%">
            {title}
          </TableCell>
          {Array.apply(null, {
            length: this.state.firmNum ? this.state.firmNum : 1,
          })
            .map(Number.call, Number)
            .map(function(v) {
              if (v + 1 > 5) {
                let k = v + 1;
                return (
                  <TableCell key={v + 1} value={v + 1} padding="dense">
                    <TextField
                      id={id + k.toString()}
                      label={label}
                      onChange={that.handleCompanyOnChange({ name: id, id: k })}
                      className={that.classes.textField}
                      fullWidth
                      type="number"
                      margin="dense"
                    />
                  </TableCell>
                );
              }
            })}
        </TableRow>
      );
    }
  }
  renderAddUP(key, title, type, less) {
    let that = this;
    var tableCells = [];
    Array.apply(null, { length: this.state.firmNum ? this.state.firmNum : 1 })
      .map(Number.call, Number)
      .map(function(v) {
        if (less) {
          if (v + 1 <= 5) {
            let k = v + 1;
            if (that.state['company_' + k]) {
              let company = that.state['company_' + k];
              var sum = 0;
              type.map(function(type) {
                sum = sum + (Number(company[type]) ? Number(company[type]) : 0);
              });
              tableCells.push(
                <TableCell key={v + 1} value={v + 1} padding="dense">
                  {sum}
                </TableCell>,
              );
            } else {
              tableCells.push(
                <TableCell key={v + 1} value={v + 1} padding="dense">
                  0
                </TableCell>,
              );
            }
          }
        } else {
          if (v + 1 > 5) {
            let k = v + 1;
            if (that.state['company_' + k]) {
              let company = that.state['company_' + k];
              var sum = 0;
              type.map(function(type) {
                sum = sum + (Number(company[type]) ? Number(company[type]) : 0);
              });
              tableCells.push(
                <TableCell key={v + 1} value={v + 1} padding="dense">
                  {sum}
                </TableCell>,
              );
            } else {
              tableCells.push(
                <TableCell key={v + 1} value={v + 1} padding="dense">
                  0
                </TableCell>,
              );
            }
          }
        }
      });

    return (
      <TableRow key={key}>
        <TableCell padding="dense">{title}</TableCell>
        {tableCells}
      </TableRow>
    );
  }
  handleSubmit = ev => {
    ev.preventDefault();
    let that = this;
    let printerror = false;
    var companys = {};
    let {
      tax1,
      tax2,
      advertisementImplement,
      productionDifferentiation,
      investmentCostA,
      investmentCostB,
    } = this.state;
    var dataTypeInCompany = [
      'companyDescription',
      'marketInterestRate',
      'constant',
      'coefficientOne',
      'coefficientTwo',
      'coefficientThree',
      'maximum',
      'minimum',
      'assetCash',
      'assetPPE',
      'assetLand',
      'liabilitiesBorrwoing',
      'shareCapital',
      'beg',
      'netIncome',
    ];

    for (let i = 1; i <= that.state.firmNum; i++) {
      if (!that.state['company_' + i]) {
        printerror = true;
        break;
      } else {
        let company = that.state['company_' + i];
        // if(increaseInCapacity) {
        // }
        // else if(productionDifferentiation === true) {
        // Object.keys(company).forEach((key) => {
        // if(key.includes('slope')) slopes[key] = company[key]
        // if(advertisementImplement === true && key.includes('adv')) advs[key] = company[key]
        // })
        // }
        companys['company_' + i] = { ...company };
        dataTypeInCompany.map(function(type) {
          if (!company[type]) {
            printerror = true;
            return;
          }
        });
      }
    }
    var roomInfo = {
      roomNum: this.state.roomNum,
      firmNum: this.state.firmNum,
      marketType: this.state.marketType,
      roundNum: this.state.roundNum,
      constant: this.state.demandConstant, //
      slope: this.state.demandSlope, //
      increaseInCapacity: this.state.increaseInCapacity,
      advertisementImplement: advertisementImplement,
      taxComposition: this.state.taxComposition,
      gameRule: this.state.gameRule,
      goalOfFirms: this.state.goalOfFirms,
      marketDescription: this.state.marketDescription,
      descriptionOfFirms: this.state.descriptionOfFirms,
      productionDifferentiation: productionDifferentiation,
      tax1: tax1,
      tax2: tax2,
      investmentCostA: investmentCostA || 0,
      investmentCostB: investmentCostB || 0,
    };
    if (roomInfo.marketType == 'stackelberg') {
      roomInfo = {
        ...roomInfo,
        leader: this.state.leader,
      };
    }
    var transferData = {
      ...companys,
      roomInfo: roomInfo,
      timeStamp: new Date(),
      roomNum: this.state.roomNum,
    };
    if (
      (transferData.roomInfo.constant || productionDifferentiation) &&
      transferData.roomInfo.firmNum &&
      (transferData.roomInfo.slope || productionDifferentiation) &&
      transferData.roomInfo.roundNum &&
      !printerror
    ) {
      this.socket.emit('GAME_SETTING', transferData);
      this.database
        .database()
        .ref(transferData.roomInfo.roomNum)
        .child('on')
        .set(transferData, function(err) {
          if (err) {
            console.log(err);
          } else {
            that.database
              .database()
              .ref(transferData.roomInfo.roomNum)
              .child('on')
              .child('console')
              .push()
              .set(
                {
                  time: new Date().toLocaleString('en-GB', {
                    timeZone: 'Asia/Hong_Kong',
                  }),
                  message: 'Successfully created Room.' + transferData.roomNum,
                },
                function(err) {
                  if (err) {
                    console.log(err);
                  }
                },
              )
              .then(function() {
                that.database
                  .database()
                  .ref(transferData.roomInfo.roomNum)
                  .child('on')
                  .child('round')
                  .set({
                    currentRound: 1,
                    roundStarted: false,
                    previousRoundData: null,
                    endroundbutton: true,
                  })
                  .then(function() {
                    that.setState({
                      gameStart: true,
                    });
                  });
              });
          }
        });
    } else {
      that.setState({
        open: true,
        snackbarMessage: 'WARNING! Please provide sufficient data',
      });
    }
  };
  defaultValue() {
    var transferData = {
      timeStamp: new Date(),
      roomNum: this.state.roomNum,
    };
    let {
      taxComposition,
      advertisementImplement,
      productionDifferentiation,
      increaseInCapacity,
      company_1,
      company_2,
      company_3,
      company_4,
    } = this.state;
    var that = this;
    this.database
      .database()
      .ref(1997083101)
      .once('value', function(data) {
        var d = data.val();
        d.on.roomNum = transferData.roomNum;
        d.roomNum = transferData.roomNum;
        d.on.roomInfo.roomNum = transferData.roomNum;
        d.on.roomInfo.taxComposition = taxComposition;
        d.on.roomInfo.advertisementImplement = advertisementImplement;
        d.on.roomInfo.productionDifferentiation = productionDifferentiation;
        d.on.roomInfo.increaseInCapacity = increaseInCapacity;

        if (productionDifferentiation) {
          let df = {
            slope1: '-4.32',
            slope2: '-4.32',
            slope3: '-4.32',
            slope4: '-4.32',
            constant: '1500',
          };
          if (advertisementImplement)
            df = {
              ...df,
              adver1: '1.1',
              adver2: '1.1',
              adver3: '1.1',
              adver4: '1.1',
            };
          d.on.company_1 = company_1
            ? { ...d.on.company_1, ...df, ...company_1 }
            : { ...d.on.company_1, ...df };
          d.on.company_2 = company_2
            ? { ...d.on.company_2, ...df, ...company_2 }
            : { ...d.on.company_2, ...df };
          d.on.company_3 = company_3
            ? { ...d.on.company_3, ...df, ...company_3 }
            : { ...d.on.company_3, ...df };
          d.on.company_4 = company_4
            ? { ...d.on.company_4, ...df, ...company_4 }
            : { ...d.on.company_4, ...df };
        }

        if (increaseInCapacity) {
          let df = {
            cf1_slope1: '-4.32',
            cf1_slope2: '-4.32',
            cf1_slope3: '-4.32',
            cf1_constant: '1500',
            cf2_slope1: '-3.32',
            cf2_slope2: '-3.32',
            cf2_slope3: '-3.32',
            cf2_constant: '750',
            cf3_slope1: '-2.32',
            cf3_slope2: '-2.32',
            cf3_slope3: '-2.32',
            cf3_constant: '375',
          };
          d.on.roomInfo.investmentCostA = 1000;
          d.on.roomInfo.investmentCostB = 5000;
          d.on.company_1 = company_1
            ? { ...d.on.company_1, ...df, ...company_1 }
            : { ...d.on.company_1, ...df };
          d.on.company_2 = company_2
            ? { ...d.on.company_2, ...df, ...company_2 }
            : { ...d.on.company_2, ...df };
          d.on.company_3 = company_3
            ? { ...d.on.company_3, ...df, ...company_3 }
            : { ...d.on.company_3, ...df };
          d.on.company_4 = company_4
            ? { ...d.on.company_4, ...df, ...company_4 }
            : { ...d.on.company_4, ...df };
        }

        that.database
          .database()
          .ref(transferData.roomNum)
          .set(d);
        that.socket.emit('GAME_SETTING', transferData);
        that.database
          .database()
          .ref(transferData.roomNum)
          .child('on')
          .child('console')
          .push()
          .set(
            {
              time: new Date().toLocaleString('en-GB', {
                timeZone: 'Asia/Hong_Kong',
              }),
              message: 'Successfully created Room.' + transferData.roomNum,
            },
            function(err) {
              if (err) {
                console.log(err);
              }
            },
          )
          .then(function() {
            that.database
              .database()
              .ref(transferData.roomNum)
              .child('on')
              .child('round')
              .set({
                currentRound: 1,
                roundStarted: false,
                previousRoundData: null,
                endroundbutton: true,
              })
              .then(function() {
                that.setState({
                  gameStart: true,
                });
              });
          });
      });
  }
  renderTable(less) {
    let classes = this.classes;
    let {
      productionDifferentiation,
      advertisementImplement,
      firmNum,
      increaseInCapacity,
    } = this.state;
    let slopes = [];
    let advs = [];

    if (productionDifferentiation === true) {
      for (let i = 1; i <= firmNum; i++) {
        slopes.push(
          this.renderTableRowFive(
            `slope28-${i}`,
            `Slope${i}`,
            `slope${i}`,
            `Slope${i}`,
            less,
          ),
        );

        if (advertisementImplement === true) {
          advs.push(
            this.renderTableRowFive(
              `adv29-${i}`,
              `Ad Slope${i}`,
              `adver${i}`,
              `Ad Slope${i}`,
              less,
            ),
          );
        }
      }
    }

    return (
      <div>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="title"
          component="h2">
          {' '}
          {config.player_profile_title}{' '}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(
              1,
              'Company Name',
              'companyName',
              'Company Name',
              less,
              null,
            )}
          </TableBody>
        </Table>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="title"
          component="h2">
          {' '}
          {config.production_cost}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(
              3,
              'Constant',
              'constant',
              'Constant',
              less,
            )}
            {this.renderTableRowFive(
              4,
              'Coefficient 1',
              'coefficientOne',
              'Coefficient 1',
              less,
            )}
            {this.renderTableRowFive(
              5,
              'Coefficient 2',
              'coefficientTwo',
              'Coefficient 2',
              less,
            )}
            {this.renderTableRowFive(
              6,
              'Coefficient 3',
              'coefficientThree',
              'Coefficient 3',
              less,
            )}
          </TableBody>
        </Table>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="title"
          component="h2">
          {' '}
          {config.production_capacity}{' '}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(8, 'Maximum', 'maximum', 'Maximum', less)}
            {this.renderTableRowFive(9, 'Minimum', 'minimum', 'Minimum', less)}
            {this.renderTableRowFive(
              26,
              'Market Interest Rate',
              'marketInterestRate',
              'Rate',
              less,
            )}
          </TableBody>
        </Table>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="title"
          component="h2">
          {' '}
          {config.balance_sheet}
        </Typography>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="body1"
          component="h2">
          {' '}
          {config.asset}{' '}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(12, 'Cash', 'assetCash', 'Cash', less)}
            {this.renderTableRowFive(
              13,
              'Plant, Property and Equipment',
              'assetPPE',
              'Plant..',
              less,
            )}
            {this.renderTableRowFive(14, 'Land', 'assetLand', 'Land', less)}
            {this.renderAddUP(
              15,
              'Total Asset',
              ['assetCash', 'assetLand', 'assetPPE'],
              less,
            )}
          </TableBody>
        </Table>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="body1"
          component="h2">
          {' '}
          {config.liabilities}{' '}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(
              17,
              'Borrwoing',
              'liabilitiesBorrwoing',
              'Borrwoing',
              less,
            )}
            {this.renderAddUP(
              18,
              'Total Liabilities',
              ['liabilitiesBorrwoing'],
              less,
            )}
          </TableBody>
        </Table>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="body1"
          component="h2">
          {' '}
          Equity{' '}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(
              20,
              'Share Capital',
              'shareCapital',
              'Share Capital',
              less,
            )}
          </TableBody>
        </Table>
        <Typography
          style={{ marginTop: 10 }}
          color="secondary"
          type="body1"
          component="h2">
          {' '}
          Retained Earnings{' '}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderTableRowFive(22, 'Beg.', 'beg', 'Beg.', less)}
            {this.renderTableRowFive(
              23,
              'Net income',
              'netIncome',
              'Net Income',
              less,
            )}
            {this.renderAddUP(
              24,
              'Total Retained Earnings',
              ['beg', 'netIncome'],
              less,
            )}
            {this.renderAddUP(
              25,
              'Total Equity',
              ['beg', 'netIncome', 'shareCapital'],
              less,
            )}
          </TableBody>
        </Table>
        {productionDifferentiation && !increaseInCapacity && (
          <Typography
            style={{ marginTop: 10 }}
            color="secondary"
            type="title"
            component="h2">
            Demand Curve
          </Typography>
        )}
        {productionDifferentiation && !increaseInCapacity && (
          <Table className={classes.table}>
            <TableBody>
              {this.renderTableRowFive(
                27,
                'dConstant',
                'dconstant',
                'dConstant',
                less,
              )}
              {slopes}
            </TableBody>
          </Table>
        )}
        {productionDifferentiation && advertisementImplement && (
          <Typography
            style={{ marginTop: 10 }}
            color="secondary"
            type="title"
            component="h2">
            Advertising
          </Typography>
        )}
        {productionDifferentiation && advertisementImplement && (
          <Table className={classes.table}>
            <TableBody>{advs}</TableBody>
          </Table>
        )}
      </div>
    );
  }
  renderDescription() {
    let that = this;
    let classes = this.classes;
    var description = [];
    for (var i = 1; i <= that.state.firmNum; i++) {
      description.push(
        <TextField
          key={'company' + i}
          id={'company_' + i + ' Des'}
          label={'Company ' + i + ' Description'}
          multiline
          onChange={that.handleCompanyOnChange({
            name: 'companyDescription',
            id: i,
          })}
          className={classes.textField}
          margin="normal"
          fullWidth
        />,
      );
    }
    return description;
  }

  getPriceFunString() {
    const {
      productionDifferentiation,
      advertisementImplement,
      demandConstant,
      demandSlope,
      firmNum,
    } = this.state;

    const firmNumValue = parseInt(firmNum, 10);

    if (productionDifferentiation) {
      let string = `  Price(1) = Contant `;

      for (let i = 1; i <= firmNumValue; i++) {
        string = `${string} + Slop${i}*Quntity${i}`;
      }

      if (advertisementImplement) {
        for (let i = 1; i <= firmNumValue; i++) {
          string = `${string} ${i === 1 ? '+' : '-'} Slop${i}*Advertising${i}`;
        }
      }
      return string;
    } else {
      return ` Price = ${demandConstant} + ${demandSlope} Quntity`;
    }
  }

  render() {
    let classes = this.classes;
    let that = this;
    let {
      productionDifferentiation,
      taxComposition,
      increaseInCapacity,
      companyDescription: companyPage,
      playerSetting: playerSettingPage,
      generalSetting: generalSettingPage,
      costFunction: costFunctionPage,
    } = this.state;
    let gameSettingPage =
      !playerSettingPage &&
      !companyPage &&
      !generalSettingPage &&
      !costFunctionPage;

    if (this.state.gameStart) {
      return <Redirect to={'/teacher_gamestart/' + that.state.roomNum} />;
    } else if (this.state.roomExist) {
      return <Redirect to={'/teacher_gamestart/' + that.state.roomNum} />;
    } else {
      return (
        <div>
          <ApplicationBar type="GameSetting" />
          <Grid
            container
            alignItems="center"
            justify="center"
            height="100%"
            direction="row">
            <Grid item xs={10} style={{ marginTop: 10 }}>
              <Typography color="secondary" type="display1" component="h2">
                {' '}
                {'Room ' + this.state.roomNum}{' '}
              </Typography>
              <Typography color="secondary" type="body2" component="p">
                {' '}
                This page is for lecturer to set the initial setting of the game
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <form
                onSubmit={this.handleSubmit}
                className={classes.container}
                noValidate
                autoComplete="off">
                <FormControlLabel
                  style={{
                    display:
                      companyPage || generalSettingPage || costFunctionPage
                        ? 'none'
                        : null,
                  }}
                  control={
                    <Switch
                      checked={this.state.playerSetting}
                      onChange={this.handleSwitchOnChange('playerSetting')}
                      aria-label="playerSetting"
                    />
                  }
                  label="Player Profile"
                />
                <FormControlLabel
                  style={{
                    display:
                      generalSettingPage ||
                      playerSettingPage ||
                      costFunctionPage
                        ? 'none'
                        : null,
                  }}
                  control={
                    <Switch
                      checked={this.state.companyDescription}
                      onChange={this.handleSwitchOnChange('companyDescription')}
                      aria-label="companyDescription"
                    />
                  }
                  label="Company Description"
                />
                <FormControlLabel
                  style={{
                    display:
                      companyPage || playerSettingPage || costFunctionPage
                        ? 'none'
                        : null,
                  }}
                  control={
                    <Switch
                      checked={this.state.generalSetting}
                      onChange={this.handleSwitchOnChange('generalSetting')}
                      aria-label="generalSetting"
                    />
                  }
                  label="General Setting"
                />
                <FormControlLabel
                  style={{
                    display:
                      companyPage || playerSettingPage || generalSettingPage
                        ? 'none'
                        : null,
                  }}
                  control={
                    <Switch
                      checked={costFunctionPage}
                      onChange={this.handleSwitchOnChange('costFunction')}
                      aria-label="costFunction"
                    />
                  }
                  label="Cost Function"
                  disabled={!increaseInCapacity}
                />
                <Paper
                  style={{ display: gameSettingPage ? 'block' : 'none' }}
                  className={classes.root}
                  elevation={4}
                  height="100%">
                  <Typography
                    style={{ marginTop: 10 }}
                    color="secondary"
                    type="title"
                    component="h2">
                    {' '}
                    Player Setting{' '}
                  </Typography>
                  <TextField
                    error={this.state.firmNumError}
                    helperText={this.state.firmNumHelper}
                    id="firmNum"
                    label="Number of Firms"
                    className={classes.textField}
                    onChange={this.handleTextOnChange('firmNum')}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                  />
                  <br />
                  <br />
                  <br />
                  <Typography
                    style={{ marginTop: 10 }}
                    color="secondary"
                    type="title"
                    component="h2">
                    {' '}
                    Market Information{' '}
                  </Typography>
                  <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="market-type">Market Type</InputLabel>
                    <Select
                      value={this.state.marketType}
                      onChange={this.handleSelectOnChange}
                      input={<Input name="marketType" id="market-type" />}>
                      {!this.state.productionDifferentiation && (
                        <MenuItem value={'monoply'}>Monoply</MenuItem>
                      )}
                      <MenuItem value={'cournot'}>Cournot</MenuItem>
                      <MenuItem value={'stackelberg'}>Stackelberg</MenuItem>
                    </Select>
                  </FormControl>
                  {this.state.marketType === 'stackelberg' ? (
                    <FormControl fullWidth margin="normal">
                      <InputLabel htmlFor="leader">Leader</InputLabel>
                      <Select
                        value={this.state.leader}
                        onChange={this.handleSelectOnChange}
                        input={<Input name="leader" id="leader" />}>
                        {Array.apply(null, {
                          length: this.state.firmNum ? this.state.firmNum : 1,
                        })
                          .map(Number.call, Number)
                          .map(function(v) {
                            if (v + 1 <= 10) {
                              return (
                                <MenuItem key={v + 1} value={v + 1}>
                                  {v + 1}
                                </MenuItem>
                              );
                            }
                          })}
                      </Select>
                    </FormControl>
                  ) : null}
                  <br />
                  <br />
                  <br />
                  <Typography
                    style={{ marginTop: 10 }}
                    color="secondary"
                    type="title"
                    component="h2">
                    {' '}
                    Round Setting{' '}
                  </Typography>
                  <TextField
                    error={this.state.roundNumError}
                    helperText={this.state.roundNumHelper}
                    id="roundNum"
                    label="Number of Rounds"
                    className={classes.textField}
                    onChange={this.handleTextOnChange('roundNum')}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                  />
                  <br />
                  <br />
                  <br />
                  {!this.state.productionDifferentiation && (
                    <div>
                      <Typography
                        style={{ marginTop: 10 }}
                        color="secondary"
                        type="title"
                        component="h2">
                        {' '}
                        Demand Curve{' '}
                      </Typography>
                      <TextField
                        error={this.state.demandConstantError}
                        helperText={this.state.demandConstantHelper}
                        id="demandConstant"
                        label="Constant"
                        className={classes.textField}
                        onChange={this.handleTextOnChange('demandConstant')}
                        type="number"
                        fullWidth
                        margin="normal"
                        required
                      />
                      <TextField
                        error={this.state.demandSlopeError}
                        helperText={this.state.demandSlopeHelper}
                        id="demandSlope"
                        label="Slope"
                        className={classes.textField}
                        onChange={this.handleTextOnChange('demandSlope')}
                        type="number"
                        fullWidth
                        margin="normal"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Typography
                      style={{ marginTop: 10 }}
                      color="secondary"
                      type="body2"
                      component="p">
                      {this.getPriceFunString.bind(this)()}
                    </Typography>
                  </div>
                  {taxComposition === true && (
                    <div>
                      <Typography
                        style={{ marginTop: 10 }}
                        color="secondary"
                        type="title"
                        component="h2">
                        Tax
                      </Typography>
                      <TextField
                        error={this.state.demandConstantError}
                        helperText={this.state.demandConstantHelper}
                        id="tax1"
                        label="Tax1"
                        className={classes.textField}
                        onChange={this.handleTextOnChange('tax1')}
                        type="number"
                        fullWidth
                        margin="normal"
                        required
                      />
                      <TextField
                        error={this.state.demandSlopeError}
                        helperText={this.state.demandSlopeHelper}
                        id="tax2"
                        label="Tax2"
                        className={classes.textField}
                        onChange={this.handleTextOnChange('tax2')}
                        type="number"
                        fullWidth
                        margin="normal"
                        required
                      />
                    </div>
                  )}
                  <br />
                  <br />
                  <br />
                  <Typography
                    style={{ marginTop: 10 }}
                    color="secondary"
                    type="title"
                    component="h2">
                    {' '}
                    Additional Settings{' '}
                  </Typography>
                  {[
                    {
                      label: 'Production Technology',
                      stateName: 'increaseInCapacity',
                    },
                    {
                      label: 'Advertisement',
                      stateName: 'advertisementImplement',
                    },
                    { label: 'Tax', stateName: 'taxComposition' },
                    {
                      label: 'Production Differentiation',
                      stateName: 'productionDifferentiation',
                    },
                  ].map(
                    function(data, index) {
                      return (
                        <FormControlLabel
                          key={data.stateName + index}
                          control={
                            <Switch
                              checked={this.state[data.stateName]}
                              onChange={this.handleSwitchOnChange(
                                data.stateName,
                              )}
                              aria-label={data.stateName}
                              disabled={
                                (data.label === 'Advertisement'
                                  ? !productionDifferentiation
                                  : false) ||
                                (data.label !== 'Production Technology'
                                  ? increaseInCapacity
                                  : false)
                              }
                            />
                          }
                          label={data.label}
                        />
                      );
                    }.bind(this),
                  )}
                </Paper>
                <Paper
                  style={{ display: companyPage ? 'block' : 'none' }}
                  className={classes.root}
                  elevation={4}
                  height="100%">
                  <Typography
                    style={{ marginTop: 10 }}
                    color="secondary"
                    type="title"
                    component="h2">
                    {' '}
                    Company Description{' '}
                  </Typography>
                  {this.renderDescription()}
                </Paper>
                <Paper
                  style={{
                    display: this.state.playerSetting ? 'block' : 'none',
                  }}
                  className={classes.root}
                  elevation={4}
                  height="100%">
                  {this.renderTable(true)}
                </Paper>
                <Paper
                  style={{
                    display: this.state.playerSetting
                      ? this.state.firmNum > 5
                        ? 'block'
                        : 'none'
                      : 'none',
                  }}
                  className={classes.root}
                  elevation={4}
                  height="100%">
                  {this.renderTable(false)}
                </Paper>
                {costFunctionPage && (
                  <CostFunction
                    {...this.state}
                    handleCompanyChange={this.handleCompanyOnChange}
                    handleStateChange={this.handleStateChange}
                    handleTextChange={this.handleTextOnChange}
                  />
                )}
                <Paper
                  style={{ display: generalSettingPage ? 'block' : 'none' }}
                  className={classes.root}
                  elevation={4}
                  height="100%">
                  {[
                    { title: 'Game Rules', idLabel: 'gameRule' },
                    {
                      title: 'Description Of Firms',
                      idLabel: 'descriptionOfFirms',
                    },
                    {
                      title: 'Model of Market Structure',
                      idLabel: 'marketDescription',
                    },
                    { title: "Firm's Objective", idLabel: 'goalOfFirms' },
                  ].map(
                    function(data) {
                      return (
                        <div>
                          <Typography
                            style={{ marginTop: 10 }}
                            color="secondary"
                            type="title"
                            component="h2">
                            {' '}
                            {data.title}{' '}
                          </Typography>
                          <TextField
                            id={data.idLabel}
                            label={data.title}
                            multiline
                            className={classes.textField}
                            onChange={this.handleTextOnChange(data.idLabel)}
                            margin="normal"
                            fullWidth
                          />
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>
                      );
                    }.bind(this),
                  )}
                </Paper>
                <Button
                  raised
                  color="primary"
                  className={classes.fullWidthButton}
                  type="submit">
                  Submit
                </Button>
                <Button
                  raised
                  color="primary"
                  className={classes.fullWidthButton}
                  type="button"
                  onClick={this.defaultValue.bind(this)}>
                  Default value
                </Button>
              </form>
            </Grid>
          </Grid>
          {this.renderSnackBar()}
        </div>
      );
    }
  }
}
GameSetting.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameSetting);
