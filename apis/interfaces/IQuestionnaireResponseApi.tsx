import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";

/**
 * Containing methods that are using the auto-generated classes to contact the real api
 * This layer is the only layer that should know of both generated classes and internal classes
 */
export default interface IQuestionnaireResponseApi {
    /**
     * Get questionnaireresponses based on paramaters
     * @param careplanId responses should be linked to this careplan
     * @param questionnaireIds responses should be linked to theese questionnaires
     * @param page the page number
     * @param pagesize number of elements to retrieve
     * @returns A list of matching questionnaireresponses
     */
    GetQuestionnaireResponses : (carePlanId: string, questionnaireIds: Array<string>, page : number, pagesize : number) => Promise<Array<QuestionnaireResponse>>;

    /**
     * Get specific questionnaireresponse from id
     * @param questionnaireResponseId the unique id of the questionnaire
     * @returns one single questionnaireresponse matching the id
     */
    GetQuestionnaireResponse : (questionnaireResponseId : string) => Promise<QuestionnaireResponse>

    /**
     * Submit a questionnaireResponse
     * @param questionnaireResponse the response to submit
     * @returns void
     */
    SubmitQuestionnaireResponse : (questionnaireResponse : QuestionnaireResponse ) => Promise<CallToActionMessage>
}