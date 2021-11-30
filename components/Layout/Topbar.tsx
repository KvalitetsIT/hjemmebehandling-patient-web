import { Box } from '@material-ui/core';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import React, { Component } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
export interface State {
  drawerIsOpen: boolean
}

export class Topbar extends Component<{},State> {
  static displayName = Topbar.name;


  render () : JSX.Element {
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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" textAlign="center" component="div" sx={{ flexGrow: 1 }}>
            Hjemmebehandling
          </Typography>
          <Button color="inherit">
            <PersonOutlineIcon/>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
        

        </>
    );
  }
}
