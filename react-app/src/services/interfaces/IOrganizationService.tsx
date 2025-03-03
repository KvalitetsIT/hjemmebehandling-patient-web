import Department from "../../components/Models/DetailedOrganization";

/**
 * OrganizationService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IOrganizationService {
    
    /**
     * Get all organizations associated with the current context
     * @returns the requested organisations
     */
    
    getOrganizations(): Promise<Department[]>;
    /**
     * Get organization based on id
     * @param orgId the id of the organization
     * @returns the requested department
     */
    getOrganizationDetails : (orgId : string) => Promise<Department>;
}