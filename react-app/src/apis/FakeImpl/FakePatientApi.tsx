

import BaseApi from "../../components/BaseLayer/BaseApi";
import { Address } from "../../components/Models/Address";
import { ContactDetails } from "../../components/Models/Contact";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { PrimaryContact } from "../../components/Models/PrimaryContact";
import IPatientApi from "../interfaces/iPatientApi";




export default class FakePatientApi extends BaseApi implements IPatientApi{
    
    async getPatient() : Promise<PatientDetail>{
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
        primaryContact.organisation = "Organisation/infektionsmedicinsk"
        
        if (primaryContact.contact) primaryContact.contact.primaryPhone = "+4530405060"
        patient.primaryContact = [primaryContact];

        return patient
    }

}