import Department from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";

/**
 * OrganizationService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IOrganizationService {
    /**
     * Get organization based on id
     * @param orgId the id of the organization
     * @returns the requested department
     */
    getOrganizationDetails : (orgId : string) => Promise<Department>;
}