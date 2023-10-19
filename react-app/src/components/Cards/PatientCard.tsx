import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Divider, Skeleton, Typography } from '@mui/material';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext, { IApiContext } from '../../pages/_context';
import ICareplanService from '../../services/interfaces/ICareplanService';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';

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

        let pair = pairs && pairs[0];
        let { patient, carePlan } = pair!


        const hasContacts = patient.primaryContacts && patient.primaryContacts?.length > 0 
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
                    <Typography align="right" variant="body2">{patient.contact?.address?.street}</Typography>
                    <Typography align="right" variant="body2">{patient.contact?.address?.zipCode} {patient?.contact?.address?.city}</Typography>
                    <br />
                    <Typography align="right" variant="body2">{patient.contact?.primaryPhonenumberToString()}</Typography>
                    <Typography align="right" variant="body2">{patient.contact?.secondaryPhonenumberToString()}</Typography>
                    <br />
                    <Divider variant='fullWidth' />
                    <br />
                    <Typography align="right" fontWeight={"bold"} fontSize={"1em"} variant="h6">{hasContacts ? "Primær kontakt" : ""}</Typography>
                    <br />
                    <Typography align="right" variant="body2" fontWeight={"bold"}>{carePlan.organization?.name}</Typography>

                    {patient.primaryContacts && patient.primaryContacts.map(contact => (
                        <>
                            <Typography align="right" variant="body2">{contact?.fullname + ", " + contact?.affiliation}</Typography>
                            <Typography align="right" variant="body2">{contact?.contact?.primaryPhonenumberToString()}</Typography>
                            <Typography align="right" variant="body2">{contact?.contact?.secondaryPhonenumberToString()}</Typography>
                        </>
                    ))}

                </CardContent>
                <Divider />
            </Card>
        )
    }
}
