

import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import { CriticalLevelEnum, InvalidInputModel } from "./Errors/InvalidInputError";
import IValidationService from "./interfaces/IValidationService";

export default class ValidationService extends BaseService implements IValidationService {
    async ValidateNumber(posibleNumber: string) : Promise<InvalidInputModel[]>{
        const erorrs : InvalidInputModel[] = []
        let propName = "Tal"
        if(posibleNumber.includes(",")){
            const error = new InvalidInputModel(propName,"Kommatal skal skrives med punktum")
            erorrs.push(error)
        }

        try{
            parseFloat(posibleNumber)
        } catch(e){
            const error = new InvalidInputModel(propName,"Skal være et tal")
            erorrs.push(error)
        }

        return erorrs;
    }

    async ValidateZipCode(zipCode: string): Promise<InvalidInputModel[]>{
        const erorrs : InvalidInputModel[] = []
        let propName = "Postnummer"
        if(zipCode.length !== 4){
            const error = new InvalidInputModel(propName,"Skal være 4 tegn")
            erorrs.push(error)
        }
        return erorrs;
    }

    async ValidateCPR(cpr: string) : Promise<InvalidInputModel[]>{
        const erorrs : InvalidInputModel[] = []
        let propName = "CPR"
    
        if(!cpr){
            const error = new InvalidInputModel(propName,"CPR ikke udfyldt")
            erorrs.push(error)
        }
            
        if(cpr && cpr?.length != 10){
            const error = new InvalidInputModel(propName,"CPR skal være 10 tegn")
            erorrs.push(error)
        }
        if(cpr?.length == 10 && !this.CalculateCPR(cpr)){
            const error = new InvalidInputModel(propName,"Muligvis ikke korrekt CPR", CriticalLevelEnum.WARNING)
            erorrs.push(error)
        }

        return erorrs;
    }

    async ValidatePhonenumber(phoneNumber: string) : Promise<InvalidInputModel[]>{
        const errors : InvalidInputModel[] = []   
        let propName = "Telefonnummer"
        if(!phoneNumber || phoneNumber === "")
            return [];

        if(!phoneNumber.includes("+")){
            const error = new InvalidInputModel(propName,"Telefonnummer skal indeholde landekode")
            errors.push(error)
        }

        if(phoneNumber.length != 11){
            const error = new InvalidInputModel(propName,"Telefonnummer skal være 11 karakter (inkl landekode)")
            errors.push(error)
        }

        return errors;
    }

    async ValidatePlanDefinitions(planDefinitions: PlanDefinition[]) : Promise<InvalidInputModel[]>{
        const errors : InvalidInputModel[] = []   
        let propName = "Patientgruppe"

        if(!planDefinitions || planDefinitions.length == 0){
            const error = new InvalidInputModel(propName,"Patient skal knyttes til minimum én patientgruppe ")
            errors.push(error)
        }

        return errors
    }


    private CalculateCPR(cpr : string) : boolean{
        //http://kode.tingeling.dk/cpr_fix/
        if(cpr.length != 10)
            return false;

        const cprNumbers = cpr.split("").map(x=>x as unknown as number);
        const controlNumber = [4,3,2,7,6,5,4,3,2]
        const constant = 11;

        let sum = 0;
        for(let i = 0; i<9; i++){
            let cprDigit = cprNumbers[i];
            let controlDigit = controlNumber[i];
            sum += cprDigit * controlDigit;
        }

        let b1 = constant - (sum % constant)
        let isCorrectCpr = b1 == cprNumbers[9]
        return isCorrectCpr
    }


}
  