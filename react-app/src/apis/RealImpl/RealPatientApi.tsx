import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import IPatientApi from "../interfaces/iPatientApi";
import { Configuration, OrganizationApi, PatientApi } from "../../generated";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";
import DetailedOrganization from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";

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