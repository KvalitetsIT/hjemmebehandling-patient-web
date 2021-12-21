import DetailedOrganization from "../../components/Models/DetailedOrganization";
import {  Configuration, OrganizationApi } from "../../generated";
import BaseApi from "../BaseApi";

import IOrganizationApi from "../interfaces/IOrganizationApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";

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

    async getOrganizationDetails(orgId: string): Promise<DetailedOrganization> {
        try {

            const request = {
                id: orgId
            }
            const response = await this.organizationApi.getOrganization(request);
            return this.toInternal.mapOrganization(response)
        } catch (error) {
            return await this.HandleError(error);
        }
    }




}