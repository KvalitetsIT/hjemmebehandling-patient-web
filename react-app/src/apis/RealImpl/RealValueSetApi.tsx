import { ValueSetApi, Configuration } from "../../generated";

import IValueSetApi from "../interfaces/IValueSetApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";

import FhirUtils from "../../util/FhirUtils";
import BaseApi from "../../components/BaseLayer/BaseApi";
import { MeasurementType } from "../../components/Models/MeasurementType";

export default class RealValueSetApi extends BaseApi implements IValueSetApi{
    valuesetapi : ValueSetApi;
    toInternal : ExternalToInternalMapper;
    toExternal : InternalToExternalMapper;
    conf: Configuration = new Configuration({ basePath: '/api/proxy' });
    
    constructor(){
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.valuesetapi = new ValueSetApi(this.conf);
    }

    
    async GetAllMeasurementTypes(organizationId: string) : Promise<MeasurementType[]> {
        try{
            const plainId = FhirUtils.unqualifyId(organizationId)
            const request = {
                organizationId: plainId
            }
            console.log("kalder", request)
            const measurementTypeList = await this.valuesetapi.getMeasurementTypes(request);
            console.debug(measurementTypeList)
            return measurementTypeList.map(measurementType => this.toInternal.mapMeasurementType(measurementType));
        } catch(error){
            return await this.HandleError(error);
        }
    }

}