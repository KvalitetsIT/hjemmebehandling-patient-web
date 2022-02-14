import IQuestionnaireResponseApi from "../apis/interfaces/IQuestionnaireResponseApi";
import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IQuestionnaireResponseService, { QuestionAnswerPair } from "./interfaces/IQuestionnaireResponseService";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { DayEnum } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";

export default class QuestionnaireResponseService extends BaseService implements IQuestionnaireResponseService {
    api: IQuestionnaireResponseApi;
    datehelper: IDateHelper;

    constructor(api: IQuestionnaireResponseApi, datehelper: IDateHelper) {
        super()
        this.api = api;
        this.datehelper = datehelper;
    }

    GetQuestionAnswerFromMap(questionToAnswerMap: Map<Question, Answer> | undefined, questionId: string): QuestionAnswerPair | undefined {
        let toReturn: { question: Question, answer: Answer } | undefined = undefined;
        questionToAnswerMap?.forEach((answer, question) => {
            if (question.Id == questionId)
                toReturn = new QuestionAnswerPair(question,answer);
        });
        return toReturn;
    }

    async QuestionnaireShouldBeAnsweredToday(careplanId: string, questionnaire: Questionnaire): Promise<boolean> {
        try {


            // Check if the frequency matches today
            const todaysDayIndex = this.getTodaysDay();
            const frequencyIsToday: boolean = questionnaire.frequency?.days?.includes(todaysDayIndex) ?? false
            if (!frequencyIsToday)
                return false; // If frequency does not match today we return false


            //Get latest questionnaire for given questionnaire and determine if it is today
            const result = await this.GetQuestionnaireResponses(careplanId, [questionnaire.id], 1, 1);
            const latestResponseDate = result.find(() => true)?.answeredTime
            if (latestResponseDate) {
                const today = new Date();
                const hasTodaysDate = today.getDate() <= latestResponseDate.getDate();
                const hasTodaysMonth = today.getMonth() == latestResponseDate.getMonth();
                const hasTodaysYear = today.getFullYear() == latestResponseDate.getFullYear();
                const hasBeenAnsweredToday = hasTodaysDate && hasTodaysMonth && hasTodaysYear;

                return !hasBeenAnsweredToday //If frequency matches today and we have a response that is today we return false
            }

            return true //If frequency matches today but we have no responses we return true

        } catch (error) {
            return this.HandleError(error);
        }


    }

    private getTodaysDay(): DayEnum {
        const today = new Date().getDay()
        return this.datehelper.DayIndexToDay(today);
    }

    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse): Promise<CallToActionMessage[]> {
        try {
            return await this.api.SubmitQuestionnaireResponse(questionnaireResponse);
        } catch (error) {
            return this.HandleError(error);
        }
    }
    async GetQuestionnaireResponse(questionnaireResponseId: string): Promise<QuestionnaireResponse> {
        try {
            return await this.api.GetQuestionnaireResponse(questionnaireResponseId);
        } catch (error) {
            return this.HandleError(error);
        }
    }

    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: string[], page: number, pagesize: number = 5): Promise<QuestionnaireResponse[]> {
        try {
            this.ValidatePagination(page, pagesize);
            return this.api.GetQuestionnaireResponses(carePlanId, questionnaireIds, page, pagesize);
        } catch (error) {
            return this.HandleError(error)
        }
    }

}