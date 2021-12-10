import { Answer, NumberAnswer, StringAnswer } from "../../components/Models/Answer";
import { Question, QuestionTypeEnum } from "../../components/Models/Question";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import { NotFoundError } from "../../services/Errors/NotFoundError";
import IQuestionnaireResponseApi from "../interfaces/IQuestionnaireResponseApi";

export default class FakeQuestionnaireResponseApi implements IQuestionnaireResponseApi{
    questionnaireResponses : QuestionnaireResponse[] = [];

    constructor(){
        let questionnaireResponse1 = new QuestionnaireResponse();
        questionnaireResponse1.id = "questionnaireResponse1";
        questionnaireResponse1.questionnaireId = "q1"
        questionnaireResponse1.answeredTime = new Date();
        questionnaireResponse1.status = QuestionnaireResponseStatus.Processed

        questionnaireResponse1.questions = new Map<Question,Answer>();
        
        let question1 = new Question();
        question1.question = "Hvad er din temperatur?"
        question1.type = QuestionTypeEnum.OBSERVATION
        question1.Id = "temp"
        
        let answer1 = new NumberAnswer();
        answer1.answer = 37;
        questionnaireResponse1.questions.set(question1,answer1);

        let question2 = new Question();
        question2.question = "Hvad er din CRP?"
        question2.type = QuestionTypeEnum.OBSERVATION
        question2.Id = "CRP"
        
        let answer2 = new NumberAnswer();
        answer2.answer = 8;
        questionnaireResponse1.questions.set(question2,answer2);

        let question3 = new Question();
        question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        question3.type = QuestionTypeEnum.CHOICE;
        question3.options = ["Ja","Nej"]
        question3.Id = "betterToday"
        
        let answer3 = new StringAnswer();
        answer3.answer = "Ja"

        questionnaireResponse1.questions.set(question3,answer3);

        this.questionnaireResponses.push(questionnaireResponse1)
    }
    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse) : Promise<void>{
        questionnaireResponse.id = "questionnaireResponse"+this.generateId() + "";
        this.questionnaireResponses.push(questionnaireResponse);
    }

    async GetQuestionnaireResponse(questionnaireResponseId: string) : Promise<QuestionnaireResponse>{
        console.log(questionnaireResponseId)
        let response = this.questionnaireResponses.find(x=>x.id == questionnaireResponseId);
        if(response)
            return response;

        throw new NotFoundError();
    }

    
    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) : Promise<Array<QuestionnaireResponse>>{        
        return this.questionnaireResponses.filter(x=>questionnaireIds.includes(x.questionnaireId));
    }

    id : number = 100
    generateId() : number{
        return this.id++;
    }
}