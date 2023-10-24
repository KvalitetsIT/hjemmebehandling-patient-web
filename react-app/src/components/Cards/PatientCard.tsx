import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Divider, Skeleton, Typography } from '@mui/material';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext, { IApiContext } from '../../pages/_context';
import ICareplanService from '../../services/interfaces/ICareplanService';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import { ContactDetails } from '@kvalitetsit/hjemmebehandling/Models/Contact';
import { type } from 'os';
import { PrimaryContact } from '@kvalitetsit/hjemmebehandling/Models/PrimaryContact';
import SimpleOrganization from '@kvalitetsit/hjemmebehandling/Models/SimpleOrganization';

export interface State {
    loading: boolean;
    careplans?: PatientCareplan[]
}

export class PatientCard extends Component<{}, State> {
    static displayName = PatientCard.name;
    static contextType = ApiContext

    careplanService!: ICareplanService;

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            careplans: undefined
        }
    }

    render(): JSX.Element {
        this.initialiseServices();


        let careplans: PatientCareplan[] | undefined = this.state.careplans?.filter(careplan => careplan.patient !== undefined)

        const contents = this.state.loading ? <Skeleton height="10em" width="12em" /> : this.renderCard(careplans);
        return contents;
    }
    initialiseServices(): void {
        const api = this.context as IApiContext
        this.careplanService = api.careplanService;
    }

    async componentDidMount(): Promise<void> {
        try {
            this.setState({ loading: true })
            await this.PopulateCareplan();
            this.setState({ loading: false })
        } catch (error) {
            this.setState(() => { throw error });
        }
    }

    async PopulateCareplan(): Promise<void> {
        const activeCareplans = await this.careplanService.GetActiveCareplans();
        this.setState({ careplans: activeCareplans })
    }


    renderCard(carePlans: PatientCareplan[] | undefined): JSX.Element {

        const patients = carePlans && carePlans.map(careplan => (careplan.patient as PatientDetail))
        const pairs = carePlans && carePlans.map(careplan => ({ patient: (careplan.patient as PatientDetail), carePlan: careplan }))




        let patient = (pairs && pairs[0].patient)! // This is done sine the patient is the same for every careplan (Hopefully)

        const hasContacts = (patients?.flatMap(patient => patient.primaryContacts ?? []))!.length > 0

        const ContactDetails = (props: { contactDetails?: ContactDetails }) => {
            const { contactDetails } = props
            if (contactDetails) {
                return (
                    <>
                        <Typography align="right" variant="body2">{contactDetails.address?.street}</Typography>
                        <Typography align="right" variant="body2">{contactDetails.address?.zipCode} {contactDetails.address?.city}</Typography>
                        <br />
                        <Typography align="right" variant="body2">{contactDetails.primaryPhonenumberToString()}</Typography>
                        <Typography align="right" variant="body2">{contactDetails.secondaryPhonenumberToString()}</Typography>
                    </>
                )
            }
            return <></>
        }



        let folded: { contacts: PrimaryContact[]; departments: SimpleOrganization[] }[] = [];

        
        pairs?.map(({ patient }) => {
            
            if (!(folded.map(p => p.contacts).filter(p => this.deepEqual(p, patient.primaryContacts)).length > 0)) {
                let departments = pairs.filter(({ patient: p }) => this.deepEqual(p.primaryContacts, patient.primaryContacts)).map((p) => p.carePlan.organization)

                let contacts = patient.primaryContacts
                let pair: { contacts: PrimaryContact[]; departments: SimpleOrganization[] } = {
                    contacts: contacts!,
                    departments: departments.filter((item): item is SimpleOrganization => !!item)
                }

                folded.push(pair)
            }
        })

        return (

            <Card sx={{ borderRadius: 0 }} elevation={0}>
                <CardContent>
                    <Typography align="right" variant="h6">Dine oplysninger</Typography>
                </CardContent>
                <Divider />
                <CardContent>
                    <Typography align="right" fontWeight={"bold"} variant="body2">{patient?.firstname} {patient?.lastname}</Typography>
                    <Typography align="right" variant="body2">{patient?.cprToString()}</Typography>
                    <br />
                    <ContactDetails contactDetails={patient.contact} />
                    <br />
                    <Divider variant='fullWidth' />
                    <br />
                    {
                        hasContacts && <>
                            <Typography align="right" fontWeight={"bold"} fontSize={"1em"} variant="h6">{"Primær kontakt"}</Typography>


                            {folded?.map(({ contacts, departments }) => (
                                <>
                                    <br />
                                    <Typography align="right" variant="body2" fontWeight={"bold"}>{
                                        this.listNames(departments.map((department) => department.name).filter((item): item is string => !!item))
                                    }</Typography>

                                    {contacts && contacts.map(primaryContact => (
                                        <>
                                            <Typography align="right" variant="body2">{primaryContact?.fullname + ", " + primaryContact?.affiliation}</Typography>
                                            <ContactDetails contactDetails={primaryContact.contact} />
                                        </>
                                    ))}
                                </>
                            ))}
                        </>
                    }

                </CardContent>
                <Divider />
            </Card>
        )
    }


    private listNames(names: string[]): string {
        let text: string = ""
        names
            .map((n, i) => {

                let size = names.length

                let isLast = i == size - 1;

                let isSecondLast = i == size - 2;

                let suffix = ""

                suffix = isLast ? '' : (isSecondLast ? ' og ' : ', ')

                return n + suffix
            })
            .forEach(str => text = text + str)
        return text
    }

    private deepEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) {
          return true;
        }
      
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
          return false;
        }
      
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
      
        if (keys1.length !== keys2.length) {
          return false;
        }
      
        for (const key of keys1) {
          if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
            return false;
          }
        }
      
        return true;
      }
      

}
