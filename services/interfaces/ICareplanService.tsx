import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";


export default interface ICareplanService {
    GetActiveCareplan : () => Promise<PatientCareplan>;
}