import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";


/**
 * Containing methods that are using the auto-generated classes to contact the real api
 * This layer is the only layer that should know of both generated classes and internal classes
 */
export default interface ICareplanApi {
    /**
     * Retrieves a active careplan based on the user logged in
     * It uses the token to know who the user is
     * @returns the one active careplan that belongs to the logged in user
     */
    GetActiveCareplan : () => Promise<PatientCareplan>;
}