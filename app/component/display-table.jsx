import React from 'react';  
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

const styles = theme => ({
    progress: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
});
  
class DisplayTable extends React.Component {  
  constructor(props){
      super(props);
      this.info = this.props.info;
      this.numberOfCompany = this.props.numberOfCompany
  }
  render() { 
    const { classes } = this.props;
    var dataTypeInCompany = ['companyName','constant','coefficientOne','coefficientTwo','coefficientThree','maximum','minimum','marketInterestRate','assetCash','assetPPE','assetLand','liabilitiesBorrwoing','shareCapital','beg','netIncome']
    var dataTypeName = ['Company Name', 'Constant', 'Coefficient 1', 'Coefficient 2', 'Coefficient 3', 'Maximum', 'Minimum', 'Market Interest Rate', 'Cash', 'Plant, Property and Equipment', 'Land','Borrwoing','Share Capital', 'Beg.', 'Net Income']
    // var profile = dataTypeInCompany.slice(0,1);
    // var profileName = dataTypeInCompany.slice(0,1);
    // var productionCost = dataTypeInCompany.slice(1,5);
    // var productionCostName = dataTypeName.slice(1,5);
    // var productionCapacity = dataTypeInCompany.slice(5,8);
    // var productionCapacityName = dataTypeName.slice(5,8);
    // var asset = dataTypeInCompany.slice(8,11);
    // var assetName = dataTypeName.slice(8,11);
    // var liabilities = dataTypeInCompany.slice(11,12);
    // var liabilitiesName = dataTypeName.slice(11,12);
    // var equity = dataTypeInCompany.slice(12,13);
    // var equityName = dataTypeName.slice(12,13);
    // var retainedEarnings = dataTypeInCompany.slice(13,14);
    // var beg
    if(this.numberOfCompany == 0){
        return null
    }else{
        let that = this;
        return(
            <Table>
                <TableHead>
                 <TableRow>
                    <TableCell padding="dense" width = '30%'>Player Profile</TableCell>
                    {
                        Array.apply(null, {length: that.numberOfCompany}).map(function(value,index){return index + 1;}).map(function(value){
                            return <TableCell>{'Company ' + value}</TableCell>
                        })
                    }
                </TableRow>
                </TableHead>
                <TableBody>
                {dataTypeInCompany.map(function(typeName, index){
                    let companyRow = [];
                    for(var i = 1; i <= that.numberOfCompany; i ++){
                        let companyData = that.info['company_'+i];
                        companyRow.push(
                            <TableCell>{companyData[typeName]}</TableCell>
                        )
                    }
                    return <TableRow><TableCell padding="dense" width = '30%'>{dataTypeName[index]}</TableCell>{companyRow}</TableRow>  
                })}
                </TableBody>
            </Table>
        )
    }
  }
}
DisplayTable.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(DisplayTable)