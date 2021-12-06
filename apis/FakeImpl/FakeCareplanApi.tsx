
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { Questionnaire } from "../../components/Models/Questionnaire";
import ICareplanApi from "../interfaces/ICareplanApi";

export default class FakeCareplanApi implements ICareplanApi{
    async GetActiveCareplan() : Promise<PatientCareplan>{
        const careplan = new PatientCareplan();
        careplan.id = "careplan1"


        let questionnaire = new Questionnaire();
        questionnaire.id = "q1"
        questionnaire.name = "Cool questionnaire"
        
        careplan.questionnaires = [questionnaire]


        return careplan;
    }




}