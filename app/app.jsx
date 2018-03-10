import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
import Reboot from 'material-ui/Reboot';
import RouterWrapper from "./component/router-wrapper"
import indigo from 'material-ui/colors/indigo';
import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';
import * as colors from 'material-ui/colors';

const theme = createMuiTheme({
  palette: {
    primary:colors['blue'],
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
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
