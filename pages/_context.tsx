

import { createContext } from 'react';

import IDateHelper from '../globalHelpers/interfaces/IDateHelper';
import DanishDateHelper from '../globalHelpers/danishImpl/DanishDateHelper';

import ValidationService from '../services/ValidationService';
import IValidationService from '../services/interfaces/IValidationService';
import { ICollectionHelper } from '../globalHelpers/interfaces/ICollectionHelper';
import { CollectionHelper } from '../globalHelpers/danishImpl/CollectionHelper';
import QuestionnaireResponseService from '../services/QuestionnaireResponseService';
import FakeQuestionnaireResponseApi from '../apis/FakeImpl/FakeQuestionnaireResponseApi';
import FakeCareplanApi from '../apis/FakeImpl/FakeCareplanApi';
import IQuestionnaireResponseService from '../services/interfaces/IQuestionnaireResponseService';
import ICareplanService from '../services/interfaces/ICareplanService';
import CareplanService from '../services/CareplanService';

interface IApiContext {
    questionnaireResponseService : IQuestionnaireResponseService,
    careplanService : ICareplanService,
    validationService : IValidationService,
    dateHelper : IDateHelper
    collectionHelper : ICollectionHelper
}

const ApiContext = createContext<IApiContext>(
    {
        questionnaireResponseService : new QuestionnaireResponseService(new FakeQuestionnaireResponseApi()),
        careplanService : new CareplanService(new FakeCareplanApi()),

        validationService : new ValidationService(),
        dateHelper : new DanishDateHelper(),
        collectionHelper : new CollectionHelper()
    }
    ); //Default value

export default ApiContext;
