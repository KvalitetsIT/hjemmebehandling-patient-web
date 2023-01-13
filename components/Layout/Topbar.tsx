import { Box } from '@material-ui/core';
import { AppBar, Drawer, IconButton, List, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
import { PatientMenu } from '../Cards/PatientMenu';
import { ContactIcon, GrapphIcon, HomeIcon, SurveyIcon, AboutIcon } from '../icons/Icons';

export interface State {
  drawerIsOpen: boolean,
}

export class Topbar extends Component<{}, State> {
  static displayName = Topbar.name;

  constructor(props: {}) {
    super(props);
    this.state = {
      drawerIsOpen: false
    }
  }

  toogleMenu(): void {
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen })
  }

  render(): JSX.Element {
    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => this.toogleMenu()}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" textAlign="center" component="div" sx={{ mt: 2, flexGrow: 1 }}>
                <img height="50px" src='/assets/images/logo_fullSize.svg'></img>
              </Typography>


              <ErrorBoundary>
                <PatientMenu />
              </ErrorBoundary>

            </Toolbar>

          </AppBar>
          <Drawer
            variant="temporary"
            open={this.state.drawerIsOpen}
            onClose={() => this.toogleMenu()}
          >
            <List sx={{ width: 350 }}>
              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/" key="home">
                <ListItemIcon>
                  <HomeIcon color='white' />
                </ListItemIcon>
                <ListItemText>
                  Overblik
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/questionnaire/answered/" key="answeredquestionnaires">
                <ListItemIcon>
                  <SurveyIcon color='white'></SurveyIcon>
                </ListItemIcon>
                <ListItemText>
                  Mine spørgeskemaer
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/measurements" key="measurements">
                <ListItemIcon>
                  <GrapphIcon color='white'></GrapphIcon>
                </ListItemIcon>
                <ListItemText>
                  Mine målinger
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/contact" key="contact">
                <ListItemIcon>
                  <ContactIcon color='white'></ContactIcon>
                </ListItemIcon>
                <ListItemText>
                  Kontakt hospitalet
                </ListItemText>
              </ListItem>
            </List>

            <List className='BottomList'>
              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} color="inherit" to="/about">
                <ListItemIcon>
                  <AboutIcon size='2.2em' color='white' />
                </ListItemIcon>
                <ListItemText primary="Om KOMO" />
              </ListItem>
            </List>
          </Drawer>
        </Box>
      </>
    );
  }
}
