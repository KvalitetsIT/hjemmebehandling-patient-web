import { Box, Grid } from '@material-ui/core';
import React, { Component } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
export interface State {
  drawerIsOpen: boolean
}

export class Topbar extends Component<{},State> {
  static displayName = Topbar.name;


  render () : JSX.Element {
    return (
        <>  
        
    <Grid component={Box} paddingRight={2} paddingBottom={3} container>
      <Grid item xs={2}>
     
           <ErrorBoundary>

            </ErrorBoundary>
 
      
      </Grid>
      <Grid item xs={8}></Grid>
      <Grid item xs={2}>
    
        <ErrorBoundary>
            </ErrorBoundary>
  
      </Grid>
    </Grid>

        </>
    );
  }
}
