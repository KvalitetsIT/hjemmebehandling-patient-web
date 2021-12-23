import ICareplanApi from "../apis/interfaces/ICareplanApi";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import ICareplanService from "./interfaces/ICareplanService";

export default class CareplanService extends BaseService implements ICareplanService{
    api : ICareplanApi;

    constructor(api : ICareplanApi){
        super()
        this.api = api;
    }
    async GetActiveCareplan() : Promise<PatientCareplan>{
        try {
            return await this.api.GetActiveCareplan();
        } catch(error){
            return this.HandleError(error);
        }
    }



}