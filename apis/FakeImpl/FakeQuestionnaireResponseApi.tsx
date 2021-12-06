import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import IQuestionnaireResponseApi from "../interfaces/IQuestionnaireResponseApi";

export default class FakeQuestionnaireResponseApi implements IQuestionnaireResponseApi{


    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) : Promise<Array<QuestionnaireResponse>>{
        const toReturn : QuestionnaireResponse[] = [];
        let questionnaireResponse1 = new QuestionnaireResponse();
        questionnaireResponse1.answeredTime = new Date();
        questionnaireResponse1.status = QuestionnaireResponseStatus.Processed
        toReturn.push(questionnaireResponse1);
        return toReturn;
    }

}