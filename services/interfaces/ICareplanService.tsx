import { PatientCareplan } from "../../components/Models/PatientCareplan";


export default interface ICareplanService {
    GetActiveCareplan : () => Promise<PatientCareplan>;
}