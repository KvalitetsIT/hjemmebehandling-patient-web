import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { LatestResponseEnum } from "../QuestionnaireResponseService";

/**
 * QuestionnaireResponseService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IQuestionnaireResponseService {

    /**
     * Get questionnaireresponses based on paramaters
     * @param careplanId responses should be linked to this careplan
     * @param questionnaireIds responses should be linked to theese questionnaires
     * @param page the page number
     * @param pagesize number of elements to retrieve
     * @returns A list of matching questionnaireresponses
     */
    GetQuestionnaireResponses: (carePlanId: string, questionnaireIds: Array<string>, page: number, pagesize: number) => Promise<Array<QuestionnaireResponse>>;



    /**
     * Get questionnaireresponses based on paramaters
     * @param careplanIds responses should be linked to these careplans
     * @param questionnaireIds responses should be linked to theese questionnaires
     * @param page the page number
     * @param pagesize number of elements to retrieve
     * @returns A list of matching questionnaireresponses
     */
    GetQuestionnaireResponsesForMultipleCareplans: (carePlanIds: string[], questionnaireIds: Array<string>, page: number, pagesize: number) => Promise<Array<QuestionnaireResponse>>;

     

    /**
     * Get questionnaireresponse from id
     * @param questionnaireResponseId the id of the response
     * @returns the questionnaireresponse matching the id
     */
    GetQuestionnaireResponse: (questionnaireResponseId: string) => Promise<QuestionnaireResponse>;

    /**
     * Submit questionnaire response
     * @param questionnaireResponse the response to submit
     * @returns void
     */
    SubmitQuestionnaireResponse: (questionnaireResponse: QuestionnaireResponse) => Promise<CallToActionMessage[]>;

    /**
     * From a map containing questionToAnswer to a tuple with question and answer
     * @param questionToAnswerMap the QuestionAnswer-map to look in
     * @param questionId the question to search for
     * @returns a question/answer-tuple 
     */
    GetQuestionAnswerFromMap: (questionToAnswerMap: Map<Question, Answer> | undefined, questionId: string) => QuestionAnswerPair | undefined;
    

    /**
     * From a careplanId and a questionnaire, it calculates the answer-status of the questionnaire
     * 1) If no responses, we return NeverAnswered
     * 2) If latest response is today, we return HasBeenAnsweredToday
     * 3) If frequency matches today, we return ShouldBeAnsweredToday
     * 4) If non above, we return ShouldNotBeAnsweredToday
     * @param careplanId the id of the careplan, used to get responses to verify if the questionnaire has been answered today
     * @param questionnaire the questionnaire to validate
     * @returns the status 
     */
     GetQuestionnaireAnsweredStatus(careplanId: string, questionnaire: Questionnaire): Promise<LatestResponseEnum>


}

export class QuestionAnswerPair{
    question : Question
    answer : Answer
    constructor(question : Question, answer : Answer){
        this.question = question;
        this.answer = answer;
    }
}