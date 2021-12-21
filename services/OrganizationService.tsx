import IOrganizationApi from "../apis/interfaces/IOrganizationApi";
import Department from "../components/Models/DetailedOrganization";
import BaseService from "./BaseService";
import IOrganizationService from "./interfaces/IOrganizationService";

export default class OrganizationService extends BaseService implements IOrganizationService{
    api : IOrganizationApi;

    constructor(api : IOrganizationApi){
        super()
        this.api = api;
    }
    async getOrganizationDetails(orgId: string) : Promise<Department>{
        try{

            return await this.api.getOrganizationDetails(orgId);
        }catch(error){
            return await this.HandleError(error);
        }
    }
}