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
    borderBottom: '1px solid rgba(0, 0, 0, 0.13)'
  }
}

class CostFunction extends React.Component {
  render() {
    let { firmNum } = this.props
    let companies = Object.keys(this.props).filter(k=>k.includes('company_')).map(k => this.props[k])

    return (
      <Paper style={styles.paper}>
        <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  >Cost Function 1</Typography>
        <Section functionNo={1} companies={companies} />
        <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  >Cost Function 2</Typography>
        <Typography style={{marginTop:10}} color = "secondary" type="title" component="h2"  >Cost Function 3</Typography>
      </Paper>
    )
  }
}

class Section extends React.PureComponent {
  render() {
    let { functionNo, companies } = this.props

    return (
      <div style={styles.section}>
        <div style={styles.column}>
          <div style={styles.label}><span style={styles.span}>Constant</span></div>
        <div style={styles.hr}></div>
          <div style={styles.label}><span style={styles.span}>Slope1</span></div>
        <div style={styles.hr}></div>
          <div style={styles.label}><span style={styles.span}>Slope2</span></div>
        <div style={styles.hr}></div>
          <div style={styles.label}><span style={styles.span}>Slope3</span></div>
        <div style={styles.hr}></div>
        </div>
        {
          companies.map((company, index) => (
            <FunctionTable
              key={`${functionNo}_${index}`}
              company={company}
              companyNo={index}
              functionNo={functionNo}/>
          ))
        }
      </div>
    )
  }
}

class FunctionTable extends React.PureComponent {
  render() {
    let { company, functionNo, companyNo } = this.props
    return (
      <div style={styles.table}>
        <TextField
          id={`const-${functionNo}-${companyNo}`}
          label='Constant'
          onChange={()=>{}}
          type="number"
          margin='dense'
          style={styles.field}
        />
        <div style={styles.hr}></div>
        <TextField
          id={`slope1-${functionNo}-${companyNo}`}
          label='Slope1'
          onChange={()=>{}}
          type="number"
          margin='dense'
          style={styles.field}
        />
        <div style={styles.hr}></div>
        <TextField
          id={`slope2-${functionNo}-${companyNo}`}
          label='Slope2'
          onChange={()=>{}}
          type="number"
          margin='dense'
          style={styles.field}
        />
        <div style={styles.hr}></div>
        <TextField
          id={`slope3-${functionNo}-${companyNo}`}
          label='Slope3'
          onChange={()=>{}}
          type="number"
          margin='dense'
          style={styles.field}
        />
        <div style={styles.hr}></div>
      </div>
    )
  }
}

export default CostFunction
