

import IPatientApi from "../interfaces/iPatientApi";
import { Configuration, OrganizationApi, PatientApi } from "../../generated";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";

import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import BaseApi from "../../components/BaseLayer/BaseApi";
import { PatientDetail } from "../../components/Models/PatientDetail";

export default class FakePatientApi extends BaseApi implements IPatientApi{
    
    patientApi: PatientApi;
    toInternal: ExternalToInternalMapper;
    toExternal: InternalToExternalMapper;
    conf: Configuration = new Configuration({ basePath: '/api/proxy' });

    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.patientApi = new PatientApi(this.conf);
    }
    


    async getPatient() : Promise<PatientDetail>{
        try {  
            const response = await this.patientApi.getPatient();
            return this.toInternal.mapPatientDto(response)
        } catch (error) {
            return await this.HandleError(error);
        }
            
    }

}