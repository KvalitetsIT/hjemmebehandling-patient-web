import { MeasurementType } from "../../components/Models/MeasurementType";


/**
 * ValueSetService
 * - should be in charge of retrieving measurement types
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IValueSetService {
    /**
     * Retrieves configured measurementtypes for an organization
     * @returns measurementtypes for an organization
     */
    GetAllMeasurementTypes: (organizationId: string) => Promise<MeasurementType[]>;
}