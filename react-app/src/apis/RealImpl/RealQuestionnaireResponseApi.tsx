import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Configuration, QuestionnaireResponseApi } from "../../generated";
import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";
import IQuestionnaireResponseApi from "../interfaces/IQuestionnaireResponseApi";
import ExternalToInternalMapper from "../Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "../Mappers/InternalToExternalMapper";
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";

export default class RealQuestionnaireResponseApi extends BaseApi implements IQuestionnaireResponseApi {
    questionnaireResponseApi: QuestionnaireResponseApi;
    toInternal: ExternalToInternalMapper;
    toExternal: InternalToExternalMapper;
    conf: Configuration = new Configuration({ basePath: '/api/proxy' });

    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
        this.questionnaireResponseApi = new QuestionnaireResponseApi(this.conf);
    }


    async GetQuestionnaireResponsesForMultipleCareplans(carePlanIds: string[], questionnaireIds: string[], page: number, pagesize: number) : Promise<QuestionnaireResponse[]>{
        try {
            const request = {
                carePlanIds: carePlanIds,
                pageNumber: page,
                questionnaireIds: questionnaireIds,
                pageSize: pagesize
            }
            const responseList = await this.questionnaireResponseApi.getQuestionnaireResponsesForMultipleCarePlans(request)
            return  responseList.map(response => this.toInternal.mapQuestionnaireResponseDto(response))
        } catch (error) {
            return await this.HandleError(error);
        }
    };

    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<QuestionnaireResponse[]> {
        try {
            const request = {
                carePlanId: carePlanId,
                pageNumber: page,
                questionnaireIds: questionnaireIds,
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

    async SubmitQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse): Promise<CallToActionMessage> {
        try {
            const request = {
                questionnaireResponseDto: this.toExternal.MapQuestionnaireResponse(questionnaireResponse)
            }
            const response = await this.questionnaireResponseApi.submitQuestionnaireResponse(request)
            return this.toInternal.mapCallToActionMessage(response);
        } catch (error) {
            return await this.HandleError(error);
        }
    }



}