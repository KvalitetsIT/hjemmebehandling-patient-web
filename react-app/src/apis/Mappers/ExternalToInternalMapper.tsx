
import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";
import { Answer, NumberAnswer, StringAnswer, BooleanAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ContactDetails } from "@kvalitetsit/hjemmebehandling/Models/Contact";
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
import { AnswerDto, AnswerDtoAnswerTypeEnum, CallToActionDTO, CarePlanDto, ContactDetailsDto, EnableWhen as EnableWhenDto, FrequencyDto, FrequencyDtoWeekdaysEnum, MeasurementTypeDto, OrganizationDto, PatientDto, PhoneHourDto, PhoneHourDtoWeekdaysEnum, PlanDefinitionDto, PrimaryContactDto, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum, QuestionnaireWrapperDto, ThresholdDto, ThresholdDtoTypeEnum, UserContext } from "../../generated/models";
import FhirUtils from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";
import PersonContact from "@kvalitetsit/hjemmebehandling/Models/PersonContact";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";
import { PrimaryContact } from "@kvalitetsit/hjemmebehandling/Models/PrimaryContact";


/**
 * This class maps from the external models (used in bff-api) to the internal models (used in frontend)
 */
export default class ExternalToInternalMapper extends BaseMapper {
    
    mapMeasurementType(measurementType: MeasurementTypeDto): MeasurementType {

        const toReturn = new MeasurementType();
        toReturn.displayName = measurementType.display
        toReturn.code = measurementType.code
        toReturn.system = measurementType.system

        if (measurementType.threshold) {
            toReturn.threshold = this.mapThresholdNumber(measurementType.threshold!);
        }
        return toReturn;
    }

    mapThresholdNumber(thresholdDto : ThresholdDto): ThresholdNumber {
        const number = new ThresholdNumber();
        number.from = thresholdDto.valueQuantityLow;
        number.to = thresholdDto.valueQuantityHigh;
        number.category = this.mapTresholdCategory(thresholdDto.type!);
        number.id = thresholdDto.questionId!;
        return number;
    }

    mapCallToActionMessage(response: CallToActionDTO): CallToActionMessage[] {

        if (!response.callToActions)
            return []

        return response.callToActions?.map(message => {
            const toReturn = new CallToActionMessage();
            toReturn.message = message;
            return toReturn;
        });

    }

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
        carePlan.planDefinitions = carePlanDto.planDefinitions?.map(p => this.mapPlanDefinitionDto(p)) ?? []
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

        const thresholds: ThresholdCollection[] = [];


        for (const thresholdDto of thresholdDtos) {
            let threshold = thresholds.find(x => x.questionId===thresholdDto.questionId);
            if (threshold === undefined) {
                threshold = new ThresholdCollection();
                threshold.questionId = thresholdDto.questionId!;
                thresholds.push(threshold);
            }

            if (!(thresholdDto.valueBoolean === undefined)) {
                const thresholdOption = this.CreateOption(
                    thresholdDto.questionId!,
                    String(thresholdDto.valueBoolean!),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdOptions!.push(thresholdOption);
            }
            else {
                const thresholdNumber = this.CreateThresholdNumber(
                    thresholdDto.questionId!,
                    Number(thresholdDto.valueQuantityLow),
                    Number(thresholdDto.valueQuantityHigh),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdNumbers!.push(thresholdNumber);
            }
        }
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
        question.abbreviation = questionDto.abbreviation

        if (questionDto.enableWhens!==undefined) {
            question.enableWhen = this.mapEnableWhen(questionDto.enableWhens![0])
        }
        if (questionDto.questionType === QuestionDtoQuestionTypeEnum.Boolean) {
            question.options = ["Ja", "Nej"]
        }
        if (questionDto.questionType === QuestionDtoQuestionTypeEnum.Choice) {
            question.options = questionDto.options
        }
        if (questionDto.measurementType!==undefined) {
            question.measurementType = this.mapMeasurementType(questionDto.measurementType);
        }

        return question;
    }
    mapEnableWhen(enableWhen: EnableWhenDto): EnableWhen<boolean> {
        //throw new Error("Method not implemented.");
        const enable = new EnableWhen<boolean>()
        enable.questionId = enableWhen.answer?.linkId
        enable.answer = enableWhen.answer?.value === "true"

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
        internalUser.entitlements = user.entitlements?.map(e => this.mapSingleEntitlement(e)).filter(e => e!==undefined);
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

        const isTrueOrFalse = answerValue === "true" || answerValue === "false"
        if (isTrueOrFalse) {
            toReturn.answer = answerValue === "true"
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

    mapPatientDto(patientDto: PatientDto): PatientDetail {
        const patient = new PatientDetail();
        patient.firstname = patientDto.givenName;
        patient.lastname = patientDto.familyName;
        patient.cpr = patientDto.cpr;
        patient.contact = patientDto.patientContactDetails ? this.mapContactDetailsDto(patientDto.patientContactDetails) : undefined 
        const primaryContacts = patientDto.primaryContacts ? this.mapPrimaryContactDtos(patientDto.primaryContacts) : []        
        patient.primaryContacts = primaryContacts

        //toReturn.username = patientDto.customUserName
        return patient;
    }


    mapContactDetailsDto(details: ContactDetailsDto): ContactDetails {
        const contactDetails = new ContactDetails();

        const address = new Address()
        address.city = details.city
        address.country = details.country
        address.street = details.street
        address.zipCode = details.postalCode

        contactDetails.address = address
        
        contactDetails.primaryPhone  = details?.primaryPhone
        contactDetails.secondaryPhone = details?.secondaryPhone

        return contactDetails
    }


    mapPrimaryContactDtos(contacts: PrimaryContactDto[]): PrimaryContact[] {
        return contacts.map(contact => {
            const primaryContact = new PrimaryContact() 
            primaryContact.fullname = contact.name ?? ''
            primaryContact.affiliation = contact.affiliation ?? ''

            const contactDetails = new ContactDetails();
            
            contactDetails.primaryPhone =  contact.contactDetails?.primaryPhone ?? ''
            contactDetails.secondaryPhone = contact.contactDetails?.secondaryPhone ?? ''
            
            return primaryContact
        })
    }
/*
    mapContactDetails(contacts: ContactDetailsDto): Contact {
        return contacts.map(contact => {
            const primaryContact = new PrimaryContact() 
            primaryContact.fullname = contact.name ?? ''
            primaryContact.affiliation = contact.affiliation ?? ''
            primaryContact.primaryPhone = contact.contactDetails?.primaryPhone ?? ''
            primaryContact.secondaryPhone = contact.contactDetails?.secondaryPhone ?? ''
            return primaryContact
        })
    }
*/
    mapAddress(contactDetails: ContactDetailsDto): Address {
        const address = new Address();

        address.city = contactDetails?.city;
        address.country = contactDetails?.country;
        address.zipCode = contactDetails?.postalCode;
        address.street = contactDetails?.street;

        return address;
    }

  
}