import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import ApiContext from './_context';

import DanishDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/danishImpl/DanishDateHelper';

import React from 'react';

import ValidationService from '../services/ValidationService';
import { CollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/danishImpl/CollectionHelper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
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

  const dateHelper = new DanishDateHelper();
  return (
    <>
      <div suppressHydrationWarning>

        <ThemeProvider theme={THEME}>

          <ApiContext.Provider
            value={{
              //Services
              questionnaireResponseService: new QuestionnaireResponseService(questionnaireResponseApi, dateHelper),
              careplanService: new CareplanService(careplanApi),
              organizationService: new OrganizationService(organizationApi),

              //Helpers
              validationService: new ValidationService(),
              dateHelper: dateHelper,
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

const green = '#61BD84'

const yellow = '#FFD78C'

const red = '#EE6969'


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
    MuiTypography: {
      variants: [
        {
          props: { variant: "h2" },
          style: {
            color: regionMidtRed,
            fontWeight : "bold"
          }
        },
        {
          props: { variant: "h6" },
          style: {
            color: regionMidtRed,
          }
        },
        {
          props: {className: "call-hospital"},
          style: {
            color: regionMidtRed,
            padding: "8px"
          }
        }
      ]
    },
    MuiChip: {
      variants: [
        {
          props: { className: "darkColor", color: "error" },
          style: {
            backgroundColor: red
          }
        },
        {
          props: { className: "darkColor", color: "warning" },
          style: {
            backgroundColor: yellow
          }
        },
        {
          props: { className: "darkColor", color: "success" },
          style: {
            backgroundColor: green
          }
        }
      ]
    },
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
            borderRadius: 25,
            boxShadow: "none"
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
            textTransform: "initial",
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
            textTransform: "initial",
            borderRadius: 25,
            padding: 15,
            background: "linear-gradient(to bottom, " + regionMidtRed + " 0%, #800000 100%)"
          }
        },
        {
          props: { variant: "contained", disabled: true },
          style: {
            textTransform: "initial",
            borderRadius: 25,
            padding: 15,
            background: "gray"
          }
        },
        {
          props: { variant: "text", disabled: false },
          style: {
            textTransform: "initial",
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
