import { Box, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UnAnsweredPage from '../../pages/questionnaire/[planDefinitionId]/unanswered';
import AnsweredPage from '../../pages/questionnaire/[planDefinitionId]/answered';
import ApiContext from '../../pages/_context';
import { PatientCareplan } from '../Models/PatientCareplan';
import ICareplanService from '../../services/interfaces/ICareplanService';

export interface State {
  drawerIsOpen: boolean
}

export class Layout extends Component<{},State> {
  static displayName = Layout.name;
  static contextType = ApiContext

  careplan! : PatientCareplan;

  constructor(props : {}){
    super(props);
    this.state = {
      drawerIsOpen : true
    }
    
  }

async componentDidMount() : Promise<void>{
  const careplanService : ICareplanService = this.context.careplanService
  this.careplan = await careplanService.GetActiveCareplan();
}

  render () : JSX.Element{
    
    
    

    return (
<>


<Box sx={{ display: 'flex' }}>
      

    <Router>
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Topbar/>
        <Switch>              
          <Route path="/questionnaire/unanswered" render={(props) => <UnAnsweredPage {...props}/>}/>
          <Route path="/questionnaire/answered" render={(props) => <AnsweredPage careplan={this.careplan} {...props}/>}/>
          <Route path="/"><Typography>Hello world - This is patient!</Typography></Route>
        </Switch>
      </Box>

    </Router>
</Box>
        </>
    );
  }
}