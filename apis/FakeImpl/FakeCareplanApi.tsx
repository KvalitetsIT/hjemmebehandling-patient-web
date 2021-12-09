
import { DayEnum, Frequency } from "../../components/Models/Frequency";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { Question, QuestionTypeEnum } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import BaseApi from "../BaseApi";
import { NotImplementedError } from "../Errors/NotImplementedError";
import ICareplanApi from "../interfaces/ICareplanApi";

export default class FakeCareplanApi extends BaseApi implements ICareplanApi{
    async GetActiveCareplan() : Promise<PatientCareplan>{
        try{

        
        //throw new Response();
        const careplan = new PatientCareplan();
        careplan.id = "careplan1"


        let questionnaire = new Questionnaire();
        questionnaire.id = "q1"
        questionnaire.name = "Cool questionnaire"
        questionnaire.frequency = new Frequency();
        questionnaire.frequency.days = [DayEnum.Wednesday]
        questionnaire.frequency.deadline = "11:00"
        
        questionnaire.questions = [];
        
        const question1 = new Question();
        question1.Id="question1"
        question1.question = "Indtast din morgen temperatur?"
        question1.type = QuestionTypeEnum.OBSERVATION
        questionnaire.questions[0] = question1;

        const question2 = new Question();
        question2.Id="question2"
        question2.question = "Indtast den målte CRP?"
        question2.type = QuestionTypeEnum.INTEGER
        questionnaire.questions[1] = question2;

        //const question3 = new Question();
        //question3.Id="question3"
        //question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        //question3.type = QuestionTypeEnum.CHOICE
        //questionnaire.questions[2] = question3;

        careplan.questionnaires = [questionnaire]


        return careplan;
    } catch(error){
        return await this.HandleError(error);
    }
    }




}