import * as React from 'react';
import Button from '@mui/material/Button';
import { Component } from 'react';
import { Card, CardContent, ListItem, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext from '../../pages/_context';
import ICareplanService from '../../services/interfaces/ICareplanService';
import { PatientCard } from './PatientCard';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary';
import { ProfileIcon } from '../icons/Icons';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';

export interface State {
    expand: boolean
    ancherEl: any;

}

export class PatientMenu extends Component<{}, State> {
    static displayName = PatientCard.name;
    static contextType = ApiContext


    constructor(props: {}) {
        super(props);
        this.state = {
            expand: false,
            ancherEl: null,

        }

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }

    render(): JSX.Element {
        return this.renderCard();
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
                            <ProfileIcon></ProfileIcon>
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
                        <ErrorBoundary>
                            <PatientCard />
                        </ErrorBoundary>

                        <MenuItem sx={{ textAlign: "right" }} onClick={this.logout}>
                            <ListItemText>
                                <Typography fontWeight={"bold"} align={"right"} fontSize={"1em"} variant={"h6"}>Log ud</Typography>
                            </ListItemText>
                        </MenuItem>
                    </Menu>

                </div >

            </>
        )
    }
}
