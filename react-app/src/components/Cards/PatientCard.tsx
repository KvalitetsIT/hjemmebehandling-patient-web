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
                
        let patients: PatientDetail[] | undefined = this.state.careplans?.filter(careplan => careplan.patient !== undefined).map(careplan => careplan.patient as PatientDetail)

        const contents = this.state.loading ? <Skeleton height="10em" width="12em" /> : this.renderCard(patients);
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


    renderCard(patients: PatientDetail[] | undefined): JSX.Element {
        
        let patient = patients && patients[0] ; // This is done since the patient details is global across every careplan

        return (

            <Card sx={{ borderRadius: 0 }} elevation={0}>
                <CardContent>
                    <Typography align="right" variant="h6">Dine oplysninger</Typography>
                </CardContent>
                <Divider />
                <CardContent>
                    <Typography align="right" variant="body2">{patient?.firstname} {patient?.lastname}</Typography>
                    <Typography align="right" variant="body2">{patient?.cprToString()}</Typography>
                    <br />
                    <Typography align="right" variant="body2">{patient?.address?.street}</Typography>
                    <Typography align="right" variant="body2">{patient?.address?.zipCode} {patient?.address?.city}</Typography>
                    <br />
                    <Typography align="right" variant="body2">{patient?.primaryPhonenumberToString()}</Typography>
                    <Typography align="right" variant="body2">{patient?.secondaryPhonenumberToString()}</Typography>
                    <br />
                    <Typography align="right" variant="body2">{(patient?.contact?.fullname !== "" ||
                        patient?.contact?.affiliation !== "" ||
                        patient?.contact?.primaryPhone !== "" ||
                        patient?.contact?.secondaryPhone !== "") ? "Primær kontakt" : ""}</Typography>
                    <Typography align="right" variant="body2">{patient?.contact?.fullname}</Typography>
                    <Typography align="right" variant="body2">{patient?.contact?.affiliation}</Typography>
                    <Typography align="right" variant="body2">{patient?.contact?.primaryPhonenumberToString()}</Typography>
                    <Typography align="right" variant="body2">{patient?.contact?.secondaryPhonenumberToString()}</Typography>
                </CardContent>
                <Divider />
            </Card>
        )
    }
}