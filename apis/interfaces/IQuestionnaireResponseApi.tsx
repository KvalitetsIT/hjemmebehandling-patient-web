import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";

export default interface IQuestionnaireResponseApi {
    GetQuestionnaireResponses : (carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) => Promise<Array<QuestionnaireResponse>>;
    GetQuestionnaireResponse : (questionnaireResponseId : string) => Promise<QuestionnaireResponse>
    SubmitQuestionnaireResponse : (questionnaireResponse : QuestionnaireResponse ) => Promise<void>
}