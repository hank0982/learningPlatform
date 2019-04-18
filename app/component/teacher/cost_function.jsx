import React from "react";
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

const styles = {
  paper: {
    padding: '8px 24px',
  },
  section: {
    display: 'flex',
    marginLeft: 24,
  },
  column: {
    minWidth: 80,
  },
  table: {
    flexGrow: 1,
    flexBasis: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  label: {
    width: 300,
    height: '57px',
    display: 'flex',
    alignItems: 'center',
  },
  span: {
    fontSize: 13,
  },
  field: {
    marginLeft: '10px',
    marginRight: '10px'
  },
  hr: {
    marginTop: 3,
    borderBottom: '1px solid rgba(0, 0, 0, 0.13)'
  },
  fieldContainer: {
    padding: '0px 10px',
  }
}

class CostFunction extends React.Component {
  componentDidMount() {
    let { firmNum, handleStateChange } = this.props
    let companies = Object.keys(this.props).filter(k=>k.includes('company_')).map(k => this.props[k]).slice(0, firmNum)
    for(let i = 1; i <= firmNum; i++) {
      if(!this.props[`company_${i}`]) {
        handleStateChange(`company_${i}`, {})
      }
    }
  }

  render() {
    let { firmNum, handleCompanyChange, handleTextChange, investmentCostA, investmentCostB } = this.props
    let companies = Object.keys(this.props).filter(k=>k.includes('company_')).map(k => this.props[k]).slice(0, firmNum)

    return (
      <Paper style={styles.paper}>
        <div style={styles.section}>
          <div style={styles.label}>
            <span style={styles.span}>Investment Cost A</span>
          </div>
          <TextField
            id="investment-costa"
            onChange={handleTextChange('investmentCostA')}
            value={investmentCostA}
            label='Invast Cost (A)'
            type="number"
            margin='dense'
            fullWidth={true}
            style={styles.field}
          />
          <div style={styles.hr}></div>
          <div style={styles.label}>
            <span style={styles.span}>Investment Cost B</span>
          </div>
          <TextField
            id="`investment-costa"
            onChange={handleTextChange('investmentCostB')}
            value={investmentCostB}
            label='Invast Cost (B)'
            type="number"
            margin='dense'
            fullWidth={true}
            style={styles.field}
          />
          <div style={styles.hr}></div>
        </div>
        <div style={{marginTop: 30, ...styles.section}}>
          {companies.map((company, index) => (
            <div key={`company-name-${index}`} style={{marginLeft: index === 0 ? 300 : 0, ...styles.table}}>
              <span style={{margin: '0 20px', fontSize: 24, fontWeight: 'bold'}}>{company.companyName || `Firm ${index+1}`}</span>
            </div>
          ))
          }
        </div>
        <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2" >Cost Function 1</Typography>
        <Section functionNo={1} companies={companies} handleCompanyChange={handleCompanyChange}/>
        <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2" >Cost Function 2</Typography>
        <Section functionNo={2} companies={companies} handleCompanyChange={handleCompanyChange}/>
        <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2" >Cost Function 3</Typography>
        <Section functionNo={3} companies={companies} handleCompanyChange={handleCompanyChange}/>
      </Paper>
    )
  }
}

class Section extends React.PureComponent {
  render() {
    let { functionNo, companies, handleCompanyChange } = this.props

    return (
      <div style={styles.section}>
        <div style={styles.column}>
          <div style={styles.label}><span style={styles.span}>Constant</span>
        </div>
        <div style={styles.hr}></div>
        <div style={styles.label}>
          <span style={styles.span}>Slope1</span>
        </div>
        <div style={styles.hr}></div>
        <div style={styles.label}>
          <span style={styles.span}>Slope2</span>
        </div>
        <div style={styles.hr}></div>
        <div style={styles.label}>
          <span style={styles.span}>Slope3</span>
        </div>
        <div style={styles.hr}></div>
      </div>
      {
        companies.map((company, index) => (
          <FunctionTable
            key={`${functionNo}_${index}`}
            handleCompanyChange={handleCompanyChange}
            company={company}
            companyNo={index+1}
            functionNo={functionNo}/>
        ))
      }
    </div>
    )
  }
}

class FunctionTable extends React.PureComponent {
  render() {
    let { company, functionNo, companyNo, handleCompanyChange } = this.props

    return (
      <div style={styles.table}>
        <div style={styles.fieldContainer}>
          <TextField
            id={`const-${functionNo}-${companyNo}`}
            onChange={handleCompanyChange({name: `cf${functionNo}_const`, id:companyNo})}
            value={company[`cf${functionNo}_const`]}
            label='Constant'
            type="number"
            margin='dense'
            fullWidth={true}
            style={styles.field}
          />
        </div>
        <div style={styles.hr}></div>
        <div style={styles.fieldContainer}>
          <TextField
            id={`slope1-${functionNo}-${companyNo}`}
            onChange={handleCompanyChange({name: `cf${functionNo}_slope1`, id:companyNo})}
            value={company[`cf${functionNo}_slope1`]}
            label='Slope1'
            type="number"
            margin='dense'
            fullWidth={true}
            style={styles.field}
          />
        </div>
        <div style={styles.hr}></div>
        <div style={styles.fieldContainer}>
          <TextField
            id={`slope2-${functionNo}-${companyNo}`}
            onChange={handleCompanyChange({name: `cf${functionNo}_slope2`, id:companyNo})}
            value={company[`cf${functionNo}_slope2`]}
            label='Slope2'
            type="number"
            margin='dense'
            fullWidth={true}
            style={styles.field}
          />
        </div>
        <div style={styles.hr}></div>
        <div style={styles.fieldContainer}>
          <TextField
            id={`slope3-${functionNo}-${companyNo}`}
            onChange={handleCompanyChange({name: `cf${functionNo}_slope3`, id:companyNo})}
            value={company[`cf${functionNo}_slope3`]}
            label='Slope3'
            type="number"
            margin='dense'
            fullWidth={true}
            style={styles.field}
          />
        </div>
        <div style={styles.hr}></div>
      </div>
    )
  }
}

export default CostFunction
