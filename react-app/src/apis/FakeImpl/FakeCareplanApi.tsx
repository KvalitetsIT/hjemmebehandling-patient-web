
import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ContactDetails } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import { DayEnum, Frequency } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import SimpleOrganization from "@kvalitetsit/hjemmebehandling/Models/SimpleOrganization";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";
import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";
import ICareplanApi from "../interfaces/ICareplanApi";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { PrimaryContact } from "@kvalitetsit/hjemmebehandling/Models/PrimaryContact";

export default class FakeCareplanApi extends BaseApi implements ICareplanApi {
    timeToWait: number = 1000;

    async GetAllMeasurementTypes(organizationId: string): Promise<MeasurementType[]> {
        console.debug("GetAllMeasurementTypes for org:", organizationId);
        try {
            await new Promise(f => setTimeout(f, this.timeToWait));

            const measurementType = new MeasurementType();
            measurementType.code = "NPU08676";
            measurementType.displayName = "Legeme temp.;Pt";
            measurementType.system = "urn:oid:1.2.208.176.2.1";

            const threshold = new ThresholdNumber();
            threshold.id = "NPU08676";
            threshold.category = CategoryEnum.GREEN;
            threshold.from = 35;
            threshold.to = 43;

            measurementType.threshold = threshold;

            return [measurementType];

        } catch (error) {
            return await this.HandleError(error);
        }
    }

    async GetActiveCareplans(): Promise<PatientCareplan[]> {
        try {
            await new Promise(f => setTimeout(f, this.timeToWait));


            const careplans = [
                this.createFakeCareplan_1(),
                this.createFakeCareplan_2()
            ]


            return careplans;
        } catch (error) {
            return await this.HandleError(error);
        }
    }


    createFakeCareplan_1(): PatientCareplan {

        const careplan = new PatientCareplan();
        careplan.id = "careplan/infektionsmedicinsk-afdeling"

        const patient = new PatientDetail();
        patient.firstname = "Anders"
        patient.lastname = "Madsen"
        patient.cpr = "1212120382"


        const contactDetails = new ContactDetails();
        contactDetails.primaryPhone = "+4520304050"
        contactDetails.secondaryPhone = "+4520304051"


        const address = new Address();
        address.city = "Aarhus N"
        address.country = "Danmark"
        address.street = "Olof Palmes Allé 34"
        address.zipCode = "8200"
        contactDetails.address = address;

        patient.contact = contactDetails

        const primaryContact = new PrimaryContact();
        primaryContact.affiliation = "Kone"
        primaryContact.fullname = "Gitte Madsen"
        if (primaryContact.contact) primaryContact.contact.primaryPhone = "+4530405060"
        patient.primaryContacts = [primaryContact];
        careplan.patient = patient;

        const questionnaire = new Questionnaire();
        questionnaire.id = "q1"
        questionnaire.name = "infektionsmedicinsk-questionnaire-1"
        questionnaire.frequency = new Frequency();
        questionnaire.frequency.days = [DayEnum.Friday, DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday]
        questionnaire.frequency.deadline = "11:00"

        questionnaire.thresholds = [];


        questionnaire.questions = [];

        const question1 = new Question();
        const t1 = new ThresholdCollection();
        t1.questionId = "temp"
        //questionnaire.thresholds.push(t1);
        question1.Id = "temp"
        question1.abbreviation = "Temperatur"
        question1.helperText = "Hvis du får antibiotika på pumpe skal du svare nej hvis der har været problemer med indløb"
        const enableWhen = new EnableWhen<boolean>();
        enableWhen.questionId = "betterToday";
        enableWhen.answer = false;
        question1.enableWhen = enableWhen;

        question1.question = "Indtast din morgen temperatur?"
        question1.type = QuestionTypeEnum.OBSERVATION

        const question2 = new Question();
        question2.helperText = "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        const t2 = new ThresholdCollection();
        t2.questionId = "CRP"
        const t2green = new ThresholdNumber();
        t2green.category = CategoryEnum.GREEN;
        t2green.from = 0;
        t2green.to = 25;
        const t2yellow = new ThresholdNumber();
        t2yellow.category = CategoryEnum.YELLOW;
        t2yellow.from = 25;
        t2yellow.to = 50;
        const t2red = new ThresholdNumber();
        t2red.category = CategoryEnum.RED;
        t2red.from = 50;
        t2red.to = 100;


        t2.thresholdNumbers = [t2green, t2yellow, t2red]
        questionnaire.thresholds.push(t2);
        question2.Id = "CRP"
        question2.enableWhen = enableWhen;
        question2.question = "Indtast den målte CRP?"
        question2.abbreviation = "CRP"
        question2.type = QuestionTypeEnum.OBSERVATION

        const question3 = new Question();
        question3.Id = "betterToday"
        question3.helperText = "Mads er ved at pille ved sin skærm - Mon tabletten oplader"
        question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        question3.type = QuestionTypeEnum.BOOLEAN

        questionnaire.questions[0] = question3;
        questionnaire.questions[2] = question2;
        questionnaire.questions[1] = question1;


        const questionnaire2 = new Questionnaire();
        questionnaire2.id = "q2"
        questionnaire2.name = "infektionsmedicinsk-questionnaire-2"
        questionnaire2.frequency = new Frequency();
        questionnaire2.frequency.days = [DayEnum.Thursday]
        questionnaire2.frequency.deadline = "11:00"

        questionnaire2.questions = [];

        const questionb1 = new Question();
        questionb1.Id = "madDrivers"
        questionb1.question = "Antal sure lastbilchaufører i dag?"
        questionb1.type = QuestionTypeEnum.OBSERVATION
        questionnaire2.questions[0] = questionb1;

        const questionb2 = new Question();
        questionb2.Id = "drivesMercedes"
        questionb2.question = "Hvor mange lastbilchaufører har kørt Mercedes?"
        questionb2.type = QuestionTypeEnum.INTEGER
        questionnaire2.questions[1] = questionb2;

        const questionb3 = new Question();
        questionb3.Id = "umad"
        questionb3.question = "Føler du dig sur, fordi lastbilchaufører er sure?"
        questionb3.type = QuestionTypeEnum.CHOICE
        questionb3.options = ["Ja", "Nej"]
        questionnaire2.questions[2] = question3;


        careplan.questionnaires = [questionnaire, questionnaire2]

        careplan.organization = new SimpleOrganization();
        careplan.organization.id = "someOrgId"
        careplan.organization.name = "AndersTestAfdeling"


        return careplan
    }



    createFakeCareplan_2(): PatientCareplan {

        const careplan = new PatientCareplan();
        careplan.id = "careplan/afdeling-for-lungesygdomme"

        const patient = new PatientDetail();
        patient.firstname = "Anders"
        patient.lastname = "Madsen"
        patient.cpr = "1212120382"


        const contactDetails = new ContactDetails()
        contactDetails.primaryPhone = "+4520304050"
        contactDetails.secondaryPhone = "+4520304050"

        const address = new Address();
        address.city = "Aarhus N"
        address.country = "Danmark"
        address.street = "Olof Palmes Allé 34"
        address.zipCode = "8200"
        contactDetails.address = address;

        patient.contact = contactDetails


        const primaryContact = new PrimaryContact();
        primaryContact.affiliation = "Kone"
        primaryContact.fullname = "Gitte Madsen"
        if (primaryContact.contact) primaryContact.contact.primaryPhone = "+4530405060"
        patient.primaryContacts = [primaryContact];
        careplan.patient = patient;

        const questionnaire = new Questionnaire();
        questionnaire.id = "q1"
        questionnaire.name = "lungesygdomme-questionnaire-1"
        questionnaire.frequency = new Frequency();
        questionnaire.frequency.days = [DayEnum.Friday, DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday]
        questionnaire.frequency.deadline = "11:00"

        questionnaire.thresholds = [];


        questionnaire.questions = [];

        const question1 = new Question();
        const t1 = new ThresholdCollection();
        t1.questionId = "temp"
        //questionnaire.thresholds.push(t1);
        question1.Id = "temp"
        question1.abbreviation = "Temperatur"
        question1.helperText = "Hvis du får antibiotika på pumpe skal du svare nej hvis der har været problemer med indløb"
        const enableWhen = new EnableWhen<boolean>();
        enableWhen.questionId = "betterToday";
        enableWhen.answer = false;
        question1.enableWhen = enableWhen;

        question1.question = "Indtast din morgen temperatur?"
        question1.type = QuestionTypeEnum.OBSERVATION

        const question2 = new Question();
        question2.helperText = "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        const t2 = new ThresholdCollection();
        t2.questionId = "CRP"
        const t2green = new ThresholdNumber();
        t2green.category = CategoryEnum.GREEN;
        t2green.from = 0;
        t2green.to = 25;
        const t2yellow = new ThresholdNumber();
        t2yellow.category = CategoryEnum.YELLOW;
        t2yellow.from = 25;
        t2yellow.to = 50;
        const t2red = new ThresholdNumber();
        t2red.category = CategoryEnum.RED;
        t2red.from = 50;
        t2red.to = 100;


        t2.thresholdNumbers = [t2green, t2yellow, t2red]
        questionnaire.thresholds.push(t2);
        question2.Id = "CRP"
        question2.enableWhen = enableWhen;
        question2.question = "Indtast den målte CRP?"
        question2.abbreviation = "CRP"
        question2.type = QuestionTypeEnum.OBSERVATION

        const question3 = new Question();
        question3.Id = "betterToday"
        question3.helperText = "Mads er ved at pille ved sin skærm - Mon tabletten oplader"
        question3.question = "Har du fået den ordinerede antibiotika det sidste døgn?"
        question3.type = QuestionTypeEnum.BOOLEAN

        questionnaire.questions[0] = question3;
        questionnaire.questions[2] = question2;
        questionnaire.questions[1] = question1;


        const questionnaire2 = new Questionnaire();
        questionnaire2.id = "q2"
        questionnaire2.name = "lungesygdomme-questionnaire-2"
        questionnaire2.frequency = new Frequency();
        questionnaire2.frequency.days = [DayEnum.Thursday]
        questionnaire2.frequency.deadline = "11:00"

        questionnaire2.questions = [];

        const questionb1 = new Question();
        questionb1.Id = "madDrivers"
        questionb1.question = "Antal sure lastbilchaufører i dag?"
        questionb1.type = QuestionTypeEnum.OBSERVATION
        questionnaire2.questions[0] = questionb1;

        const questionb2 = new Question();
        questionb2.Id = "drivesMercedes"
        questionb2.question = "Hvor mange lastbilchaufører har kørt Mercedes?"
        questionb2.type = QuestionTypeEnum.INTEGER
        questionnaire2.questions[1] = questionb2;

        const questionb3 = new Question();
        questionb3.Id = "umad"
        questionb3.question = "Føler du dig sur, fordi lastbilchaufører er sure?"
        questionb3.type = QuestionTypeEnum.CHOICE
        questionb3.options = ["Ja", "Nej"]
        questionnaire2.questions[2] = question3;


        careplan.questionnaires = [questionnaire, questionnaire2]

        careplan.organization = new SimpleOrganization();
        careplan.organization.id = "someOrgId"
        careplan.organization.name = "AndersTestAfdeling"


        return careplan
    }


}