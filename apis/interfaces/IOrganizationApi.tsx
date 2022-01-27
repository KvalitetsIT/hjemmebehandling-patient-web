import DetailedOrganization from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";

export default interface IOrganizationApi {
    getOrganizationDetails: (orgId: string) => Promise<DetailedOrganization>;
}