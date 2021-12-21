import { Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { Component } from "react";
import IsEmptyCard from "../components/Cards/IsEmptyCard";
import { ErrorBoundary } from "../components/Layout/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import Department, {  } from "../components/Models/DetailedOrganization";
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
        const department = await this.organizationService.getOrganizationDetails(careplan.organization.id)
        
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
                                        <Typography variant="button">Telefontid</Typography>
                                        {department?.phoneHours?.map(phoneHour => {
                                            return (
                                                <Typography>{phoneHour.toString()}</Typography>
                                                )
                                            })}
                                        <br/>
                                        <Typography variant="button">Adresse</Typography>
                                        <Typography>{department?.address?.street}</Typography>
                                        <Typography>{department?.address?.zipCode} {department?.address?.city}</Typography>
                                        <br/>
                                        <Typography variant="h6">{department?.phoneNumber}</Typography>
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

