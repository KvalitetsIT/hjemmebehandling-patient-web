import IOrganizationApi from "../apis/interfaces/IOrganizationApi";


import IOrganizationService from "./interfaces/IOrganizationService";
import IPatientApi from "../apis/interfaces/iPatientApi";

import IPatientService from "./interfaces/IPatientService";
import BaseService from "../components/BaseLayer/BaseService";
import { PatientDetail } from "../components/Models/PatientDetail";

export default class PatientService extends BaseService implements IPatientService{
    api : IPatientApi;

    constructor(api : IPatientApi){
        super()
        this.api = api;
    }
    
    async getPatient() : Promise<PatientDetail>{
        try{
            return await this.api.getPatient();
        }catch(error){
            return await this.HandleError(error);
        }
    }
}