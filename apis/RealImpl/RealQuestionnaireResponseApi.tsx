import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { QuestionnaireResponse } from "../../components/Models/QuestionnaireResponse";
import { CarePlanApi, QuestionnaireResponseApi } from "../../generated";
import BaseApi from "../BaseApi";
import ICareplanApi from "../interfaces/ICareplanApi";
import IQuestionnaireResponseApi from "../interfaces/IQuestionnaireResponseApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";

export default class RealQuestionnaireResponseApi extends BaseApi implements IQuestionnaireResponseApi {
    questionnaireResponseApi: QuestionnaireResponseApi;
    toInternal: ExternalToInternalMapper;
    toExternal: InternalToExternalMapper;
    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.questionnaireResponseApi = new QuestionnaireResponseApi();
    }
    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<QuestionnaireResponse[]> {
        try {
            const request = {
                carePlanId: carePlanId,
                pageNumber: page,
                pageSize: pagesize
            }
            const responseList = await this.questionnaireResponseApi.getQuestionnaireResponsesByCarePlanId(request)
            return  responseList.map(response => this.toInternal.mapQuestionnaireResponseDto(response))
        } catch (error) {
            return await this.HandleError(error);
        }
    }

    async GetQuestionnaireResponse(questionnaireResponseId: string): Promise<QuestionnaireResponse> {
        try {
            const request = {
                id: questionnaireResponseId
            }
            const response = await this.questionnaireResponseApi.getQuestionnaireResponseById(request)
            return this.toInternal.mapQuestionnaireResponseDto(response);
        } catch (error) {
            return await this.HandleError(error);
        }
    }

    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse): Promise<void> {
        try {
            const request = {
                questionnaireResponseDto: this.toExternal.MapQuestionnaireResponse(questionnaireResponse)
            }
            const response = await this.questionnaireResponseApi.submitQuestionnaireResponse(request)
        } catch (error) {
            return await this.HandleError(error);
        }
    }



}