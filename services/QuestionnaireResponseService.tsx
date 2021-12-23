import IQuestionnaireResponseApi from "../apis/interfaces/IQuestionnaireResponseApi";
import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IQuestionnaireResponseService from "./interfaces/IQuestionnaireResponseService";

export default class QuestionnaireResponseService extends BaseService implements IQuestionnaireResponseService {
    api: IQuestionnaireResponseApi;

    constructor(api: IQuestionnaireResponseApi) {
        super()
        this.api = api;
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