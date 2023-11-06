interface Env {
    REACT_APP_MOCK_PATIENT_SERVICE: string    
    REACT_APP_BFF_BASE_URL: string
    REACT_APP_NODE_ENV : string

    REACT_APP_MOCK_QUESTIONNAIRE_RESPONSE_SERVICE:string
    REACT_APP_MOCK_CAREPLAN_SERVICE: string
    REACT_APP_MOCK_VALUESET_SERVICE: string
    REACT_APP_MOCK_ORGANIZATION_SERVICE: string

    //Keycloak
    REACT_APP_KEYCLOAK_URL : string
    REACT_APP_KEYCLOAK_REALM : string
    REACT_APP_KEYCLOAK_CLIENTID : string
    REACT_APP_INACTIVITY_MAX_MINUTES: string
}

export default function getEnvironment(): Env {
    const env = (window as any)._jsenv || process.env;
    //validateAll(env)
    return env;
}


