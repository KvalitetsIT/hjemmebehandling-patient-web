
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
        questionnaire.frequency.days = [DayEnum.Friday,DayEnum.Thursday,DayEnum.Wednesday]
        questionnaire.frequency.deadline = "11:00"
        
        questionnaire.questions = [];
        
        const question1 = new Question();
        question1.Id="temp"
        question1.question = "Indtast din morgen temperatur?"
        question1.type = QuestionTypeEnum.OBSERVATION
        questionnaire.questions[0] = question1;

        const question2 = new Question();
        question2.Id="CRP"
        question2.question = "Indtast den målte CRP?"
        question2.type = QuestionTypeEnum.OBSERVATION
        questionnaire.questions[1] = question2;
        
        const question3 = new Question();
        question3.Id="betterToday"
        question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        question3.type = QuestionTypeEnum.CHOICE
        question3.options = ["Ja","Nej"]
        questionnaire.questions[2] = question3;
        

        let questionnaire2 = new Questionnaire();
        questionnaire2.id = "q2"
        questionnaire2.name = "Lastbilchauførers surhed"
        questionnaire2.frequency = new Frequency();
        questionnaire2.frequency.days = [DayEnum.Wednesday]
        questionnaire2.frequency.deadline = "11:00"
        
        questionnaire2.questions = [];
        
        const questionb1 = new Question();
        questionb1.Id="madDrivers"
        questionb1.question = "Antal sure lastbilchaufører i dag?"
        questionb1.type = QuestionTypeEnum.OBSERVATION
        questionnaire2.questions[0] = questionb1;

        const questionb2 = new Question();
        questionb2.Id="drivesMercedes"
        questionb2.question = "Hvor mange lastbilchaufører har kørt Mercedes?"
        questionb2.type = QuestionTypeEnum.INTEGER
        questionnaire2.questions[1] = questionb2;
        
        const questionb3 = new Question();
        questionb3.Id="umad"
        questionb3.question = "Føler du dig sur, fordi lastbilchaufører er sure?"
        questionb3.type = QuestionTypeEnum.CHOICE
        questionb3.options = ["Ja","Nej"]
        questionnaire2.questions[2] = question3;
        

        careplan.questionnaires = [questionnaire,questionnaire2]
        
        
        
        return careplan;
    } catch(error){
        return await this.HandleError(error);
    }
    }
    



}