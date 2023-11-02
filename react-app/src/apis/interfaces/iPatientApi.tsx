import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";

export default interface IPatientApi {
    getPatient : () => Promise<PatientDetail>;
}