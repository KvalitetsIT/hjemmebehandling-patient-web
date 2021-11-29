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

const greenBg = "rgb(208,239,219)"
const greenText = "green"

const yellowBg = "rgb(253,239,208)"
const yellowText = "rgb(224,158,70)"

const redBg = "rgb(247,216,216)"
const redText = "rgb(234,124,123)"

const blueBg = "rgb(232,239,247)"
const blueText = "rgb(133,135,138)"

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
    MuiAvatar : {
      styleOverrides : {
        root : {
          borderRadius : 10
        }
      }
    },
    MuiAlert : {
      styleOverrides : {
        root : {
          borderRadius : 28
        }
      }
    },
    MuiCard : {
      styleOverrides : {
        root : {
          borderRadius : 20
        }
      }
    },
    MuiChip : {
      styleOverrides : {
        root : {
          borderRadius : 28,
        },
        label : {
          padding : 0
        }
      },
      variants : [
        {
          props: { className:"round" },
          style: {
            height : 50,
            width : 50,
            borderRadius : 100,
            fontWeight : "bold",
          },
        },
        {
          props: { variant: "filled", color: "success", },
          style: {
            backgroundColor : greenBg,
            color : greenText
          },
        },
        {
          props : {variant: "filled", color : "warning"},
          style : {
            backgroundColor : yellowBg,
            color : yellowText
          }
        },
        {
          props : {variant: "filled", color : "error"},
          style : {
            backgroundColor : redBg,
            color : redText
          }
        },
        {
          props : {variant: "filled", color : "primary"},
          style : {
            backgroundColor : blueBg,
            color : blueText
          }
        }
      ]
    },
    MuiButton : {
      styleOverrides : {
        root : {
          borderRadius : 28
        }
      }
    }
  }
});

export default MyApp
