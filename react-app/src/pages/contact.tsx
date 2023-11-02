import { Card, CardActions, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { Component } from "react";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import Department from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import ICareplanService from "../services/interfaces/ICareplanService";
import IOrganizationService from "../services/interfaces/IOrganizationService";
import ApiContext, { IApiContext } from "./_context";
import { PhoneIcon } from "../components/icons/Icons";
import { ContactCard } from "../components/Cards/ContactCard";

interface State {
    departments?: Department[],
    loading: boolean
}

export default class ContactPage extends Component<{}, State> {
    careplanService!: ICareplanService;
    organizationService!: IOrganizationService;
    static contextType = ApiContext

    constructor(props: {}) {
        super(props);
        this.state = {
            departments: undefined,
            loading: true
        }
    }


    async populateDepartments(): Promise<void> {
        //TODO : Get department info from some place
        this.setState({ loading: true })

        let departments: Department[] = await this.organizationService.getOrganizations();
        
        this.setState({ departments: departments })
        this.setState({ loading: false })
    }

    async componentDidMount(): Promise<void> {
        try {
            await this.populateDepartments();
        } catch (error) {
            this.setState(() => { throw error });
        }
    }

    initialiseServices(): void {
        const api = this.context as IApiContext
        this.careplanService = api.careplanService;
        this.organizationService = api.organizationService;
    }

    render(): JSX.Element {
        this.initialiseServices();
        return this.state.loading ? <LoadingBackdropComponent /> : this.renderPage();
    }

    renderPage(): JSX.Element {


        /*
        // Hermed et evt. udkast til en modelering af "Department"
        
        Department: {
            hospitalsnavn: String,
            addresse: {
                vej: String
                nummer/bogstav: String,
                postnummer: String,
                by: String,
            },
            krydspunkt: String,
            telefontider: [
                {
                    instans: String //sygeplejerske, sekratær etc., 
                    dage: [
                        {
                            dag: String // Mandag, Tirsdag etc.,
                            tidsrum: [
                                {
                                    start: Date //09:15,
                                    slut: Date //12.00,
                                },
                                {
                                    start: Date //13.00,
                                    slut: Date //16.00,
                                }

                            ]
                        }
                    ],
                    info: String // Ved behov for hjælp uden for ovenstående tidspunkter, ring på telefon 24 77 78 80 (hele døgnet)
                }
            ],
            åbningstider: [
                {
                    instans: String //sygeplejerske, sekratær etc., 
                    dage: [
                        {
                            dag: String // Mandag, Tirsdag etc.,
                            tidsrum: [
                                {
                                    start: Date //09:15,
                                    slut: Date //12.00,
                                },
                                {
                                    start: Date //13.00,
                                    slut: Date //16.00,
                                }

                            ]
                        }
                    ]
                }
            ],
           



        }
        */

        return (
            <>
                <ErrorBoundary>
                    <Grid item xs={12} className="headline-wrapper">
                        <Typography className="headline">Mine afdelinger</Typography>
                    </Grid>
                    {
                        this.state.departments?.map(department => (
                            <Grid>
                                <ContactCard department={department} />
                            </Grid>

                        ))
                    }

                </ErrorBoundary>
            </>
        )
    }
}

