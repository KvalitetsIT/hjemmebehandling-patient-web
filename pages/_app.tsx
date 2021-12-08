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
import { ErrorBoundary } from '../components/Layout/ErrorBoundary';
import FakeQuestionnaireResponseApi from '../apis/FakeImpl/FakeQuestionnaireResponseApi';
import QuestionnaireResponseService from '../services/QuestionnaireResponseService';

import CareplanService from '../services/CareplanService';
import FakeCareplanApi from '../apis/FakeImpl/FakeCareplanApi';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {


  const questionnaireResponseApi = new FakeQuestionnaireResponseApi();
  const careplanApi = new FakeCareplanApi();

  if (process?.env.NODE_ENV === 'development') {

  }

  return (
    <>
      <div suppressHydrationWarning>

        <ThemeProvider theme={THEME}>

          <ApiContext.Provider
            value={{
              //Services
              questionnaireResponseService: new QuestionnaireResponseService(questionnaireResponseApi),
              careplanService: new CareplanService(careplanApi),

              //Helpers
              validationService: new ValidationService(),
              dateHelper: new DanishDateHelper(),
              collectionHelper: new CollectionHelper()
            }}
          >
            <CssBaseline />
            {typeof window === 'undefined' ? null :

              <Layout>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>}
          </ApiContext.Provider>
        </ThemeProvider>
      </div>
    </>
  )

}

const mainBackground = "#F2F2F2"
const regionMidtRed = "rgb(153,0,51)"

const THEME = createTheme({
  typography: {
    "fontFamily": "verdana, sans-serif"
  },
  palette: {
    background: {
      default: mainBackground,
    }
  },
  components: {
    MuiDrawer: {
      defaultProps: {
        PaperProps: {
          style: {
            backgroundColor: regionMidtRed,
            color: "white",
            borderRadius: '0 20px 20px 0'
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        subheader : {
          color : regionMidtRed
        }
      }
    },
    MuiCard: {
      variants: [
        {
          props: {},
          style: {
            borderRadius: 25
          }
        }
      ]
    },
    MuiLinearProgress : {
      styleOverrides : {
        bar1Determinate : {
          backgroundColor : regionMidtRed
        }
      },
      variants : [
        {
          props : {variant:"determinate"},
          style:{
            background: "white",
            
          }
        }
      ]
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", disabled: false },
          style: {
            borderRadius: 25,
            padding : 15,
            background: "linear-gradient(to bottom, "+regionMidtRed+" 0%, #800000 100%)"
          }
        },
        {
          props: { variant: "contained", disabled: true },
          style: {
            borderRadius: 25,
            padding : 15,
            background: "gray"
          }
        },
        {
          props: { variant: "text", disabled: false },
          style: {
            color : regionMidtRed
          }
        }
      ]
    },
    MuiSvgIcon: {
      variants: [
        {
          props: { className: "sidebarIcon" },
          style: {
            color: "white",
            fontSize: 30
          }
        }
      ]
    },
    MuiAppBar: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            backgroundColor: "white",
            color: regionMidtRed,
            borderRadius: '0 0 10px 10px'
          }
        }
      ]
    }
  }
});

export default MyApp
