import React from "react";
import { DayEnum } from "../../components/Models/Frequency";
import { PatientCareplan } from "../../components/Models/PatientCareplan";



export default interface IDateHelper {
    DateToString : (date : Date) => string
    DayIndexToDay : (dayIndex : number) => DayEnum
}
  