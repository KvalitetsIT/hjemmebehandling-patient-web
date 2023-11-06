import IOrganizationApi from "../apis/interfaces/IOrganizationApi";
import Department from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IOrganizationService from "./interfaces/IOrganizationService";
import IPatientApi from "../apis/interfaces/iPatientApi";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import IPatientService from "./interfaces/IPatientService";

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