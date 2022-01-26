import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";
import Department, { PhoneHour, TimePeriod } from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import { DayEnum } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";
import IOrganizationApi from "../interfaces/IOrganizationApi";

export default class FakeCareplanApi extends BaseApi implements IOrganizationApi{
    async getOrganizationDetails(orgId: string) : Promise<Department>{
        console.log(orgId);
        const department = new Department();
        department.name = "Infektionssygdomme"
        department.phoneNumber = "83749382"

        const address = new Address();
        address.city = "Aarhus N"
        address.country = "Danmark"
        address.street = "Palle Juul-Jensen Boulevard 99, Indgang E"
        address.zipCode = "8200"
        department.address = address

        //TimePeriod1
        const timePeriod1 = new TimePeriod();
        timePeriod1.fromTime = "8.00"
        timePeriod1.toTime = "9.00"

        //TimePeriod2
        const timePeriod2 = new TimePeriod();
        timePeriod2.fromTime = "13.00"
        timePeriod2.toTime = "14.30"

        //TimePeriod3
        const timePeriod3 = new TimePeriod();
        timePeriod3.fromTime = "8.00"
        timePeriod3.toTime = "9.00"

        //TimePeriod4
        const timePeriod4 = new TimePeriod();
        timePeriod4.fromTime = "8.00"
        timePeriod4.toTime = "9.00"

        //TimePeriod5
        const timePeriod5 = new TimePeriod();
        timePeriod5.fromTime = "13.00"
        timePeriod5.toTime = "14.00"

        //PhoneHour1
        const phoneHour1 = new PhoneHour()
        phoneHour1.timePeriods = [timePeriod1, timePeriod2]
        phoneHour1.days = [DayEnum.Monday, DayEnum.Tuesday, DayEnum.Thursday]
        //PhoneHour2
        const phoneHour2 = new PhoneHour()
        phoneHour2.timePeriods = [timePeriod3]
        phoneHour2.days = [DayEnum.Wednesday]
        //PhoneHour3
        const phoneHour3 = new PhoneHour()
        phoneHour3.timePeriods = [timePeriod4, timePeriod5]
        phoneHour3.days = [DayEnum.Friday]

        department.phoneHours = [phoneHour1,phoneHour2,phoneHour3]
        return department;
    }

}