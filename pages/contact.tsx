import { Card, CardContent, CardHeader, Divider, Grid, Table, TableCell, TableRow, Typography } from "@mui/material";
import { Component } from "react";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import Department, {  } from "@kvalitetsit/hjemmebehandling/Models/DetailedOrganization";
import ICareplanService from "../services/interfaces/ICareplanService";
import IOrganizationService from "../services/interfaces/IOrganizationService";
import ApiContext from "./_context";

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
                    <IsEmptyCard object={department} jsxWhenEmpty={"Ingen informationer om afdelingen fundet"}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card>   
                                    <CardHeader subheader={department?.name}></CardHeader>
                                    <Divider />
                                    <CardContent>
                                        <Typography>På hverdage kan Infektionsklinikken kontaktes på tlf.: 40 45 98 12 følgende tidspunkter:</Typography>
                                        <br/>
                                        <Typography>Sekretær kl. 9.00-12.00</Typography>
                                        <br/>
                                        <Typography variant="button">Sygeplejerske:</Typography>

                                        <Table>
                                        <TableRow>
                                            <TableCell>Mandag</TableCell>
                                            <TableCell>kl. 8.15-9.00 og kl. 13.00-14.30</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Tirsdag</TableCell>
                                            <TableCell>kl. 8.15-9.00 og kl. 13.00-14.30</TableCell>
                                        </TableRow>
                                        
                                        <TableRow>
                                            <TableCell>Onsdag</TableCell>
                                            <TableCell>kl. 8.15-9.00</TableCell>
                                        </TableRow>
                                        
                                        <TableRow>
                                            <TableCell>Torsdag</TableCell>
                                            <TableCell>kl. 8.15-9.00 og kl. 13.00-14.30</TableCell>
                                        </TableRow>
                                        
                                        <TableRow>
                                            <TableCell>Fredag</TableCell>
                                            <TableCell>kl. 8.15-9.00 og kl. 13.00-14.30</TableCell>
                                        </TableRow>
                                        
                                        </Table>                                        
                                        <br/>
                                        <Typography>Ved behov for hjælp uden for disse tidspunkter kan sengeafsnittet kontaktes på telefon 24 77 78 80 (hele døgnet)</Typography>
                                        <br/>
                                        <Typography variant="button">Adresse</Typography>
                                        <Typography>{department?.name}</Typography>
                                        <Typography>Aarhus Universitetshospital</Typography>
                                        <Typography>{department?.address?.street} eller D3</Typography>
                                        <Typography>Krydspunkt: Infektionsklinikken E202 eller sengeafsnittet E201</Typography>
                                        <Typography>{department?.address?.zipCode} {department?.address?.city}</Typography>
                                                                                
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </IsEmptyCard>
                </ErrorBoundary>
            </>
        )
    }
}

