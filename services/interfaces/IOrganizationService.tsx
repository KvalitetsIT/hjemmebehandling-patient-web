import Department from "../../components/Models/DetailedOrganization";

export default interface IOrganizationService {
    getOrganizationDetails : (orgId : string) => Promise<Department>;
}