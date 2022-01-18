import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";

export default interface IQuestionnaireResponseService {
    GetQuestionnaireResponses: (carePlanId: string, questionnaireIds: Array<string>, page: number, pagesize: number) => Promise<Array<QuestionnaireResponse>>;
    GetQuestionnaireResponse: (questionnaireResponseId: string) => Promise<QuestionnaireResponse>;
    SubmitQuestionnaireResponse: (questionnaireResponse: QuestionnaireResponse) => Promise<void>;

    /**
     * From a careplanId and a questionnaire it calculates whether the questionnaire should be answered today
     * - It uses the questionnaires frequency to know if the day matches today
     * - It checks whether the questionnaire has already been answered
     */
    QuestionnaireShouldBeAnsweredToday: (careplanId: string, questionnaire: Questionnaire) => Promise<boolean>;
}