import DetailedOrganization from "../../components/Models/DetailedOrganization";
import {  Configuration, OrganizationApi } from "../../generated";
import BaseApi from "../BaseApi";

import IOrganizationApi from "../interfaces/IOrganizationApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";
import FhirUtils from "../../util/FhirUtils";

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

            let plainId = FhirUtils.unqualifyId(orgId)
            const request = {
                id: plainId
            }
            const response = await this.organizationApi.getOrganization(request);
            return this.toInternal.mapOrganization(response)
        } catch (error) {
            return await this.HandleError(error);
        }
    }
}