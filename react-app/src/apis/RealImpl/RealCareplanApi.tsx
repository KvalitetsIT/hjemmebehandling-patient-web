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

    
    async GetActiveCareplans() : Promise<PatientCareplan[]> {
        try{
            const careplansFromApi = await this.careplanapi.getActiveCarePlans();
            return careplansFromApi.map(x => this.toInternal.mapCarePlanDto(x));
        } catch(error){
            return await this.HandleError(error);
        }
    }

}