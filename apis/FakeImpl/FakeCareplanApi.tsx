
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import ICareplanApi from "../interfaces/ICareplanApi";

export default class FakeCareplanApi implements ICareplanApi{
    async GetActiveCareplan() : Promise<PatientCareplan>{
        const careplan = new PatientCareplan();
        careplan.id = "careplan1"
        return careplan;
    }




}