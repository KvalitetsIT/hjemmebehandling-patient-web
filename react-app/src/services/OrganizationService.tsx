import IOrganizationApi from "../apis/interfaces/IOrganizationApi";
import BaseService from "../components/BaseLayer/BaseService";


import Department from "../components/Models/DetailedOrganization";

import IOrganizationService from "./interfaces/IOrganizationService";

export default class OrganizationService extends BaseService implements IOrganizationService{
    api : IOrganizationApi;

    constructor(api : IOrganizationApi){
        super()
        this.api = api;
    }
    async getOrganizations(): Promise<Department[]> {
        try{
            return await this.api.getOrganizations();
        }catch(error){
            return await this.HandleError(error);
        }
    }

    async getOrganizationDetails(orgId: string) : Promise<Department>{
        try{

            return await this.api.getOrganizationDetails(orgId);
        }catch(error){
            return await this.HandleError(error);
        }
    }
}