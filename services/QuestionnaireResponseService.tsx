import IQuestionnaireResponseApi from "../apis/interfaces/IQuestionnaireResponseApi";
import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IQuestionnaireResponseService from "./interfaces/IQuestionnaireResponseService";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";

export default class QuestionnaireResponseService extends BaseService implements IQuestionnaireResponseService {
    api: IQuestionnaireResponseApi;

    constructor(api: IQuestionnaireResponseApi) {
        super()
        this.api = api;
    }
    async QuestionnaireHasBeenAnsweredToday(careplanId: string, questionnaire: Questionnaire): Promise<boolean> {
        const result = await this.GetQuestionnaireResponses(careplanId,[questionnaire.id],1,1);
        const latestResponseDate = result.find(x=>true)?.answeredTime
        console.log(latestResponseDate)
        if(!latestResponseDate)
            return false; //No responses at all

        const today = new Date();
        const hasTodaysDate = today.getDate() <= latestResponseDate.getDate();
        const hasTodaysMonth = today.getMonth() == latestResponseDate.getMonth();
        const hasTodaysYear = today.getFullYear() == latestResponseDate.getFullYear();
        console.log(hasTodaysDate+ "&&" +hasTodaysMonth +"&&"+ hasTodaysYear)
        return hasTodaysDate && hasTodaysMonth && hasTodaysYear
        
    }

    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse): Promise<void> {
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