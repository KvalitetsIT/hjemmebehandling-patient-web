

import { createContext } from 'react';

import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import DanishDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/danishImpl/DanishDateHelper';

import ValidationService from '../services/ValidationService';
import IValidationService from '../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { CollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/danishImpl/CollectionHelper';
import QuestionnaireResponseService from '../services/QuestionnaireResponseService';
import FakeQuestionnaireResponseApi from '../apis/FakeImpl/FakeQuestionnaireResponseApi';
import FakeCareplanApi from '../apis/FakeImpl/FakeCareplanApi';
import IQuestionnaireResponseService from '../services/interfaces/IQuestionnaireResponseService';
import ICareplanService from '../services/interfaces/ICareplanService';
import CareplanService from '../services/CareplanService';
import IOrganizationService from '../services/interfaces/IOrganizationService';
import OrganizationService from '../services/OrganizationService';
import FakeOrganizationApi from '../apis/FakeImpl/FakeOrganizationApi';

interface IApiContext {
    questionnaireResponseService : IQuestionnaireResponseService,
    careplanService : ICareplanService,
    organizationService : IOrganizationService,
    validationService : IValidationService,
    dateHelper : IDateHelper
    collectionHelper : ICollectionHelper
}

const ApiContext = createContext<IApiContext>(
    {
        questionnaireResponseService : new QuestionnaireResponseService(new FakeQuestionnaireResponseApi()),
        careplanService : new CareplanService(new FakeCareplanApi()),
        organizationService : new OrganizationService(new FakeOrganizationApi()),

        validationService : new ValidationService(),
        dateHelper : new DanishDateHelper(),
        collectionHelper : new CollectionHelper()
    }
    ); //Default value

export default ApiContext;
