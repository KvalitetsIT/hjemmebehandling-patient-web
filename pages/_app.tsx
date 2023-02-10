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
import ValueSetService from '../services/ValueSetService';
import FakeCareplanApi from '../apis/FakeImpl/FakeCareplanApi';
import RealQuestionnaireResponseApi from '../apis/RealImpl/RealQuestionnaireResponseApi';
import RealCareplanApi from '../apis/RealImpl/RealCareplanApi';
import ICareplanApi from '../apis/interfaces/ICareplanApi';
import IQuestionnaireResponseApi from '../apis/interfaces/IQuestionnaireResponseApi';
import IOrganizationApi from '../apis/interfaces/IOrganizationApi';
import OrganizationService from '../services/OrganizationService';
import FakeOrganizationApi from '../apis/FakeImpl/FakeOrganizationApi';
import RealOrganizationApi from '../apis/RealImpl/RealOrganizationApi';
import RealValueSetApi from '../apis/RealImpl/RealValueSetApi';
import IValueSetApi from '../apis/interfaces/IValueSetApi';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {


  let questionnaireResponseApi: IQuestionnaireResponseApi = new RealQuestionnaireResponseApi();
  let careplanApi: ICareplanApi = new RealCareplanApi();
  let valueSetApi: IValueSetApi = new RealValueSetApi();
  let organizationApi: IOrganizationApi = new RealOrganizationApi();

  if (process?.env.NODE_ENV === 'development') {
    if (process.env.NEXT_PUBLIC_MOCK_QUESTIONNAIRE_RESPONSE_SERVICE === "true") {
      questionnaireResponseApi = new FakeQuestionnaireResponseApi();
    }
    if (process.env.NEXT_PUBLIC_MOCK_CAREPLAN_SERVICE === "true") {
      careplanApi = new FakeCareplanApi();
    }
    if (process.env.NEXT_PUBLIC_MOCK_VALUESET_SERVICE === "true") {
      valueSetApi = new FakeCareplanApi();
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
              valueSetService: new ValueSetService(valueSetApi),
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
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 20
        }
      },
      variants: [
        {
          props: { severity: "error" },
          style: {
            color: 'white',
            backgroundColor: regionMidtRed
          }
        }
      ]
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "body1" },
          style: {
            fontSize: '0.875rem',
            letterSpacing: 'initial'

          }
        },
        {
          props: { variant: "subtitle1" },
          style: {
            fontWeight: 'bold',
            lineHeight: 'initial',
            letterSpacing: 'initial'
          }
        },
        {
          props: { variant: "h2" },
          style: {
            color: regionMidtRed,
            fontWeight: "bold",
            letterSpacing: 'initial'
          }
        },
        {
          props: { variant: "h6" },
          style: {
            color: regionMidtRed,
            letterSpacing: 'initial'
          }
        },
        {
          props: { variant: "caption" },
          style: {
            letterSpacing: 'initial'
          }
        },
        {
          props: { variant: "subtitle2" },
          style: {
            letterSpacing: 'initial'
          }
        },
        {
          props: { className: "call-hospital" },
          style: {
            color: regionMidtRed,
            padding: "8px",
            letterSpacing: 'initial'
          }
        },
        {
          props: { className: "headline" },
          style: {
            fontWeight: "bold",
            fontSize: "1rem",
            letterSpacing: 'initial'
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
        content: {
          overflow: 'hidden',
        },
        subheader: {
          color: regionMidtRed,
          fontSize: '1rem',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        },
      },
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
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1,
        }
      }
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
    MuiGrid: {
      variants: [
        {
          props: { className: "show-all-answered" },
          style: {
            display: "flex",
            justifyContent: "end",
            alignSelf: "flex-end"
          }
        },
        {
          props: { className: "headline-wrapper" },
          style: {
            display: "flex",
            alignSelf: "flex-end",
            paddingTop: "40px !important"
          }
        },
        {
          props: { className: "container-avatar" },
          style: {
            display: "flex",
            alignItems: "center"
          }
        },
      ]
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "15px",
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
        }
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            borderColor: regionMidtRed,
            color: regionMidtRed,
            borderRadius: 25,
            padding: 15,
            textTransform: "initial"
          }
        },
        {
          props: { variant: "outlined", className: "showAllButton" },
          style: {
            border: 0,
            lineHeight: "1rem",
            backgroundColor: 'white',
            borderRadius: 30,
            padding: 10,
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
            background: "linear-gradient(to bottom, " + regionMidtRed + "  0%, rgb(175, 10, 65) 100%)"
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
    },
    //About button, sidebar
    MuiList: {
      variants: [
        {
          props: { className: 'BottomList' },
          style: {
            marginTop: "auto",
          }
        }
      ]
    },
    MuiStack: {
      variants: [
        {
          props: { className: 'questionnaireStatus' },
          style: {
            alignItems: 'center',
          }
        }
      ]
    },
    MuiTableCell: {
      variants: [
        {
          props: { variant: 'head' },
          style: {
            fontWeight: 'bold',
          }
        }
      ]
    },
    MuiAvatar: {
      variants: [
        {
          props: { variant: 'rounded' },
          style: {
            borderRadius: '20px',
            margin: '10px',
            width: '60px',
            height: '60px'
          }
        }
      ]
    }
  }
});

export default MyApp
