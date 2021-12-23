import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";


export default interface ICareplanApi {
    GetActiveCareplan : () => Promise<PatientCareplan>;
}