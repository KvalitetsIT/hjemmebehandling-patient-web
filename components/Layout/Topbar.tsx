import { Box } from '@material-ui/core';
import { AppBar, Drawer, IconButton, List, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PhoneIcon from '@mui/icons-material/Phone';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { PatientMenu } from '../Cards/PatientMenu';

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
              <Typography variant="h6" textAlign="center" component="div" sx={{ flexGrow: 1 }}>
                <span style={{fontWeight : "bold"}}>P</span>atientovervågning <span style={{fontWeight : "bold"}}>O</span>g<span style={{fontWeight : "bold"}}> U</span>d<span style={{fontWeight : "bold"}}>L</span>æggelse
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
                  <HomeIcon className="sidebarIcon" />
                </ListItemIcon>
                <ListItemText>
                  Hjem
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/questionnaire/unanswered" key="unansweredquestionnaires">
                <ListItemIcon>
                  <AssignmentIcon className="sidebarIcon" />
                </ListItemIcon>
                <ListItemText>
                  Ubesvaret spørgeskemaer
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/measurements" key="measurements">
                <ListItemIcon>
                  <AssessmentIcon className="sidebarIcon" />
                </ListItemIcon>
                <ListItemText>
                  Målinger
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/questionnaire/answered/" key="answeredquestionnaires">
                <ListItemIcon>
                  <AssignmentTurnedInIcon className="sidebarIcon" />
                </ListItemIcon>
                <ListItemText>
                  Besvaret spørgeskemaer
                </ListItemText>
              </ListItem>

              <ListItem button onClick={() => this.setState({ drawerIsOpen: false })} component={Link} to="/contact" key="contact">
                <ListItemIcon>
                  <PhoneIcon className="sidebarIcon" />
                </ListItemIcon>
                <ListItemText>
                  Kontakt hospitalet
                </ListItemText>
              </ListItem>
            </List>
          </Drawer>
        </Box>


      </>
    );
  }
}
