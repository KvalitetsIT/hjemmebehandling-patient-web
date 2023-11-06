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
import IPatientService from '../../services/interfaces/IPatientService';
import IOrganizationApi from '../../apis/interfaces/IOrganizationApi';
import IOrganizationService from '../../services/interfaces/IOrganizationService';

export interface State {
    loading: boolean;
    patient?: PatientDetail
    departments?: SimpleOrganization[]
}




export class PatientCard extends Component<{}, State> {
    static displayName = PatientCard.name;
    static contextType = ApiContext

    patientService!: IPatientService;
    organisationService!: IOrganizationService;

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            patient: undefined
        }
    }

    render(): JSX.Element {
        this.initialiseServices();

        const contents = this.state.loading ? <Skeleton height="10em" width="12em" /> : this.renderCard();
        return contents;
    }
    initialiseServices(): void {
        const api = this.context as IApiContext

        this.organisationService = api.organizationService;
        this.patientService = api.patientService;
    }

    async componentDidMount(): Promise<void> {
        try {
            this.setState({ loading: true })
            await this.PopulateData();
            this.setState({ loading: false })
        } catch (error) {
            this.setState(() => { throw error });
        }
    }

    async PopulateData(): Promise<void> {
        const patient = await this.patientService.getPatient();
        const organisations = await this.organisationService.getOrganizations();
        this.setState({ patient: patient })
    }


    renderCard(): JSX.Element {
        const hasContacts = this.state.patient?.contact && (this.state.patient?.primaryContact as PrimaryContact[]).length > 0

        const ContactDetails = (props: { contactDetails?: ContactDetails }) => {

            const { contactDetails } = props

            if (contactDetails) {

                return (
                    <>
                        {
                            (contactDetails.address?.street || contactDetails.address?.zipCode || contactDetails.address?.city) && (
                                <>
                                    <Typography align="right" variant="body2">{contactDetails.address?.street}</Typography>
                                    <Typography align="right" variant="body2">{contactDetails.address?.zipCode} {contactDetails.address?.city}</Typography>
                                    <br />
                                </>
                            )
                        }
                        <Typography align="right" variant="body2">{contactDetails.primaryPhonenumberToString()}</Typography>
                        <Typography align="right" variant="body2">{contactDetails.secondaryPhonenumberToString()}</Typography>
                    </>
                )
            }
            return <></>
        }

        const patient = this.state.patient

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
                    <ContactDetails contactDetails={patient?.contact} />
                    <br />
                    <Divider variant='fullWidth' />
                    <br />
                    {
                        hasContacts && <>
                            <Typography align="right" fontWeight={"bold"} fontSize={"1em"} variant="h6">{"Primær kontakt"}</Typography>
                            {patient?.contact && (patient?.primaryContact as PrimaryContact[]).map(primaryContact => {
                                console.log("primaryContact", primaryContact)
                                return (
                                    <>
                                        <Typography align="right" variant="body2" fontWeight={"bold"}>{primaryContact.organisation}</Typography>
                                        <Typography align="right" variant="body2">{primaryContact?.fullname + ", " + primaryContact?.affiliation}</Typography>
                                        <ContactDetails contactDetails={primaryContact.contact} />
                                        <br />
                                    </>
                                )
                            })}
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
