import { Typography } from '@material-ui/core';
import * as React from 'react';
import Button from '@mui/material/Button';
import { Component } from 'react';
import { Menu, MenuItem } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import ApiContext from '../../pages/_context';
import ICareplanService from '../../services/interfaces/ICareplanService';
import { PatientCard } from './PatientCard';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary';

export interface State {
    expand: boolean
    ancherEl: any;
    careplan?: PatientCareplan
}

export class PatientMenu extends Component<{}, State> {
    static displayName = PatientCard.name;
    static contextType = ApiContext
    careplanService!: ICareplanService;

    constructor(props: {}) {
        super(props);
        this.state = {
            expand: false,
            ancherEl: null,
            careplan: undefined
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    render(): JSX.Element {
        const contents = this.renderCard();
        return contents;
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
                        <ErrorBoundary>
                            <PatientCard/>
                        </ErrorBoundary>
                        <MenuItem onClick={this.logout}>
                                <Typography align="right" variant="body2">Log ud</Typography>
                            
                        </MenuItem>
                    </Menu>
                </div>

            </>
        )
    }
}