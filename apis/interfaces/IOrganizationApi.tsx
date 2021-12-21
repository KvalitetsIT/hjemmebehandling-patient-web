import DetailedOrganization from "../../components/Models/DetailedOrganization";

export default interface IOrganizationApi {
    getOrganizationDetails : (orgId : string) => Promise<DetailedOrganization>;
}