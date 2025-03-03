import IValueSetApi from "../apis/interfaces/IValueSetApi";

import IValueSetService from "./interfaces/IValueSetService";
import { NoMeasurementTypesFound } from "./Errors/NoMeasurementTypesFound";
import BaseService, { StatusCodeMap } from "../components/BaseLayer/BaseService";
import { MeasurementType } from "../components/Models/MeasurementType";


export default class ValueSetService extends BaseService implements IValueSetService {
    api : IValueSetApi;

    constructor(api : IValueSetApi){
        super()
        this.api = api;
        this.AddStatusCodeToErrorMap(new StatusCodeMap(404,() => new NoMeasurementTypesFound()));
    }
    
    async GetAllMeasurementTypes(organizationId: string) : Promise<MeasurementType[]> {
        try {
            return await this.api.GetAllMeasurementTypes(organizationId);
        } catch(error){
            return this.HandleError(error);
        }
    }
}