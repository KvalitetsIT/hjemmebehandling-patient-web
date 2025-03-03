import IQuestionnaireResponseApi from "../apis/interfaces/IQuestionnaireResponseApi";
import BaseService from "../components/BaseLayer/BaseService";
import IDateHelper from "../components/Helpers/interfaces/IDateHelper";
import { Answer } from "../components/Models/Answer";
import { CallToActionMessage } from "../components/Models/CallToActionMessage";
import { DayEnum } from "../components/Models/Frequency";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";


import IQuestionnaireResponseService, { QuestionAnswerPair } from "./interfaces/IQuestionnaireResponseService";







export enum LatestResponseEnum {
    NeverAnswered,
    ShouldNotBeAnsweredToday,
    HasBeenAnsweredToday,
    ShouldBeAnsweredToday,
    Unknown
}

export default class QuestionnaireResponseService extends BaseService implements IQuestionnaireResponseService {
    api: IQuestionnaireResponseApi;
    datehelper: IDateHelper;

    constructor(api: IQuestionnaireResponseApi, datehelper: IDateHelper) {
        super()
        this.api = api;
        this.datehelper = datehelper;
    }
    GetQuestionAnswerFromMap(questionToAnswerMap: Map<Question, Answer<any>> | undefined, questionId: string): QuestionAnswerPair | undefined {
        let toReturn: { question: Question, answer: Answer<any> } | undefined = undefined;
        questionToAnswerMap?.forEach((answer, question) => {
            if (question.Id === questionId)
                toReturn = new QuestionAnswerPair(question, answer);
        });
        return toReturn;
    }




    async GetQuestionnaireAnsweredStatus(careplanId: string, questionnaire: Questionnaire): Promise<LatestResponseEnum> {
        try {

            //Get latest questionnaire for given questionnaire and determine if it is today
            const result = await this.GetQuestionnaireResponses(careplanId, [questionnaire.id], 1, 1);
            if (result.length === 0)
                return LatestResponseEnum.NeverAnswered;

            const latestResponseDate = result.find(() => true)!.answeredTime!;
            const today = new Date();
            const hasTodaysDate = today.getDate() <= latestResponseDate.getDate();
            const hasTodaysMonth = today.getMonth() === latestResponseDate.getMonth();
            const hasTodaysYear = today.getFullYear() === latestResponseDate.getFullYear();
            const hasBeenAnsweredToday = hasTodaysDate && hasTodaysMonth && hasTodaysYear;

            if (hasBeenAnsweredToday)
                return LatestResponseEnum.HasBeenAnsweredToday

            const todaysDayIndex = this.getTodaysDay();
            const frequencyIsToday: boolean = questionnaire.frequency?.days?.includes(todaysDayIndex) ?? false
            if (frequencyIsToday)
                return LatestResponseEnum.ShouldBeAnsweredToday; // If frequency does not match today we return false

            return LatestResponseEnum.ShouldNotBeAnsweredToday


        } catch (error) {
            return this.HandleError(error);
        }


    }

    private getTodaysDay(): DayEnum {
        const today = new Date().getDay()
        return this.datehelper.DayIndexToDay(today);
    }

    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse): Promise<CallToActionMessage> {
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


    async GetQuestionnaireResponsesForMultipleCareplans(carePlanIds: string[], questionnaireIds: string[], page: number, pagesize: number = 5): Promise<QuestionnaireResponse[]> {
        try {
            this.ValidatePagination(page, pagesize);
            return this.api.GetQuestionnaireResponsesForMultipleCareplans(carePlanIds, questionnaireIds, page, pagesize)
        } catch (error){
            return this.HandleError(error)
        }
    };

}

