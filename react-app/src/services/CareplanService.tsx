import ICareplanApi from "../apis/interfaces/ICareplanApi";


import ICareplanService from "./interfaces/ICareplanService";
import { NoActiveCareplanFound } from "./Errors/NoActiveCareplanFound";
import BaseService, { StatusCodeMap } from "../components/BaseLayer/BaseService";
import { PatientCareplan } from "../components/Models/PatientCareplan";

export default class CareplanService extends BaseService implements ICareplanService{
    api : ICareplanApi;

    constructor(api : ICareplanApi){
        super()
        this.api = api;
        this.AddStatusCodeToErrorMap(new StatusCodeMap(404,() => new NoActiveCareplanFound()));
    }
    
    async GetActiveCareplans() : Promise<PatientCareplan[]>{
        try {
            return await this.api.GetActiveCareplans();
        } catch(error){
            return this.HandleError(error);
        }
    }



}