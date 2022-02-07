
import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";
import { Answer, NumberAnswer, StringAnswer, BooleanAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Contact } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import DetailedOrganization, { PhoneHour } from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import { DayEnum, Frequency, FrequencyEnum } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import SimpleDepartment from "@kvalitetsit/hjemmebehandling/Models/SimpleOrganization";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import { AnswerDto, AnswerDtoAnswerTypeEnum, CarePlanDto, ContactDetailsDto, EnableWhen as EnableWhenDto, FrequencyDto, FrequencyDtoWeekdaysEnum, OrganizationDto, PatientDto, PhoneHourDto, PhoneHourDtoWeekdaysEnum, PlanDefinitionDto, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum, QuestionnaireWrapperDto, ThresholdDto, ThresholdDtoTypeEnum, UserContext } from "../../generated/models";
import FhirUtils from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";
import PersonContact from "@kvalitetsit/hjemmebehandling/Models/PersonContact";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";


/**
 * This class maps from the external models (used in bff-api) to the internal models (used in frontend)
 */
export default class ExternalToInternalMapper extends BaseMapper {
    mapOrganization(response: OrganizationDto): DetailedOrganization {
        const organization = new DetailedOrganization()

        organization.id = response.id
        organization.name = response.name

        const address = new Address()
        address.street = response.street
        address.zipCode = response.postalCode
        address.city = response.city
        address.country = response.country
        organization.address = address

        organization.phoneNumber = response.phone

        organization.phoneHours = response?.phoneHours?.map(ph => this.mapPhoneHourDto(ph)) ?? [] //response.phoneHours.map(ph)

        return organization
    }

    mapPhoneHourDto(phoneHourDto: PhoneHourDto): PhoneHour {
        const phoneHour = new PhoneHour()

        phoneHour.days = phoneHourDto?.weekdays?.map(d => this.mapPhoneHourDtoWeekdaysEnum(d)) ?? []
        phoneHour.timePeriods = [{ fromTime: phoneHourDto.from, toTime: phoneHourDto.to }]

        return phoneHour
    }

    mapCarePlanDto(carePlanDto: CarePlanDto): PatientCareplan {

        const carePlan = new PatientCareplan();

        carePlan.id = FhirUtils.unqualifyId(carePlanDto.id);
        carePlan.planDefinitions = carePlanDto.planDefinitions!.map(pd => this.mapPlanDefinitionDto(pd))
        carePlan.questionnaires = carePlanDto?.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
        carePlan.patient = this.mapPatientDto(carePlanDto.patientDto!);
        carePlan.creationDate = carePlanDto.created
        carePlan.terminationDate = carePlanDto.endDate

        const department = new SimpleDepartment()
        department.id = carePlanDto.organizationId!
        department.name = carePlanDto.departmentName
        carePlan.organization = department

        return carePlan
    }

    buildTaskFromCarePlan(carePlan: CarePlanDto): Task {
        const task = new Task()

        task.cpr = carePlan.patientDto!.cpr!
        task.category = CategoryEnum.BLUE
        task.firstname = carePlan.patientDto!.givenName
        task.lastname = carePlan.patientDto!.familyName
        task.questionnaireResponseStatus = undefined
        task.carePlanId = carePlan.id

        const questionnaire = carePlan.questionnaires![0].questionnaire!
        task.questionnaireId = questionnaire.id!
        task.questionnaireName = questionnaire.title!

        task.answeredTime = undefined
        task.responseLinkEnabled = false

        return task
    }

    buildTaskFromQuestionnaireResponse(questionnaireResponse: QuestionnaireResponseDto): Task {
        const task = new Task()

        task.cpr = questionnaireResponse.patient!.cpr!
        task.category = this.mapTriagingCategory(questionnaireResponse.triagingCategory!)
        task.firstname = questionnaireResponse.patient!.givenName
        task.lastname = questionnaireResponse.patient!.familyName
        task.questionnaireResponseStatus = this.mapExaminationStatus(questionnaireResponse.examinationStatus!)
        task.questionnaireId = questionnaireResponse.questionnaireId!
        task.questionnaireName = questionnaireResponse.questionnaireName!
        task.answeredTime = questionnaireResponse.answered!
        task.responseLinkEnabled = true

        return task
    }

    mapPlanDefinitionDto(planDefinitionDto: PlanDefinitionDto): PlanDefinition {

        const planDefinition = new PlanDefinition()

        planDefinition.id = planDefinitionDto.id!
        planDefinition.name = planDefinitionDto.title ?? "Titel mangler";
        planDefinition.questionnaires = planDefinitionDto.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []

        return planDefinition

    }

    mapThresholdDtos(thresholdDtos: Array<ThresholdDto>): Array<ThresholdCollection> {

        console.log(thresholdDtos)
        const thresholds: ThresholdCollection[] = [];


        for (const thresholdDto of thresholdDtos) {
            let threshold = thresholds.find(x => x.questionId == thresholdDto.questionId);
            if (threshold === undefined) {
                threshold = new ThresholdCollection();
                threshold.questionId = thresholdDto.questionId!;
                thresholds.push(threshold);
            }

            if (!(thresholdDto.valueBoolean === undefined)) {
                console.log(threshold.questionId + "=thresholdOption")
                const thresholdOption = this.CreateOption(
                    thresholdDto.questionId!,
                    String(thresholdDto.valueBoolean!),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdOptions!.push(thresholdOption);
            }
            else {
                console.log(threshold.questionId + "=thresholdNumber")
                const thresholdNumber = this.CreateThresholdNumber(
                    thresholdDto.questionId!,
                    Number(thresholdDto.valueQuantityLow),
                    Number(thresholdDto.valueQuantityHigh),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdNumbers!.push(thresholdNumber);
            }
        }
        console.log(thresholds)
        return thresholds;

    }
    mapWeekdayDto(weekdays: FrequencyDtoWeekdaysEnum[]): DayEnum[] {
        const dayEnums: DayEnum[] = [];
        for (const weekday of weekdays) {
            dayEnums.push(this.mapFrequencyDtoWeekdaysEnum(weekday));
        }
        return dayEnums;
    }


    mapQuestionDto(questionDto: QuestionDto): Question {
        const question = new Question()

        question.Id = questionDto.linkId!
        question.type = this.mapQuestionType(questionDto.questionType!)
        question.question = questionDto.text
        question.helperText = questionDto.helperText;
        //TODO: question.enableWhen = questionDto.
        if (questionDto.enableWhens !== undefined) {
            question.enableWhen = this.mapEnableWhen(questionDto.enableWhens![0])
        }
        if (questionDto.questionType === QuestionDtoQuestionTypeEnum.Boolean) {
            question.options = ["Ja", "Nej"]
        }
        if (questionDto.questionType === QuestionDtoQuestionTypeEnum.Choice) {
            question.options = questionDto.options
        }

        return question;
    }
    mapEnableWhen(enableWhen: EnableWhenDto): EnableWhen<boolean> {
        //throw new Error("Method not implemented.");
        const enable = new EnableWhen<boolean>()
        enable.questionId = enableWhen.answer?.linkId
        enable.answer = enableWhen.answer?.value == "true"

        return enable
    }

    mapQuestionType(type: QuestionDtoQuestionTypeEnum): QuestionTypeEnum {
        switch (type) {
            case QuestionDtoQuestionTypeEnum.Boolean:
                return QuestionTypeEnum.BOOLEAN
            case QuestionDtoQuestionTypeEnum.Choice:
                return QuestionTypeEnum.CHOICE
            case QuestionDtoQuestionTypeEnum.Integer:
                return QuestionTypeEnum.INTEGER
            case QuestionDtoQuestionTypeEnum.Quantity:
                return QuestionTypeEnum.OBSERVATION
            case QuestionDtoQuestionTypeEnum.String:
                return QuestionTypeEnum.STRING
            default:
                throw new Error('Could not map question type ' + type);
        }
    }

    mapTriagingCategory(category: QuestionnaireResponseDtoTriagingCategoryEnum): CategoryEnum {
        switch (category) {
            case QuestionnaireResponseDtoTriagingCategoryEnum.Green:
                return CategoryEnum.GREEN
            case QuestionnaireResponseDtoTriagingCategoryEnum.Yellow:
                return CategoryEnum.YELLOW
            case QuestionnaireResponseDtoTriagingCategoryEnum.Red:
                return CategoryEnum.RED
            default:
                throw new Error('Could not map category ' + category);
        }
    }

    mapTresholdCategory(category: ThresholdDtoTypeEnum): CategoryEnum {
        switch (category) {
            case ThresholdDtoTypeEnum.Normal:
                return CategoryEnum.GREEN
            case ThresholdDtoTypeEnum.Abnormal:
                return CategoryEnum.YELLOW
            case ThresholdDtoTypeEnum.Critical:
                return CategoryEnum.RED
            default:
                throw new Error('Could not map category ' + category);
        }
    }

    mapFrequencyDtoWeekdaysEnum(weekday: FrequencyDtoWeekdaysEnum): DayEnum {
        switch (weekday) {
            case FrequencyDtoWeekdaysEnum.Mon:
                return DayEnum.Monday;
            case FrequencyDtoWeekdaysEnum.Tue:
                return DayEnum.Tuesday;
            case FrequencyDtoWeekdaysEnum.Wed:
                return DayEnum.Wednesday;
            case FrequencyDtoWeekdaysEnum.Thu:
                return DayEnum.Thursday;
            case FrequencyDtoWeekdaysEnum.Fri:
                return DayEnum.Friday;
            case FrequencyDtoWeekdaysEnum.Sat:
                return DayEnum.Saturday;
            case FrequencyDtoWeekdaysEnum.Sun:
                return DayEnum.Sunday;

            default:
                throw new Error('Could not map weekday ' + weekday);
        }
    }

    mapPhoneHourDtoWeekdaysEnum(weekday: PhoneHourDtoWeekdaysEnum): DayEnum {
        switch (weekday) {
            case PhoneHourDtoWeekdaysEnum.Mon:
                return DayEnum.Monday;
            case PhoneHourDtoWeekdaysEnum.Tue:
                return DayEnum.Tuesday;
            case PhoneHourDtoWeekdaysEnum.Wed:
                return DayEnum.Wednesday;
            case PhoneHourDtoWeekdaysEnum.Thu:
                return DayEnum.Thursday;
            case PhoneHourDtoWeekdaysEnum.Fri:
                return DayEnum.Friday;
            case PhoneHourDtoWeekdaysEnum.Sat:
                return DayEnum.Saturday;
            case PhoneHourDtoWeekdaysEnum.Sun:
                return DayEnum.Sunday;
            default:
                throw new Error('Could not map weekday ' + weekday);
        }
    }

    mapUserFromExternalToInternal(user: UserContext): User {
        const internalUser = new User();
        //internalUser.autorisationsids = user.autorisationsids;
        //internalUser.email = user.email;
        internalUser.entitlements = user.entitlements?.map(e => this.mapSingleEntitlement(e)).filter(e => e != undefined);
        internalUser.firstName = user.firstName;
        internalUser.fullName = user.fullName;
        internalUser.lastName = user.lastName;
        //internalUser.orgId = user.orgId;
        //internalUser.orgName = user.orgName;
        internalUser.userId = user.userId!;

        return internalUser;
    }

    mapSingleEntitlement(entitlement: string): string {
        const splittedByUnderscore = entitlement.split("_");
        const lenght = splittedByUnderscore.length
        const mappedEntitlement = splittedByUnderscore[lenght - 1]
        return mappedEntitlement;
    }

    mapExaminationStatus(status: QuestionnaireResponseDtoExaminationStatusEnum): QuestionnaireResponseStatus {
        switch (status) {
            case QuestionnaireResponseDtoExaminationStatusEnum.NotExamined:
                return QuestionnaireResponseStatus.NotProcessed
            case QuestionnaireResponseDtoExaminationStatusEnum.UnderExamination:
                return QuestionnaireResponseStatus.InProgress
            case QuestionnaireResponseDtoExaminationStatusEnum.Examined:
                return QuestionnaireResponseStatus.Processed
            default:
                throw new Error('Could not map ExaminationStatus ' + status)
        }
    }

    mapPersonContactFromExternalToInternal(externalPersonContact: ContactDetailsDto | undefined): PersonContact {
        const internalPersonContact = new PersonContact();
        internalPersonContact.city = externalPersonContact?.city;
        internalPersonContact.country = externalPersonContact?.country;
        internalPersonContact.postalCode = externalPersonContact?.postalCode;
        internalPersonContact.primaryPhone = externalPersonContact?.primaryPhone;
        internalPersonContact.secondaryPhone = externalPersonContact?.secondaryPhone;
        internalPersonContact.street = externalPersonContact?.street;

        return internalPersonContact;
    }

    mapAnswerDto(answerDto: AnswerDto): Answer {

        switch (answerDto.answerType) {
            case AnswerDtoAnswerTypeEnum.Integer:
                return this.mapNumberedAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Quantity:
                return this.mapNumberedAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Boolean:
                return this.mapBooleanAnswer(answerDto);
            default:
                return this.mapStringAnswer(answerDto); //Treat as string as default
        }


    }

    mapStringAnswer(answerDto: AnswerDto): StringAnswer {
        const toReturn = new StringAnswer();
        toReturn.answer = answerDto.value!
        return toReturn;
    }

    mapNumberedAnswer(answerDto: AnswerDto): NumberAnswer {
        const toReturn = new NumberAnswer();
        toReturn.answer = Number.parseFloat(answerDto.value!)
        return toReturn;
    }

    mapBooleanAnswer(answerDto: AnswerDto): BooleanAnswer {
        const toReturn = new BooleanAnswer();
        const answerValue = answerDto.value?.toLowerCase()

        const isTrueOrFalse = answerValue == "true" || answerValue == "false"
        if (isTrueOrFalse) {
            toReturn.answer = answerValue == "true"
            return toReturn;
        }

        throw new Error("Answer in AnswerDto was not a boolean")
    }

    mapQuestionnaireResponseDto(questionnaireResponseDto: QuestionnaireResponseDto): QuestionnaireResponse {
        const response = new QuestionnaireResponse();
        //const response = this.getQuestionnaireResponse();
        response.id = FhirUtils.unqualifyId(questionnaireResponseDto.id!);
        response.questions = new Map<Question, Answer>();

        for (const pair of questionnaireResponseDto.questionAnswerPairs!) {
            const question = this.mapQuestionDto(pair.question!);
            const answer = this.mapAnswerDto(pair.answer!);
            response.questions.set(question, answer);
        }

        response.answeredTime = questionnaireResponseDto.answered;
        response.status = this.mapExaminationStatus(questionnaireResponseDto.examinationStatus!);
        response.examinedTime = questionnaireResponseDto.examined;
        if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Red) {
            response.category = CategoryEnum.RED;
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Yellow) {
            response.category = CategoryEnum.YELLOW;
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Green) {
            response.category = CategoryEnum.GREEN;
        } else {
            response.category = CategoryEnum.BLUE;
        }
        response.patient = this.mapPatientDto(questionnaireResponseDto.patient!);
        response.questionnaireId = FhirUtils.unqualifyId(questionnaireResponseDto.questionnaireId!)

        return response;
    }
    mapFrequencyDto(frequencyDto: FrequencyDto): Frequency {

        const frequency = new Frequency();

        frequency.repeated = FrequencyEnum.WEEKLY
        frequency.days = this.mapWeekdayDto(frequencyDto.weekdays!)
        frequency.deadline = frequencyDto.timeOfDay!

        return frequency;

    }

    mapQuestionnaireDto(wrapper: QuestionnaireWrapperDto): Questionnaire {

        const questionnaire = new Questionnaire()

        questionnaire.id = FhirUtils.unqualifyId(wrapper.questionnaire!.id!)
        questionnaire.name = wrapper.questionnaire!.title!
        questionnaire.frequency = this.mapFrequencyDto(wrapper.frequency!)
        questionnaire.thresholds = this.mapThresholdDtos(wrapper.thresholds!)
        questionnaire.questions = wrapper.questionnaire!.questions!.map(q => this.mapQuestionDto(q))

        return questionnaire
    }

    mapContactDetailsDto(patientDto: PatientDto): Contact {

        const contact = new Contact();
        contact.primaryPhone = patientDto.patientContactDetails?.primaryPhone;
        contact.secondaryPhone = patientDto.patientContactDetails?.primaryPhone;

        return contact;
    }

    
    mapPatientDto(patientDto: PatientDto): PatientDetail {
        let address: Address = {}
        if (patientDto.patientContactDetails) {
            address = this.mapAddress(patientDto.patientContactDetails)
        }

        const contactDetails = this.mapContactDetails(patientDto)

        const toReturn = new PatientDetail();
        toReturn.firstname = patientDto.givenName;
        toReturn.lastname = patientDto.familyName;
        toReturn.cpr = patientDto.cpr;
        toReturn.primaryPhone = patientDto.patientContactDetails?.primaryPhone
        toReturn.secondaryPhone = patientDto.patientContactDetails?.secondaryPhone
        toReturn.address = address
        toReturn.contact = contactDetails
        //toReturn.username = patientDto.customUserName
        return toReturn;
    }

    mapContactDetails(patientDto: PatientDto): Contact {
        const toReturn = new Contact();

        toReturn.fullname = patientDto?.primaryRelativeName ?? ''
        toReturn.affiliation = patientDto?.primaryRelativeAffiliation ?? ''
        toReturn.primaryPhone = patientDto?.primaryRelativeContactDetails?.primaryPhone ?? ''
        toReturn.secondaryPhone = patientDto?.primaryRelativeContactDetails?.secondaryPhone ?? ''
        return toReturn;

    }

    mapAddress(contactDetails: ContactDetailsDto): Address {
        const address = new Address();

        address.city = contactDetails?.city;
        address.country = contactDetails?.country;
        address.zipCode = contactDetails?.postalCode;
        address.street = contactDetails?.street;

        return address;
    }

    mapPatientContactDetails(patientContactDetails: ContactDetailsDto | undefined): Address {
        const address = new Address();
        address.city = patientContactDetails?.city;
        address.country = patientContactDetails?.country;
        address.zipCode = patientContactDetails?.postalCode;
        address.street = patientContactDetails?.street;
        return address;
    }
}