import BaseApi from "../../components/BaseLayer/BaseApi";
import { Address } from "../../components/Models/Address";
import { TimePeriod, PhoneHour } from "../../components/Models/DetailedOrganization";
import { DayEnum } from "../../components/Models/Frequency";
import Department from "../../components/Models/DetailedOrganization"

import IOrganizationApi from "../interfaces/IOrganizationApi";
export default class FakeCareplanApi extends BaseApi implements IOrganizationApi{
    
    async getOrganizations(): Promise<Department[]> {
        return [await this.getOrganizationDetails("1234"), await this.getOrganizationDetails("4321")]
    }

    async getOrganizationDetails(orgId: string) : Promise<Department>{
        const department = new Department();
        department.name = "Infektionssygdomme"
        department.phoneNumber = "83749382"
        department.id = "Organisation/infektionsmedicinsk"
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