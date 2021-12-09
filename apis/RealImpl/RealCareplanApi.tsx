import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { CarePlanApi } from "../../generated";
import BaseApi from "../BaseApi";
import ICareplanApi from "../interfaces/ICareplanApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";

export default class RealCareplanApi extends BaseApi implements ICareplanApi{
    careplanapi : CarePlanApi;
    toInternal : ExternalToInternalMapper;
    toExternal : InternalToExternalMapper;
    constructor(){
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.careplanapi = new CarePlanApi();
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