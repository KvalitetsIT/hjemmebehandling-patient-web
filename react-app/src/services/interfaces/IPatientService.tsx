import { PatientDetail } from "../../components/Models/PatientDetail";


export default interface IPatientService {    
    getPatient : () => Promise<PatientDetail>;
}