import { Answer, BooleanAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Contact } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import { DayEnum, Frequency } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { AnswerDtoAnswerTypeEnum, CarePlanDto, ContactDetailsDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PatientDto, PlanDefinitionDto, QuestionAnswerPairDto, QuestionDtoQuestionTypeEnum, QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum, QuestionnaireWrapperDto } from "../../generated/models";
import FhirUtils, { Qualifier } from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";


/**
 * This class maps from the internal models (used in frontend) to the external models (used in bff-api)
 */
export default class InternalToExternalMapper extends BaseMapper {

    MapQuestionnaireResponse(questionnaireResponse: QuestionnaireResponse): QuestionnaireResponseDto {
        const toReturn: QuestionnaireResponseDto = {
            id: FhirUtils.qualifyId(questionnaireResponse.id, Qualifier.QuestionnaireResponse),
            patient: this.mapPatient(questionnaireResponse.patient as PatientDetail),
            questionAnswerPairs: this.mapQuestionAnswerPair(questionnaireResponse.questions),
            questionnaireId: FhirUtils.qualifyId(questionnaireResponse.questionnaireId, Qualifier.Questionnaire),
            carePlanId: FhirUtils.qualifyId(questionnaireResponse.carePlanId, Qualifier.CarePlan),
        }
        return toReturn;
    }

    mapQuestionAnswerPair(questions: Map<Question, Answer> | undefined): QuestionAnswerPairDto[] | undefined {
        const toReturn: QuestionAnswerPairDto[] = []
        questions?.forEach((answer, question) => {

            const answerType = this.mapAnswerType(answer)
            let value = ''
            if (answerType === AnswerDtoAnswerTypeEnum.Quantity) {
                value = answer.ToString()
            }
            if (answerType === AnswerDtoAnswerTypeEnum.Boolean) {
                value = answer.ToString() === 'Ja' ? 'true' : 'false'
            }

            const qapair: QuestionAnswerPairDto = {
                answer: {
                    linkId: question.Id,
                    answerType: answerType,
                    value: value
                }
            }

            toReturn.push(qapair)
        })

        return toReturn;
    }

    mapQuestionType(type: QuestionTypeEnum): QuestionDtoQuestionTypeEnum {
        switch (type) {
            case QuestionTypeEnum.CHOICE:
                return QuestionDtoQuestionTypeEnum.Choice;
            case QuestionTypeEnum.INTEGER:
                return QuestionDtoQuestionTypeEnum.Integer;
            case QuestionTypeEnum.OBSERVATION:
                return QuestionDtoQuestionTypeEnum.Quantity;
            case QuestionTypeEnum.STRING:
                return QuestionDtoQuestionTypeEnum.String;
            case QuestionTypeEnum.BOOLEAN:
                return QuestionDtoQuestionTypeEnum.Boolean;

            default:
                throw new Error('Could not map QuestionDtoQuestionTypeEnum ' + type)
        }

    }

    mapAnswerType(answer: Answer): AnswerDtoAnswerTypeEnum {
        if (answer instanceof NumberAnswer)
            return AnswerDtoAnswerTypeEnum.Quantity

        if (answer instanceof StringAnswer)
            return AnswerDtoAnswerTypeEnum.String

        if (answer instanceof BooleanAnswer)
            return AnswerDtoAnswerTypeEnum.Boolean

        throw new Error('Could not map answer')
    }

    mapCategory(category: CategoryEnum): QuestionnaireResponseDtoTriagingCategoryEnum | undefined {
        switch (category) {
            case CategoryEnum.BLUE:
                return undefined
            case CategoryEnum.GREEN:
                return QuestionnaireResponseDtoTriagingCategoryEnum.Green
            case CategoryEnum.YELLOW:
                return QuestionnaireResponseDtoTriagingCategoryEnum.Yellow
            case CategoryEnum.RED:
                return QuestionnaireResponseDtoTriagingCategoryEnum.Red

            default:
                throw new Error('Could not map QuestionnaireResponseDtoTriagingCategoryEnum ' + category)
        }
    }

    mapCarePlan(carePlan: PatientCareplan): CarePlanDto {
        const carePlanDto = {
            id: "dummy",
            title: "Ny behandlingsplan", // TODO - set a title ...
            patientDto: this.mapPatient(carePlan.patient!),
            questionnaires: carePlan.questionnaires.map(q => this.mapQuestionnaire(q)),
            planDefinitions: carePlan.planDefinitions.map(pd => this.mapPlanDefinition(pd))
        }

        return carePlanDto

    }
    mapFrequency(frequency: Frequency): FrequencyDto {

        return {
            weekdays: frequency.days.map(d => this.mapDayEnum(d)),
            timeOfDay: frequency.deadline
        }
    }

    mapDayEnum(day: DayEnum): FrequencyDtoWeekdaysEnum {
        switch (day) {
            case DayEnum.Monday:
                return FrequencyDtoWeekdaysEnum.Mon
            case DayEnum.Tuesday:
                return FrequencyDtoWeekdaysEnum.Tue;
            case DayEnum.Wednesday:
                return FrequencyDtoWeekdaysEnum.Wed;
            case DayEnum.Thursday:
                return FrequencyDtoWeekdaysEnum.Thu;
            case DayEnum.Friday:
                return FrequencyDtoWeekdaysEnum.Fri;
            case DayEnum.Saturday:
                return FrequencyDtoWeekdaysEnum.Sat;
            case DayEnum.Sunday:
                return FrequencyDtoWeekdaysEnum.Sun;

            default:
                throw new Error('Could not map category ' + day);
        }
    }

    mapQuestionnaireResponseStatus(status: QuestionnaireResponseStatus): QuestionnaireResponseDtoExaminationStatusEnum {
        switch (status) {
            case QuestionnaireResponseStatus.NotProcessed:
                return QuestionnaireResponseDtoExaminationStatusEnum.NotExamined
            case QuestionnaireResponseStatus.InProgress:
                return QuestionnaireResponseDtoExaminationStatusEnum.UnderExamination
            case QuestionnaireResponseStatus.Processed:
                return QuestionnaireResponseDtoExaminationStatusEnum.Examined
            default:
                throw new Error('Could not map QuestionnaireResponseStatus ' + status)
        }
    }

    mapWeekday(weekday: DayEnum): FrequencyDtoWeekdaysEnum {
        console.log(weekday);
        return FrequencyDtoWeekdaysEnum.Mon;

    }

    mapContactDetails(contactDetails: Contact): ContactDetailsDto {

        return {
            primaryPhone: contactDetails.primaryPhone,
            secondaryPhone: contactDetails.secondaryPhone,
        }

    }

    mapQuestionnaire(questionnaire: Questionnaire): QuestionnaireWrapperDto {

        return {
            questionnaire: {
                id: questionnaire.id,
                title: questionnaire.name
            },
            frequency: questionnaire.frequency ? this.mapFrequency(questionnaire.frequency) : undefined
        }

    }

    mapPlanDefinition(planDefinition: PlanDefinition): PlanDefinitionDto {

        return {
            id: planDefinition.id,
            name: planDefinition.name,
            questionnaires: planDefinition.questionnaires.map(q => this.mapQuestionnaire(q))
        }

    }

    mapPatient(patient: PatientDetail): PatientDto {
        const contactDetails: ContactDetailsDto = {}
        contactDetails.street = patient.address?.street
        contactDetails.postalCode = patient.address?.zipCode
        contactDetails.city = patient.address?.city
        contactDetails.primaryPhone = patient.primaryPhone
        contactDetails.secondaryPhone = patient.secondaryPhone

        let primaryRelativeContactDetails: ContactDetailsDto = {}
        if (patient.contact) {
            primaryRelativeContactDetails = {
                primaryPhone: patient?.contact.primaryPhone,
                secondaryPhone: patient?.contact.secondaryPhone
            }
        }

        return {
            givenName: patient.firstname,
            familyName: patient.lastname,
            cpr: patient.cpr,
            patientContactDetails: contactDetails,
            //primaryRelativeName: patient ? patient?.contact.fullname : "",
            //primaryRelativeAffiliation: patient?.contact.affiliation,
            primaryRelativeContactDetails: primaryRelativeContactDetails
        }
    }
}