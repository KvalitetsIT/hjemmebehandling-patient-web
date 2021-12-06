import { Answer, NumberAnswer } from "../../components/Models/Answer";
import { Question, QuestionTypeEnum } from "../../components/Models/Question";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import IQuestionnaireResponseApi from "../interfaces/IQuestionnaireResponseApi";

export default class FakeQuestionnaireResponseApi implements IQuestionnaireResponseApi{
    async GetQuestionnaireResponse(questionnaireResponseId: string) : Promise<QuestionnaireResponse>{
        let questionnaireResponse1 = new QuestionnaireResponse();
        questionnaireResponse1.id = questionnaireResponseId;
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
        return questionnaireResponse1;
    }

    
    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) : Promise<Array<QuestionnaireResponse>>{
        const toReturn : QuestionnaireResponse[] = [];
        questionnaireIds.forEach( async questionnaireId => {
            let questionnaireResponse1 = await this.GetQuestionnaireResponse(questionnaireId)
            toReturn.push(questionnaireResponse1);
        })
        
        return toReturn;
    }

}