import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";

export default interface IPatientService {    
    getPatient : () => Promise<PatientDetail>;
}