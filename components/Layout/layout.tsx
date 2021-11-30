import { Box, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


export interface State {
  drawerIsOpen: boolean
}

export class Layout extends Component<{},State> {
  static displayName = Layout.name;

constructor(props : {}){
  super(props);
  this.state = {
    drawerIsOpen : true
  }
}

  render () : JSX.Element{

    return (
<>


<Box sx={{ display: 'flex' }}>
      

        <Router>
        
        <Box component="main" sx={{ flexGrow: 1 }}>
        
        <Topbar/>
          
          <Box paddingBottom={3}>
          </Box>
          
            <Switch>              
              <Route path="/"><Typography>Hello world - This is patient!</Typography></Route>
            </Switch>
            </Box>
        </Router>
        </Box>
        </>
    );
  }
}