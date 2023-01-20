import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";


/**
 * Containing methods that are using the auto-generated classes to contact the real api
 * This layer is the only layer that should know of both generated classes and internal classes
 */
export default interface ICValueSetApi {
    /**
     * Retrieves configured measurementtypes for an organization
     * @returns measurementtypes for an organization
     */
    GetAllMeasurementTypes: (organizationId: string) => Promise<MeasurementType[]>;
    
}