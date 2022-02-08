import { NotFoundError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/NotFoundError";
import { Answer, BooleanAnswer, NumberAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import IQuestionnaireResponseApi from "../interfaces/IQuestionnaireResponseApi";

export default class FakeQuestionnaireResponseApi implements IQuestionnaireResponseApi{
    questionnaireResponses : QuestionnaireResponse[] = [];

    date : number
    getDate() : Date {
        const oneDayInMs = 86400000
        this.date = this.date + oneDayInMs
        return new Date(this.date);
    }
    constructor(){
        this.date = new Date().getTime()
        //QR1
        const questionnaireResponse1 = new QuestionnaireResponse();
        questionnaireResponse1.id = "questionnaireResponse1";
        questionnaireResponse1.questionnaireId = "q1"
        questionnaireResponse1.answeredTime = this.getDate();
        questionnaireResponse1.examinedTime = this.getDate();
        questionnaireResponse1.status = QuestionnaireResponseStatus.Processed

        questionnaireResponse1.questions = new Map<Question,Answer>();
        
        const question1 = new Question();
        question1.question = "Hvad er din temperatur?"
        question1.type = QuestionTypeEnum.OBSERVATION
        question1.Id = "temp"
        
        const answer1 = new NumberAnswer();
        answer1.answer = 37;
        questionnaireResponse1.questions.set(question1,answer1);

        const question2 = new Question();
        question2.question = "Hvad er din CRP?"
        question2.type = QuestionTypeEnum.OBSERVATION
        question2.Id = "CRP"
        
        const answer2 = new NumberAnswer();
        answer2.answer = 8;
        questionnaireResponse1.questions.set(question2,answer2);

        const question3 = new Question();
        question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        question3.type = QuestionTypeEnum.BOOLEAN;
        question3.Id = "betterToday"
        
        const answer3 = new BooleanAnswer();
        answer3.answer = true

        questionnaireResponse1.questions.set(question3,answer3);

        
        
        //QR2
        
        const questionnaireResponse2 = new QuestionnaireResponse();
        questionnaireResponse2.id = "questionnaireResponse2";
        questionnaireResponse2.questionnaireId = "q1"
        questionnaireResponse2.answeredTime = this.getDate()
        questionnaireResponse2.status = QuestionnaireResponseStatus.NotAnswered
        
        questionnaireResponse2.questions = new Map<Question,Answer>();
        
        const questionb1 = new Question();
        questionb1.question = "Hvad er din temperatur?"
        questionb1.type = QuestionTypeEnum.OBSERVATION
        questionb1.Id = "temp"
        
        const answerb1 = new NumberAnswer();
        answerb1.answer = 20;
        questionnaireResponse2.questions.set(questionb1,answerb1);
        
        const questionb2 = new Question();
        questionb2.question = "Hvad er din CRP?"
        questionb2.type = QuestionTypeEnum.OBSERVATION
        questionb2.Id = "CRP"
        
        const answerb2 = new NumberAnswer();
        answerb2.answer = 12;
        questionnaireResponse2.questions.set(questionb2,answerb2);
        
        const questionb3 = new Question();
        questionb3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        questionb3.type = QuestionTypeEnum.BOOLEAN;
        questionb3.Id = "betterToday"
        
        const answerb3 = new BooleanAnswer();
        answerb3.answer = true
        
        questionnaireResponse2.questions.set(questionb3,answerb3);
        this.questionnaireResponses.push(questionnaireResponse1)
        this.questionnaireResponses.push(questionnaireResponse2)
    }
    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse) : Promise<CallToActionMessage>{
        questionnaireResponse.id = "questionnaireResponse"+this.generateId() + "";
        this.questionnaireResponses.push(questionnaireResponse);

        const toReturn = new CallToActionMessage();
        toReturn.message = "Call the hospital man - U ill as fuu"
        return toReturn;
    }
    
    async GetQuestionnaireResponse(questionnaireResponseId: string) : Promise<QuestionnaireResponse>{
        console.log(questionnaireResponseId)
        const response = this.questionnaireResponses.find(x=>x.id == questionnaireResponseId);
        if(response)
            return response;

        throw new NotFoundError();
    }

    
    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) : Promise<Array<QuestionnaireResponse>>{        
        
        await new Promise(f => setTimeout(f, 1000));
        const fromElement = (page-1) * pagesize;
        const toElement = (page) * pagesize
        return this.questionnaireResponses.filter(x=>questionnaireIds.includes(x.questionnaireId)).slice(fromElement,toElement);
    }

    id : number = 100
    generateId() : number{
        return this.id++;
    }
}