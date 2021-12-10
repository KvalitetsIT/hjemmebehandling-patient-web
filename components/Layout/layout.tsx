import { Box, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UnAnsweredPage from '../../pages/questionnaire/unanswered';
import AnsweredPage from '../../pages/questionnaire/answered';
import ApiContext from '../../pages/_context';
import QuestionnaireResponseDetailsPage from '../../pages/questionnaire/[questionnaireId]/response/[questionnaireResponseId]';
import QuestionnaireResponseCreationPage from '../../pages/questionnaire/[questionnaireId]/answer';
import { ErrorBoundary } from './ErrorBoundary';
import ObservationPage from '../../pages/questionnaire/[questionnaireId]/observations';

export interface State {
  drawerIsOpen: boolean
}

export class Layout extends Component<{}, State> {
  static displayName = Layout.name;
  static contextType = ApiContext

  constructor(props: {}) {
    super(props);
    this.state = {
      drawerIsOpen: true
    }

  }


  render(): JSX.Element {




    return (
      <>
        <Box sx={{ display: 'flex' }}>
          <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)" showReloadButton={true}>
            <Router>
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Topbar />
                <Box padding={3}>
                  <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)" showReloadButton={true}>
                    <Switch>
                      <Route path="/questionnaire/:questionnaireId/response/:questionnaireResponseId" render={(props) => <QuestionnaireResponseDetailsPage {...props} />} />
                      <Route path="/questionnaire/:questionnaireId/answer" render={(props) => <QuestionnaireResponseCreationPage {...props} />} />
                      <Route path="/questionnaire/unanswered" render={(props) => <UnAnsweredPage {...props} />} />
                      <Route path="/questionnaire/answered" render={(props) => <AnsweredPage  {...props} />} />
                      <Route path="/measurements" render={(props) => <ObservationPage {...props} />} />
                      <Route path="/"><Typography>Hello world - This is patient!</Typography></Route>
                    </Switch>
                  </ErrorBoundary>
                </Box>
              </Box>
            </Router>
          </ErrorBoundary>
        </Box>
      </>
    );
  }
}