

import { createContext } from 'react';

import IDateHelper from '../globalHelpers/interfaces/IDateHelper';
import DanishDateHelper from '../globalHelpers/danishImpl/DanishDateHelper';

import ValidationService from '../services/ValidationService';
import IValidationService from '../services/interfaces/IValidationService';
import { ICollectionHelper } from '../globalHelpers/interfaces/ICollectionHelper';
import { CollectionHelper } from '../globalHelpers/danishImpl/CollectionHelper';

interface IApiContext {
    validationService : IValidationService,

    dateHelper : IDateHelper
    collectionHelper : ICollectionHelper
}

const ApiContext = createContext<IApiContext>(
    {
        validationService : new ValidationService(),

        dateHelper : new DanishDateHelper(),
        collectionHelper : new CollectionHelper()
    }
    ); //Default value

export default ApiContext;
