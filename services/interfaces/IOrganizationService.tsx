import Department from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";

export default interface IOrganizationService {
    getOrganizationDetails : (orgId : string) => Promise<Department>;
}