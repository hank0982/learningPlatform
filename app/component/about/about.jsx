import React from 'react';  
import ApplcationBar from '../AppBar';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import withStyles from 'material-ui';

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div>
                <ApplcationBar type='about'/>
                <Grid container alignItems='center' justify='center' height='100%'>
                    <Paper elevation={4} height='100%'>
                        <Typography align="center" type="headline" component="h1">
                            about us!
                        </Typography>
                    </Paper>
                </Grid>
            </div>
        )
    }
}