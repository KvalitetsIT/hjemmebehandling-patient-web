import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import ApiContext from './_context';

import DanishDateHelper from '../globalHelpers/danishImpl/DanishDateHelper';

import React from 'react';

import ValidationService from '../services/ValidationService';
import { CollectionHelper } from '../globalHelpers/danishImpl/CollectionHelper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function MyApp({ Component, pageProps }: AppProps) : JSX.Element{

  if (process?.env.NODE_ENV === 'development') {

  }

  return (
    <>
    <div suppressHydrationWarning>
    
    <ThemeProvider theme={THEME}>
    
    <ApiContext.Provider
      value={{
        //Services
        validationService : new ValidationService(),
        
        //Helpers
        dateHelper : new DanishDateHelper(),
        collectionHelper : new CollectionHelper()
      }}
    >
      <CssBaseline />
        {typeof window === 'undefined' ? null : 
          
          <Layout>
            
              <Component {...pageProps} />
            </Layout>}
        </ApiContext.Provider>
    </ThemeProvider>
    </div>
    </>
    )
  
}

const mainBackground = "#F2F2F2"

const THEME = createTheme({
  typography: {
   "fontFamily": "verdana"
  },
  palette : {
    background : {
      default : mainBackground,
    }
  },
  components : {
    MuiDrawer : {
      defaultProps : {
        PaperProps : {
          style : {
            backgroundColor : "#942B40",
            color : "white",
            borderRadius : '0 20px 20px 0'
          }
        }
      }
    },
    MuiSvgIcon : {
      variants : [
        {
          props : {className : "sidebarIcon"},
          style : {
            color : "white",
            fontSize : 40
          }
        }
      ]
    },
    MuiAppBar : {
      variants : [
        {
          props : {color : "primary"},
          style : {
            backgroundColor : "white",
            color : "#9A2A35",
            borderRadius : '0 0 10px 10px'
          }
        }
      ]
    }
  }
});

export default MyApp
