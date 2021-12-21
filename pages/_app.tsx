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
import RealQuestionnaireResponseApi from '../apis/RealImpl/RealQuestionnaireResponseApi';
import RealCareplanApi from '../apis/RealImpl/RealCareplanApi';
import ICareplanApi from '../apis/interfaces/ICareplanApi';
import IQuestionnaireResponseApi from '../apis/interfaces/IQuestionnaireResponseApi';
import IOrganizationApi from '../apis/interfaces/IOrganizationApi';
import OrganizationService from '../services/OrganizationService';
import FakeOrganizationApi from '../apis/FakeImpl/FakeOrganizationApi';
import RealOrganizationApi from '../apis/RealImpl/RealOrganizationApi';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {


  let questionnaireResponseApi: IQuestionnaireResponseApi = new RealQuestionnaireResponseApi();
  let careplanApi: ICareplanApi = new RealCareplanApi();
  let organizationApi: IOrganizationApi = new RealOrganizationApi();

  if (process?.env.NODE_ENV === 'development') {
    if (process.env.NEXT_PUBLIC_MOCK_QUESTIONNAIRE_RESPONSE_SERVICE === "true") {
      questionnaireResponseApi = new FakeQuestionnaireResponseApi();
    }
    if (process.env.NEXT_PUBLIC_MOCK_CAREPLAN_SERVICE === "true") {
      careplanApi = new FakeCareplanApi();
    }
    if (process.env.NEXT_PUBLIC_MOCK_ORGANIZATION_SERVICE === "true") {
      organizationApi = new FakeOrganizationApi();
    }
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
              organizationService: new OrganizationService(organizationApi),

              //Helpers
              validationService: new ValidationService(),
              dateHelper: new DanishDateHelper(),
              collectionHelper: new CollectionHelper()
            }}
          >
            <CssBaseline />
            {typeof window === 'undefined' ? null :

              <ErrorBoundary ekstraText="Fejlen der opstod kræver opdatering af siden (F5)" showReloadButton={true}>
                <Layout>
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </Layout>
              </ErrorBoundary>
            }
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
        subheader: {
          color: regionMidtRed
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
    MuiLinearProgress: {
      styleOverrides: {
        bar1Determinate: {
          backgroundColor: regionMidtRed
        }
      },
      variants: [
        {
          props: { variant: "determinate" },
          style: {
            background: "white",

          }
        }
      ]
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            border: 0,
            backgroundColor: 'white',
            borderRadius: 30,
            textTransform: "capitalize",
            color: "black",
            ":hover": {
              border: 0,
              backgroundColor: 'white',
              color: regionMidtRed,
            }
          }
        },
        {
          props: { variant: "contained", disabled: false },
          style: {
            borderRadius: 25,
            padding: 15,
            background: "linear-gradient(to bottom, " + regionMidtRed + " 0%, #800000 100%)"
          }
        },
        {
          props: { variant: "contained", disabled: true },
          style: {
            borderRadius: 25,
            padding: 15,
            background: "gray"
          }
        },
        {
          props: { variant: "text", disabled: false },
          style: {
            color: regionMidtRed
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
