












import BaseApi from "../../components/BaseLayer/BaseApi";
import { Address } from "../../components/Models/Address";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { ContactDetails } from "../../components/Models/Contact";
import { EnableWhen } from "../../components/Models/EnableWhen";
import { Frequency, DayEnum } from "../../components/Models/Frequency";
import { MeasurementType } from "../../components/Models/MeasurementType";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { PrimaryContact } from "../../components/Models/PrimaryContact";
import { Question, QuestionTypeEnum } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import SimpleOrganization from "../../components/Models/SimpleOrganization";
import { ThresholdCollection } from "../../components/Models/ThresholdCollection";
import { ThresholdNumber } from "../../components/Models/ThresholdNumber";
import ICareplanApi from "../interfaces/ICareplanApi";




export default class FakeCareplanApi extends BaseApi implements ICareplanApi {
    timeToWait: number = 1000;

    measurementTypeTemperatur: MeasurementType = new MeasurementType(); 
    measurementTypeSystolisk: MeasurementType = new MeasurementType();
    measurementTypeDiastolisk: MeasurementType = new MeasurementType();
    measurementTypePuls: MeasurementType = new MeasurementType();

    constructor() {
        super();
    
        this.measurementTypeTemperatur.displayName = "Temp"
        this.measurementTypeTemperatur.code = "Temp"
        this.measurementTypeTemperatur.system = "system"

        this.measurementTypeSystolisk.displayName = "Blodtryk systolsk;Arm"
        this.measurementTypeSystolisk.code = "SYS"
        this.measurementTypeSystolisk.system = "system"

        this.measurementTypeDiastolisk.displayName = "Blodtryk diastolsk;Arm"
        this.measurementTypeDiastolisk.code = "DIA"
        this.measurementTypeDiastolisk.system = "system"

        this.measurementTypePuls.displayName = "Puls;Hjerte"
        this.measurementTypePuls.code = "PUL"
        this.measurementTypePuls.system = "system"
        
    }

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

            const thresholdSimple = new ThresholdNumber();
            thresholdSimple.category = CategoryEnum.GREEN;
            thresholdSimple.from = 0;
            thresholdSimple.to = 10;
            

            const thresholdSys = new ThresholdNumber();
            thresholdSys.category = CategoryEnum.GREEN;
            thresholdSys.from = 0;
            thresholdSys.to = 10;

            const thresholdDia = new ThresholdNumber();
            thresholdDia.category = CategoryEnum.GREEN;
            thresholdDia.from = 0;
            thresholdDia.to = 15;

            this.measurementTypeSystolisk.threshold = thresholdSys;
            this.measurementTypeDiastolisk.threshold = thresholdDia;
            this.measurementTypeTemperatur.threshold = thresholdSimple;

            return [measurementType, this.measurementTypeSystolisk, this.measurementTypeDiastolisk, this.measurementTypeTemperatur];

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
        patient.primaryContact = [primaryContact];
        careplan.patient = patient;

        const questionnaire = new Questionnaire();
        questionnaire.id = "infektionsmedicinsk-q1"
        questionnaire.name = "infektionsmedicinsk-questionnaire-1"
        questionnaire.frequency = new Frequency();
        questionnaire.frequency.days = [DayEnum.Friday, DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday]
        questionnaire.frequency.deadline = "11:00"

        questionnaire.thresholds = [];
        questionnaire.staticReviewSummaryHtml = "Hvis der er noget, du er i tvivl om, eller du har praktiske problemer, kan du <b>altid</b> kontakte Infektionsklinikken på tlf. 78 45 28 64 på hverdage kl. 8.00 – 15.00. Uden for dette tidspunkt kan du kontakte Sengeafsnittet på tlf. 24 77 78 80."


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

        question1.question = "Indtast din morgen temperatur? x"
        question1.type = QuestionTypeEnum.OBSERVATION
        question1.measurementType = this.measurementTypeTemperatur

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


        const question4 = new Question();
        question4.Id = "choice1"
        question4.type = QuestionTypeEnum.CHOICE
        question4.helperText = "Vælg en af de følgende valgmuligheder"
        question4.question = "Hvor mange måltider får du dagligt?"
        question4.options = [{option: "1", comment:"", triage: CategoryEnum.GREEN}, {option: "2", comment:"", triage: CategoryEnum.YELLOW},{option: "3", comment:"", triage: CategoryEnum.RED}]


        const question5= new Question();
        question5.Id = "choice2"
        question5.type = QuestionTypeEnum.CHOICE
        question5.helperText = "Slutter dit CPR-nummer på ulige er du 'mand', ellers er du 'kvinde'"
        question5.question = "Er du mand eller kvinde?"
        question5.options = [{option: "Mand", comment:"", triage: CategoryEnum.GREEN}, {option: "Kvinde", comment:"", triage: CategoryEnum.RED}]


        questionnaire.questions[4] = question5;
        questionnaire.questions[3] = question4;
        questionnaire.questions[0] = question3;
        questionnaire.questions[2] = question2;
        questionnaire.questions[1] = question1;


        const questionnaire2 = new Questionnaire();
        questionnaire2.id = "infektionsmedicinsk-q2"
        questionnaire2.name = "infektionsmedicinsk-questionnaire-2"
        questionnaire2.frequency = new Frequency();
        questionnaire2.frequency.days = [DayEnum.Thursday]
        questionnaire2.frequency.deadline = "11:00"

        questionnaire2.questions = [];
        //questionnaire2.staticReviewSummaryHtml = ""

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
        questionb3.type = QuestionTypeEnum.BOOLEAN
        //questionb3.options = ["Ja", "Nej"]
        questionnaire2.questions[2] = question3;


        const questionnaire3 = new Questionnaire();
        questionnaire3.id = "infektionsmedicinsk-q3"
        questionnaire3.name = "gruppe-måling"
        questionnaire3.frequency = new Frequency();
        questionnaire3.frequency.days = [DayEnum.Thursday]
        questionnaire3.frequency.deadline = "11:00"

        questionnaire3.questions = [];
        //questionnaire2.staticReviewSummaryHtml = ""
        const t3 = new ThresholdCollection();
        t3.questionId = "blodtryk_sys"
        const t3green = new ThresholdNumber();
        t3green.category = CategoryEnum.GREEN;
        t3green.from = 0;
        t3green.to = 25;
        const t3yellow = new ThresholdNumber();
        t3yellow.category = CategoryEnum.YELLOW;
        t3yellow.from = 25;
        t3yellow.to = 50;
        const t3red = new ThresholdNumber();
        t3red.category = CategoryEnum.RED;
        t3red.from = 50;
        t3red.to = 100;


        t3.thresholdNumbers = [t3green, t3yellow, t3red]
        questionnaire3.thresholds = [t3];

        const questionBlodtryk = new Question();
        questionBlodtryk.Id = "blodtryk"
        questionBlodtryk.question = "Intast blodtryk?xx"
        questionBlodtryk.helperText = "SYS er det øverste tal på blodtryksapparatet, DIA er det mellemste tal og PUL er det nederste."
        questionBlodtryk.type = QuestionTypeEnum.GROUP

        const questionBlodtrykSys = new Question();
        questionBlodtrykSys.Id = "blodtryk_sys"
        questionBlodtrykSys.question = ""
        questionBlodtrykSys.type = QuestionTypeEnum.OBSERVATION
        questionBlodtrykSys.measurementType = this.measurementTypeSystolisk;
        const questionBlodtrykDia = new Question();
        questionBlodtrykDia.Id = "blodtryk_dia"
        questionBlodtrykDia.question = ""
        questionBlodtrykDia.type = QuestionTypeEnum.OBSERVATION
        questionBlodtrykDia.measurementType = this.measurementTypeDiastolisk
        const questionBlodtrykPul = new Question();
        questionBlodtrykPul.Id = "blodtryk_pul"
        questionBlodtrykPul.question = ""
        questionBlodtrykPul.type = QuestionTypeEnum.OBSERVATION
        questionBlodtrykPul.measurementType = this.measurementTypePuls
        
        questionBlodtryk.subQuestions = [questionBlodtrykSys, questionBlodtrykDia, questionBlodtrykPul]
        questionnaire3.questions[0] = questionBlodtryk;

        const questionnaire4 = new Questionnaire();
        questionnaire4.id = "infektionsmedicinsk-q4"
        questionnaire4.name = "multiple-choice"
        questionnaire4.frequency = new Frequency();
        questionnaire4.frequency.days = [DayEnum.Thursday]
        questionnaire4.frequency.deadline = "11:00"

        const choiceTal = new Question();
        choiceTal.Id = "smerte_tal"
        choiceTal.question = "Hvor store var dine smerter i aktivitet igår?";
        choiceTal.type = QuestionTypeEnum.CHOICE;

        const optionTal1 = { option: "1", comment: "Ingen smerte", triage: CategoryEnum.BLUE }
        const optionTal2 = { option: "2", comment: "", triage: CategoryEnum.BLUE }
        const optionTal3 = { option: "3", comment: "", triage: CategoryEnum.BLUE }
        const optionTal4 = { option: "4", comment: "", triage: CategoryEnum.BLUE }
        const optionTal5 = { option: "5", comment: "", triage: CategoryEnum.BLUE }
        const optionTal6 = { option: "6", comment: "", triage: CategoryEnum.BLUE }
        const optionTal7 = { option: "7", comment: "", triage: CategoryEnum.BLUE }
        const optionTal8 = { option: "8", comment: "", triage: CategoryEnum.BLUE }
        const optionTal9 = { option: "9", comment: "", triage: CategoryEnum.BLUE }
        const optionTal10 = { option: "10", comment: "Værst tænkelige/uudholdelige smerte", triage: CategoryEnum.BLUE }
        choiceTal.options = [optionTal1, optionTal2, optionTal3, optionTal4, optionTal5, optionTal6, optionTal7, optionTal8, optionTal9, optionTal10]

        const choiceTekst = new Question();
        choiceTekst.Id = "smerte_tekst"
        choiceTekst.question = "Da du havde smerter ved aktivitet, hvilken type aktivitet var det?";
        choiceTekst.type = QuestionTypeEnum.CHOICE;

        const optionTekst1 = { option: "Dagligedagens gøremål", comment: "Dette kan være at lave mad, tage ud og handle eller lignende", triage: CategoryEnum.BLUE }
        const optionTekst2 = { option: "Let aktivitet", comment: "Aktivitet uden høj puls. Eks. gå en tur med hunden eller rengøring", triage: CategoryEnum.BLUE }
        const optionTekst3 = { option: "Moderat aktivitet", comment: "Aktivitet med mellem høj puls. Eks. frisk gang eller badminton", triage: CategoryEnum.BLUE }
        const optionTekst4 = { option: "Høj aktivitet", comment: "Aktivitet med høj puls. Eks. løb eller hård styrketræning", triage: CategoryEnum.BLUE }
        choiceTekst.options = [optionTekst1, optionTekst2, optionTekst3, optionTekst4]
        
        questionnaire4.questions = [choiceTal, choiceTekst]

        careplan.questionnaires = [questionnaire4, questionnaire3, questionnaire, questionnaire2]

        careplan.organization = new SimpleOrganization();
        careplan.organization.id = "someOrgId"
        careplan.organization.name = "Infektionssygdomme"


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
        patient.primaryContact = [primaryContact];
        careplan.patient = patient;

        const questionnaire = new Questionnaire();
        questionnaire.id = "lungesygdomme-q1"
        questionnaire.name = "lungesygdomme-questionnaire-1"
        questionnaire.frequency = new Frequency();
        questionnaire.frequency.days = [DayEnum.Friday, DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday]
        questionnaire.frequency.deadline = "11:00"

        questionnaire.thresholds = [];
        questionnaire.staticReviewSummaryHtml = "Hvis der er noget, du er i tvivl om, eller du har praktiske problemer, kan du <b>altid</b> kontakte Lungeklinikken på tlf. 78 45 28 64 på hverdage kl. 8.00 – 15.00. Uden for dette tidspunkt kan du kontakte Sengeafsnittet på tlf. 24 77 78 80."


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
        questionnaire2.id = "lungesygdomme-q2"
        questionnaire2.name = "lungesygdomme-questionnaire-2"
        questionnaire2.frequency = new Frequency();
        questionnaire2.frequency.days = [DayEnum.Thursday]
        questionnaire2.frequency.deadline = "11:00"

        questionnaire2.questions = [];
        //questionnaire2.staticReviewSummaryHtml = ""

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
        questionb3.options = [{option: "Ja", comment: "Kommentar", triage: CategoryEnum.BLUE}, {option: "Nej", comment: "Kommentar", triage: CategoryEnum.BLUE}]
        questionnaire2.questions[2] = question3;


        careplan.questionnaires = [questionnaire, questionnaire2]

        careplan.organization = new SimpleOrganization();
        careplan.organization.id = "someOrgId"
        careplan.organization.name = "Lungesygdomme"
        //careplan.organization.


        return careplan
    }


}