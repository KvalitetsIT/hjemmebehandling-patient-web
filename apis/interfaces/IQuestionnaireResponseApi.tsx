import { QuestionnaireResponse } from "../../components/Models/QuestionnaireResponse";
import { QuestionnaireApi } from "../../generated";

export default interface IQuestionnaireResponseApi {
    GetQuestionnaireResponses : (carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) => Promise<Array<QuestionnaireResponse>>;
}