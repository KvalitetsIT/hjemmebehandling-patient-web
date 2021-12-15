
import { Address } from "../../components/Models/Address";
import { Contact } from "../../components/Models/Contact";
import { DayEnum, Frequency } from "../../components/Models/Frequency";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { Question, QuestionTypeEnum } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import BaseApi from "../BaseApi";
import { NotImplementedError } from "../Errors/NotImplementedError";
import ICareplanApi from "../interfaces/ICareplanApi";

export default class FakeCareplanApi extends BaseApi implements ICareplanApi{
    timeToWait: number = 1000;

    async GetActiveCareplan() : Promise<PatientCareplan>{
        try{
            await new Promise(f => setTimeout(f, this.timeToWait));
        
        //throw new Response();
        const careplan = new PatientCareplan();
        careplan.id = "careplan1"

        let patient = new PatientDetail();
        patient.firstname = "Anders"
        patient.lastname = "Madsen"
        patient.cpr = "1212120382"
        patient.primaryPhone = "+4520304050"
        patient.secondaryPhone = "+4520304050"
        let address = new Address();
        address.city = "Aarhus N"
        address.country = "Danmark"
        address.street = "Olof Palmes Allé 34"
        address.zipCode = "8200"
        patient.address = address;
        let contact = new Contact();
        contact.affiliation = "Kone"
        contact.fullname = "Gitte Madsen"
        contact.primaryPhone = "+4530405060"
        patient.contact = contact;
        careplan.patient = patient;

        let questionnaire = new Questionnaire();
        questionnaire.id = "q1"
        questionnaire.name = "Cool questionnaire"
        questionnaire.frequency = new Frequency();
        questionnaire.frequency.days = [DayEnum.Thursday]
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

        const question3 = new Question();
        question3.Id="question3"
        question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        question3.type = QuestionTypeEnum.CHOICE
        question3.options = ["Ja","Nej"]
        questionnaire.questions[2] = question3;

        careplan.questionnaires = [questionnaire]


        return careplan;
    } catch(error){
        return await this.HandleError(error);
    }
    }




}