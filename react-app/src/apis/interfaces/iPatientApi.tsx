import { PatientDetail } from "../../components/Models/PatientDetail";


export default interface IPatientApi {
    getPatient : () => Promise<PatientDetail>;
}