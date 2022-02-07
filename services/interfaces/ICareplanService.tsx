import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";

/**
 * CareplanService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface ICareplanService {
    /**
     * Retrieves the active careplan for the user logged in
     * @returns active careplan
     */
    GetActiveCareplan : () => Promise<PatientCareplan>;
}