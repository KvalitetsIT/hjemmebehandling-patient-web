import DetailedOrganization from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";

/**
 * Containing methods that are using the auto-generated classes to contact the real api
 * This layer is the only layer that should know of both generated classes and internal classes
 */
export default interface IOrganizationApi {
<<<<<<< HEAD
    getOrganizationDetails: (orgId: string) => Promise<DetailedOrganization>;
=======
    /**
     * Retrieves an organization
     * @param orgId the organisation id that uniquely identifies one organization
     * @returns one organization that has the id as the orgId-param
     */
    getOrganizationDetails : (orgId : string) => Promise<DetailedOrganization>;
>>>>>>> 7711902d5bfebb6f9f68f2e71f4ce1428e568fef
}