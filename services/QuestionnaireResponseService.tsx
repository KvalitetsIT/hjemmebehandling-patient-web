import IQuestionnaireResponseApi from "../apis/interfaces/IQuestionnaireResponseApi";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import BaseService from "./BaseService";
import IQuestionnaireResponseService from "./interfaces/IQuestionnaireResponseService";

export default class QuestionnaireResponseService extends BaseService implements IQuestionnaireResponseService{
    api : IQuestionnaireResponseApi;

    constructor(api : IQuestionnaireResponseApi){
        super()
        this.api = api;
    }
    async GetQuestionnaireResponse(questionnaireResponseId: string) : Promise<QuestionnaireResponse>{
        try {
            return await this.api.GetQuestionnaireResponse(questionnaireResponseId);
        }catch (error){
            return this.HandleError(error);
        }
    }

    async GetQuestionnaireResponses(carePlanId: string, questionnaireIds: string[], page : number, pagesize : number = 5) : Promise<QuestionnaireResponse[]>{
        try{
            this.ValidatePagination(page,pagesize);
            return this.api.GetQuestionnaireResponses(carePlanId,questionnaireIds,page,pagesize);
        } catch(error){
            return this.HandleError(error)
        }
    }

}