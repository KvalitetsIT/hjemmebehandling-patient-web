

import { createContext } from 'react';




import ValidationService from '../services/ValidationService';
import IValidationService from '../services/interfaces/IValidationService';


import QuestionnaireResponseService from '../services/QuestionnaireResponseService';
import FakeQuestionnaireResponseApi from '../apis/FakeImpl/FakeQuestionnaireResponseApi';
import FakeCareplanApi from '../apis/FakeImpl/FakeCareplanApi';
import IQuestionnaireResponseService from '../services/interfaces/IQuestionnaireResponseService';
import ICareplanService from '../services/interfaces/ICareplanService';
import CareplanService from '../services/CareplanService';
import IOrganizationService from '../services/interfaces/IOrganizationService';
import OrganizationService from '../services/OrganizationService';
import FakeOrganizationApi from '../apis/FakeImpl/FakeOrganizationApi';
import IValueSetService from '../services/interfaces/IValueSetService';
import ValueSetService from '../services/ValueSetService';
import PatientService from '../services/PatientService';
import FakePatientApi from '../apis/FakeImpl/FakePatientApi';
import IPatientService from '../services/interfaces/IPatientService';
import { CollectionHelper } from '../components/Helpers/danishImpl/CollectionHelper';
import DanishDateHelper from '../components/Helpers/danishImpl/DanishDateHelper';
import { ICollectionHelper } from '../components/Helpers/interfaces/ICollectionHelper';
import IDateHelper from '../components/Helpers/interfaces/IDateHelper';

export interface IApiContext {
    patientService: IPatientService;
    questionnaireResponseService : IQuestionnaireResponseService,
    careplanService : ICareplanService,
    valueSetService : IValueSetService,
    organizationService : IOrganizationService,
    validationService : IValidationService,
    dateHelper : IDateHelper
    collectionHelper : ICollectionHelper
}

const ApiContext = createContext<IApiContext>(
    {
        patientService : new PatientService(new FakePatientApi()),
        questionnaireResponseService : new QuestionnaireResponseService(new FakeQuestionnaireResponseApi(),new DanishDateHelper()),
        careplanService : new CareplanService(new FakeCareplanApi()),
        valueSetService : new ValueSetService(new FakeCareplanApi()),
        organizationService : new OrganizationService(new FakeOrganizationApi()),

        validationService : new ValidationService(),
        dateHelper : new DanishDateHelper(),
        collectionHelper : new CollectionHelper()
    }
    ); //Default value

export default ApiContext;
