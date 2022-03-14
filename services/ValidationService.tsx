

import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IValidationService from "./interfaces/IValidationService";
import { CriticalLevelEnum, InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";

export default class ValidationService extends BaseService implements IValidationService {
    async ValidateNumber(posibleNumber: string): Promise<InvalidInputModel[]> {
        const erorrs: InvalidInputModel[] = []
        const propName = "Tal"
        if (posibleNumber.includes(",")) {
            const error = new InvalidInputModel(propName, "Kommatal skal skrives med punktum")
            erorrs.push(error)
        }

        const result = parseFloat(posibleNumber)
        if (isNaN(result)) {
            const error = new InvalidInputModel(propName, "Skal være et tal")
            erorrs.push(error)
        }

        return erorrs;
    }

    async ValidateZipCode(zipCode: string): Promise<InvalidInputModel[]> {
        const erorrs: InvalidInputModel[] = []
        const propName = "Postnummer"
        if (zipCode.length !== 4) {
            const error = new InvalidInputModel(propName, "Skal være 4 tegn")
            erorrs.push(error)
        }
        return erorrs;
    }

    async ValidateCPR(cpr: string): Promise<InvalidInputModel[]> {
        const erorrs: InvalidInputModel[] = []
        const propName = "CPR"

        if (!cpr) {
            const error = new InvalidInputModel(propName, "CPR ikke udfyldt")
            erorrs.push(error)
        }

        if (cpr && cpr?.length != 10) {
            const error = new InvalidInputModel(propName, "CPR skal være 10 tegn")
            erorrs.push(error)
        }
        if (cpr?.length == 10 && !this.CalculateCPR(cpr)) {
            const error = new InvalidInputModel(propName, "Muligvis ikke korrekt CPR", CriticalLevelEnum.WARNING)
            erorrs.push(error)
        }

        return erorrs;
    }

    async ValidatePhonenumber(phoneNumber: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        const propName = "Telefonnummer"
        if (!phoneNumber || phoneNumber === "")
            return [];

        if (!phoneNumber.includes("+")) {
            const error = new InvalidInputModel(propName, "Telefonnummer skal indeholde landekode")
            errors.push(error)
        }

        if (phoneNumber.length != 11) {
            const error = new InvalidInputModel(propName, "Telefonnummer skal være 11 karakter (inkl landekode)")
            errors.push(error)
        }

        return errors;
    }
    async ValidateQuestionInput(value: string, thresholdCollection?: ThresholdCollection): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        const propName = "Indtastning"

        if (thresholdCollection == undefined)
            return errors;

        const numberErrors = await this.ValidateNumber(value)
        if (numberErrors.length != 0)
            return numberErrors;

        const valueIsValid = thresholdCollection.thresholdNumbers?.find(threshold => (threshold.from ?? Number.MIN_VALUE) >= Number.parseFloat(value) && Number.parseFloat(value) <= (threshold.to ?? Number.MAX_VALUE))
        if (!valueIsValid) {
            const error = new InvalidInputModel(propName, "Indtastning ligger uden for almene områder")
            errors.push(error)
        }


        return errors;
    }

    async ValidatePlanDefinitions(planDefinitions: PlanDefinition[]): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        const propName = "Patientgruppe"

        if (!planDefinitions || planDefinitions.length == 0) {
            const error = new InvalidInputModel(propName, "Patient skal knyttes til minimum én patientgruppe ")
            errors.push(error)
        }

        return errors
    }


    private CalculateCPR(cpr: string): boolean {
        //http://kode.tingeling.dk/cpr_fix/
        if (cpr.length != 10)
            return false;

        const cprNumbers = cpr.split("").map(x => x as unknown as number);
        const controlNumber = [4, 3, 2, 7, 6, 5, 4, 3, 2]
        const constant = 11;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            const cprDigit = cprNumbers[i];
            const controlDigit = controlNumber[i];
            sum += cprDigit * controlDigit;
        }

        const b1 = constant - (sum % constant)
        const isCorrectCpr = b1 == cprNumbers[9]
        return isCorrectCpr
    }


}
