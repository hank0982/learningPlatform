import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
import Reboot from 'material-ui/Reboot';
import RouterWrapper from "./component/router-wrapper"

const theme = createMuiTheme({
  // palette: {
  //   type: 'dark', // Switching the dark mode on is a single property value change.
  // },
});
class App extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <MuiThemeProvider theme = {theme}>
      <BrowserRouter>
        <RouterWrapper/>
      </BrowserRouter>
      </MuiThemeProvider>

    );
  }
}

export default App;
