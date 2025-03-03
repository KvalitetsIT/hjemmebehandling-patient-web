
import {  Configuration, OrganizationApi } from "../../generated";


import IOrganizationApi from "../interfaces/IOrganizationApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";
import FhirUtils from "../../util/FhirUtils";
import BaseApi from "../../components/BaseLayer/BaseApi";
import DetailedOrganization from "../../components/Models/DetailedOrganization";

export default class RealOrganizationApi extends BaseApi implements IOrganizationApi {
    organizationApi: OrganizationApi;
    toInternal: ExternalToInternalMapper;
    toExternal: InternalToExternalMapper;
    conf: Configuration = new Configuration({ basePath: '/api/proxy' });

    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.organizationApi = new OrganizationApi(this.conf);
    }
    async getOrganizations(): Promise<DetailedOrganization[]> {
        try {  
            const response = await this.organizationApi.getOrganizations();
            return response.map(organization => this.toInternal.mapOrganizationDto(organization))
        } catch (error) {
            return await this.HandleError(error);
        }


    }

    async getOrganizationDetails(orgId: string): Promise<DetailedOrganization> {
        try {

            const plainId = FhirUtils.unqualifyId(orgId)
            const request = {
                id: plainId
            }
            const response = await this.organizationApi.getOrganization(request);
            return this.toInternal.mapOrganizationDto(response)
        } catch (error) {
            return await this.HandleError(error);
        }
    }
}