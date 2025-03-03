import { InvalidInputModel } from "../../components/Errorhandling/ServiceErrors/InvalidInputError";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { ThresholdCollection } from "../../components/Models/ThresholdCollection";




/**
 * CareplanService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IValidationService {
    /**
     * Validates CPR
     * @param cpr to validate
     * @returns List of errors
     */
     ValidateCPR : (cpr : string) => Promise<InvalidInputModel[]>

     /**
      * Validate phonenumber
      * @param phoneNumber to validate
      * @returns List of errors
      */
     ValidatePhonenumber : (phoneNumber : string) => Promise<InvalidInputModel[]>
 
     /**
      * Validate a plandefinition
      * @param planDefinitions to validate
      * @returns List of errors
      */
     ValidatePlanDefinitions : (planDefinitions : PlanDefinition[]) => Promise<InvalidInputModel[]>
 
     /**
      * ValidateZipCode
      * @param zipCode to validate
      * @returns List of errors
      */
     ValidateZipCode : (zipCode : string) => Promise<InvalidInputModel[]>;
    
    /**
     * Validate whether a given string is actual a number
     * @param posibleNumber a string containing the potential number
     * @returns List of errors if the string is not a number
     */
    ValidateNumber : (posibleNumber : string) => Promise<InvalidInputModel[]>;

    /**
     * Validates the value against the thresholdCollection, to validate whether the value is contained in the thresholdNumbers
     * @param value the value that should be validated
     * @param thresholdCollection The thresholds that should contain the value
     */
    ValidateQuestionInput(value: string, thresholdCollection?: ThresholdCollection): Promise<InvalidInputModel[]>
}
  