import React, { Component } from 'react';
import { Topbar } from './Topbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AnsweredPage from '../../pages/questionnaire/answered';
import ApiContext from '../../pages/_context';
import QuestionnaireResponseDetailsPage from '../../pages/questionnaire/[questionnaireId]/response/[questionnaireResponseId]';
import QuestionnaireResponseCreationPage from '../../pages/questionnaire/[questionnaireId]/answer';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary';
import { CreateToastEvent, CreateToastEventData } from '@kvalitetsit/hjemmebehandling/Events/CreateToastEvent';
import ObservationPage from '../../pages/questionnaire/[questionnaireId]/observations';
import HomePage from '../../pages/Home';
import ContactPage from '../../pages/contact';
import { CheckmarkIcon } from '../icons/Icons';
import { Toast } from '@kvalitetsit/hjemmebehandling/Errorhandling/Toast';
import AboutPage from '../../pages/about';
import { Box } from '@mui/material';

export interface State {
  drawerIsOpen: boolean,
  createToastData?: CreateToastEventData;
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

  resetToast(): void {
    this.setState({ createToastData: undefined })
  }

  render(): JSX.Element {

    //Sikker på du ønsker at forlade siden?
    window.onbeforeunload = function () {
      return "Du er på vej væk fra KoMo-systemet, ønsker du at fortsætte?"; //Det er ikke alle browsere der faktisk viser denne tekst
    };
    window.addEventListener(CreateToastEvent.eventName, (event: Event) => {
      const data = (event as CustomEvent).detail as CreateToastEventData;
      this.setState({ createToastData: data });
    });

    return (
      <>
        <Box>
          <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)" showReloadButton={true}>
            <Router>
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Topbar />
                <Box padding={3} pt={6}>
                  <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)" showReloadButton={true}>
                    {this.state.createToastData ?
                      <Toast onClose={() => this.resetToast()} icon={<CheckmarkIcon color='white' size='2rem' />} positionVertical='top' positionhorizontal='center' snackbarTitle={this.state.createToastData.title} snackbarColor='error'></Toast>
                      : <></>
                    }

                    <Switch>
                      <Route path="/questionnaire/:questionnaireId/response/:questionnaireResponseId" render={(props) => <QuestionnaireResponseDetailsPage {...props} />} />
                      <Route path="/questionnaire/:questionnaireId/answer" render={(props) => <QuestionnaireResponseCreationPage {...props} />} />
                      <Route path="/questionnaire/answered" render={(props) => <AnsweredPage  {...props} />} />
                      <Route path="/measurements" render={(props) => <ObservationPage {...props} />} />
                      <Route path="/contact" render={(props) => <ContactPage {...props} />} />
                      <Route path="/about"><AboutPage /></Route>
                      <Route path="/" render={(props) => <HomePage {...props} />} />
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
