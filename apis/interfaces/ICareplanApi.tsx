import { PatientCareplan } from "../../components/Models/PatientCareplan";


export default interface ICareplanApi {
    GetActiveCareplan : () => Promise<PatientCareplan>;
}