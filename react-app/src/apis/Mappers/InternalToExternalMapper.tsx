import { Answer, BooleanAnswer, GroupAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ContactDetails } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import { DayEnum, Frequency } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { AnswerDto, AnswerDtoAnswerTypeEnum, CarePlanDto, ContactDetailsDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PatientDto, PlanDefinitionDto, PrimaryContactDto, QuestionAnswerPairDto, QuestionDtoQuestionTypeEnum, QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum, QuestionnaireWrapperDto } from "../../generated/models";
import FhirUtils, { Qualifier } from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";
import { PrimaryContact } from "@kvalitetsit/hjemmebehandling/Models/PrimaryContact";
import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";


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
            const value = this.mapAnswerValue(answer)
            
            let subAnswers: AnswerDto[] = [];
            if (answer instanceof GroupAnswer) {
                answer.subAnswers?.map(sa => {
                    subAnswers.push({
                        linkId: sa.questionId,
                        answerType: this.mapAnswerType(sa),
                        value: this.mapAnswerValue(sa)
                    })
                })
            }
            
            
            const qapair: QuestionAnswerPairDto = {
                answer: {
                    linkId: question.Id,
                    answerType: this.mapAnswerType(answer),
                    value: this.mapAnswerValue(answer),
                    subAnswers: subAnswers
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

        if (answer instanceof GroupAnswer)
            return AnswerDtoAnswerTypeEnum.Group

        throw new Error('Could not map answer')
    }

    mapAnswerValue(answer: Answer): string {
        let value = '';
        if (answer instanceof NumberAnswer) {
            value = answer.ToString();
        }
        else if (answer instanceof BooleanAnswer) {
            value = answer.ToString() === 'Ja' ? 'true' : 'false'
        }

        return value;
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
            id: planDefinition.id!,
            name: planDefinition.name,
            questionnaires: planDefinition?.questionnaires?.map(q => this.mapQuestionnaire(q)) ?? []
        }

    }

    mapPatient(patient: PatientDetail): PatientDto {


        const contactDetails: ContactDetailsDto = {}

        if (patient.contact) {

            contactDetails.address = {
                street: patient.contact.address?.street,
                postalCode: patient.contact?.address?.zipCode,
                city: patient.contact?.address?.city
            }

            contactDetails.phone = {
                primary: patient.contact?.primaryPhone,
                secondary: patient.contact?.secondaryPhone
            }
        }

        return {
            givenName: patient.firstname,
            familyName: patient.lastname,
            cpr: patient.cpr,
            contactsDetails: contactDetails,
            primaryContacts: (patient.primaryContact as PrimaryContact[]).map(contact => this.mapPrimaryContact(contact)) ?? []
        }
    }
    mapPrimaryContact(contact: PrimaryContact): PrimaryContactDto {
        return {
            affiliation: contact.affiliation,
            name: contact.fullname,
            contactDetails: contact.contact ? this.mapContactDetails(contact.contact) : undefined
        }
    }

    mapContactDetails(details: ContactDetails): ContactDetailsDto {

        const dto: ContactDetailsDto = {
            phone: {
                primary: details.primaryPhone,
                secondary: details.secondaryPhone,
            },
            address: {
                street: details.address?.street,
                country: details.address?.country,
                city: details.address?.city,
                postalCode: details.address?.zipCode
            }
        }

        return dto
    }

}