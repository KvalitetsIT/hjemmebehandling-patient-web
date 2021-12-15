import { Typography } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Component } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { PatientCareplan } from '../Models/PatientCareplan';
import ApiContext from '../../pages/_context';
import ICareplanService from '../../services/interfaces/ICareplanService';

export interface State {
    loading: boolean;
    expand: boolean
    ancherEl: any;
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
            expand: false,
            ancherEl: null,
            careplan: undefined
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render(): JSX.Element {
        this.initialiseServices();
        const contents = this.state.loading ? <LoadingSmallComponent /> : this.renderCard();
        return contents;
    }
    initialiseServices() : void {
        this.careplanService = this.context.careplanService;
    }

    async componentDidMount(): Promise<void> {
        try {
            await this.PopulateCareplan();
            this.setState({ loading: false })
        } catch (error) {
            this.setState(() => { throw error });
        }
    }

    async PopulateCareplan() : Promise<void> {
        const activeCareplan = await this.careplanService.GetActiveCareplan();
        this.setState({ careplan: activeCareplan })
    }

    handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
        this.setState({ ancherEl: event.currentTarget });
    }

    handleClose(): void {
        this.setState({ ancherEl: null });
    }

    logout(): void {
        window.location.href = "/oauth2/sign_out";
    }

    renderCard(): JSX.Element {
        const patient = this.state.careplan?.patient;
        return (
            <>
                <div className="user__context-wrapper">
                    <Button
                        className="profileButton"
                        id="basic-button"
                        aria-controls="basic-menu"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                        variant="text"
                        color="inherit"
                    >
                        <div>
                            <PersonOutlineIcon />
                        </div>
                    </Button>
                    <Menu
                        anchorEl={this.state.ancherEl}
                        id="basic-menu"
                        open={this.state.ancherEl}
                        onClose={this.handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <Card sx={{ borderRadius: 0 }} elevation={0}>
                            <CardContent>
                                <Typography align="right" variant="h6">Dine oplysninger</Typography>
                            </CardContent>
                            <Divider />
                            <CardContent>
                                <Typography align="right" variant="body2">{patient?.firstname} {patient?.lastname}</Typography>
                                <Typography align="right" variant="body2">{patient?.cpr}</Typography>
                                <br />
                                <Typography align="right" variant="body2">{patient?.address.street}</Typography>
                                <Typography align="right" variant="body2">{patient?.address.city}</Typography>
                                <br />
                                <Typography align="right" variant="body2">{patient?.primaryPhone}</Typography>
                                <br />
                                <Typography align="right" variant="body2">Primære kontakt</Typography>
                                <Typography align="right" variant="body2">{patient?.contact?.fullname}</Typography>
                                <Typography align="right" variant="body2">{patient?.contact?.affiliation}</Typography>
                                <Typography align="right" variant="body2">{patient?.contact?.primaryPhone}</Typography>

                            </CardContent>
                            <Divider />
                        </Card>
                        <MenuItem onClick={this.logout}>
                                <Typography align="right" variant="body2">Log ud</Typography>
                            
                        </MenuItem>
                    </Menu>
                </div>

            </>
        )
    }
}