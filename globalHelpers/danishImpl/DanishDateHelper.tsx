

import { DayEnum } from "../../components/Models/Frequency";
import IDateHelper from "../interfaces/IDateHelper";

export default class DanishDateHelper implements IDateHelper {
    
    DateToString (date: Date) : string{
        let toReturn = "";
        toReturn += date.getDate()
        toReturn += "/"
        toReturn += date.getMonth()+1 // Zero-indexed month.. Beacause JS..
        toReturn += "-"
        toReturn += date.getFullYear()
        //console.log(date.toLocaleDateString() + " => " + toReturn)
        return toReturn;
    }

    DayIndexToDay (dayIndex: number) : DayEnum{
        if(dayIndex === 0)
            return DayEnum.Sunday
        if(dayIndex === 1)
            return DayEnum.Monday
        if(dayIndex === 2)
            return DayEnum.Tuesday
        if(dayIndex === 3)
            return DayEnum.Wednesday
        if(dayIndex === 4)
            return DayEnum.Thursday
        if(dayIndex === 5)
            return DayEnum.Friday
        if(dayIndex === 6)
            return DayEnum.Saturday

        throw Error("dayIndex was not in range 0 <= x <= 6");
    }



}
  