import { Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { Component } from "react";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import Department, {  } from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import ICareplanService from "../services/interfaces/ICareplanService";
import IOrganizationService from "../services/interfaces/IOrganizationService";
import ApiContext from "./_context";
import { CardActions } from "@material-ui/core";
import { PhoneIcon } from "../components/icons/Icons";

interface State {
    department?: Department,
    loading: boolean
}

export default class ContactPage extends Component<{}, State> {
    careplanService!: ICareplanService;
    organizationService!: IOrganizationService;
    static contextType = ApiContext

    constructor(props: {}) {
        super(props);
        this.state = {
            department: undefined,
            loading: true
        }
    }
    async populateDepartments(): Promise<void> {
        //TODO : Get department info from some place
        this.setState({ loading: true })

        const careplan = await this.careplanService.GetActiveCareplan();
        const department = await this.organizationService.getOrganizationDetails(careplan.organization!.id!)
        
        this.setState({ department: department })
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
        this.careplanService = this.context.careplanService;
        this.organizationService = this.context.organizationService;
    }

    render(): JSX.Element {
        this.initialiseServices();
        return this.state.loading ? <LoadingBackdropComponent /> : this.renderPage();
    }

    renderPage(): JSX.Element {

        const department = this.state.department;
        return (
            <>
                <ErrorBoundary>
                <Grid item xs={12} className="headline-wrapper">
                    <Typography className="headline">Mine afdelinger</Typography>
                </Grid>

                    <IsEmptyCard object={department} jsxWhenEmpty={"Ingen informationer om afdelingen fundet"}>
                        <Grid>
                            <Card>   
                                <CardHeader subheader={"Infektionssygdomme"}></CardHeader>
                                <Divider />
                                <CardContent>
                                    <Typography>Aarhus Universitetshospital</Typography>
                                    <Typography>Palle Juul-Jensen Boulevard 99, Indgang E eller D3</Typography>
                                    <Typography>Krydspunkt: Infektionsklinikken E202 eller sengeafsnittet E201</Typography>
                                    <Typography>8200 Aarhus N</Typography>

                                    <br/>
                                    <Typography sx={{ fontWeight: 'bold' }}>Infektionsklinikken</Typography>
                                    <Typography>Infektionsklinikken kan kontaktes telefonisk på 40 45 98 12 på hverdage i nedenstående tidsrum</Typography>
                                    <br/>
                                    <Typography sx={{ fontWeight: 'bold' }}>Sekretær</Typography>
                                    <Typography>Alle hverdage <span>kl. 9.00-12.00</span></Typography>
                                    <br/>
                                    <Typography sx={{ fontWeight: 'bold' }}>Sygeplejerske</Typography>
                                    <Typography>Mandag <span>kl. 8.15-9.00 og 13.00-14.30</span></Typography>
                                    <Typography>Tirsdag <span>kl. 8.15-9.00 og 13.00-14.30</span></Typography>
                                    <Typography>Onsdag <span>kl. 8.15-9.00</span></Typography>
                                    <Typography>Torsdag <span>kl. 8.15-9.00 og 13.00-14.30</span></Typography>
                                    <Typography>Fredag <span>kl. 8.15-9.00 og 13.00-14.00</span> </Typography> 
                                    <br/>
                                    <Typography sx={{ fontWeight: 'bold' }}>Sengeafsnittet</Typography>
                                    <Typography>Ved behov for hjælp uden for ovenstående tidspunkter, ring på telefon 24 77 78 80 (hele døgnet)</Typography>                                 
                                </CardContent>
                                <Divider />
                                <CardActions className="call-hospital-wrapper">
                                    <PhoneIcon></PhoneIcon>
                                    <Typography className="call-hospital" sx={{ textAlign: 'right' }}>40 45 98 12</Typography>    
                                </CardActions>
                            </Card>
                        </Grid>

                    </IsEmptyCard>
                </ErrorBoundary>
            </>
        )
    }
}

