import IValueSetApi from "../apis/interfaces/IValueSetApi";
import BaseService, { StatusCodeMap } from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IValueSetService from "./interfaces/IValueSetService";
import { NoMeasurementTypesFound } from "./Errors/NoMeasurementTypesFound";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";

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