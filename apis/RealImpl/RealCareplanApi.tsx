import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { CarePlanApi, Configuration } from "../../generated";
import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";
import ICareplanApi from "../interfaces/ICareplanApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";

export default class RealCareplanApi extends BaseApi implements ICareplanApi{
    careplanapi : CarePlanApi;
    toInternal : ExternalToInternalMapper;
    toExternal : InternalToExternalMapper;
    conf: Configuration = new Configuration({ basePath: '/api/proxy' });
    
    constructor(){
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.careplanapi = new CarePlanApi(this.conf);
    }

    
    async GetActiveCareplan() : Promise<PatientCareplan> {
        try{
            const careplanFromApi = await this.careplanapi.getActiveCarePlan();
            return this.toInternal.mapCarePlanDto(careplanFromApi);
        } catch(error){
            return await this.HandleError(error);
        }
    }

}