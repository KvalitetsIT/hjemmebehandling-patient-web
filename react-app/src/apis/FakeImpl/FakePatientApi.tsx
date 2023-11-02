import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import IPatientApi from "../interfaces/iPatientApi";
import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";
import { ContactDetails } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import { PrimaryContact } from "@kvalitetsit/hjemmebehandling/Models/PrimaryContact";

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