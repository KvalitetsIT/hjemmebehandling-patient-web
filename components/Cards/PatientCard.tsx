import { Typography } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Divider, Skeleton } from '@mui/material';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext from '../../pages/_context';
import ICareplanService from '../../services/interfaces/ICareplanService';

export interface State {
    loading: boolean;
    careplan?: PatientCareplan
}

export class PatientCard extends Component<{}, State> {
    static displayName = PatientCard.name;
    static contextType = ApiContext
    careplanService!: ICareplanService;

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            careplan: undefined
        }
    }

    render(): JSX.Element {
        this.initialiseServices();
        const contents = this.state.loading ? <Skeleton height="10em" width="12em" /> : this.renderCard();
        return contents;
    }
    initialiseServices(): void {
        this.careplanService = this.context.careplanService;
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
        const activeCareplan = await this.careplanService.GetActiveCareplan();
        this.setState({ careplan: activeCareplan })
    }

    renderCard(): JSX.Element {
        const patient = this.state.careplan?.patient;
        console.log(patient)
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
                        <Typography align="right" variant="body2">Primære kontakt</Typography>
                        <Typography align="right" variant="body2">{patient?.contact?.fullname}</Typography>
                        <Typography align="right" variant="body2">{patient?.contact?.affiliation}</Typography>
                        <Typography align="right" variant="body2">{patient?.contact?.primaryPhonenumberToString}</Typography>
                        <Typography align="right" variant="body2">{patient?.contact?.secondaryPhonenumberToString}</Typography>
                    </CardContent>
                    <Divider />
                </Card>
        )
    }
}