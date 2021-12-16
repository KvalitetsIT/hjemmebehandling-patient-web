import { Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import { Component } from "react";
import IsEmptyCard from "../components/Cards/IsEmptyCard";
import { ErrorBoundary } from "../components/Layout/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import { Address } from "../components/Models/Address";
import Department, { PhoneHour, TimePeriod } from "../components/Models/Department";
import { DayEnum } from "../components/Models/Frequency";
import ICareplanService from "../services/interfaces/ICareplanService";
import ApiContext from "./_context";

interface State {
    department?: Department,
    loading: boolean
}
export default class ContactPage extends Component<{}, State> {
    careplanService!: ICareplanService;
    static contextType = ApiContext

    constructor(props: {}) {
        super(props);
        this.state = {
            department: undefined,
            loading: true
        }
    }
    async populateDepartments(): Promise<void> {
        //TODO : Get department info
        const department = new Department();
        department.name = "Infektionssygdomme"
        department.phoneNumber = "83749382"

        const address = new Address();
        address.city = "Aarhus N"
        address.country = "Danmark"
        address.street = "Palle Juul-Jensen Boulevard 99, Indgang E"
        address.zipCode = "8200"
        department.address = address

        //TimePeriod1
        const timePeriod1 = new TimePeriod();
        timePeriod1.fromTime = "8.00"
        timePeriod1.toTime = "9.00"

        //TimePeriod2
        const timePeriod2 = new TimePeriod();
        timePeriod2.fromTime = "13.00"
        timePeriod2.toTime = "14.30"

        //TimePeriod3
        const timePeriod3 = new TimePeriod();
        timePeriod3.fromTime = "8.00"
        timePeriod3.toTime = "9.00"

        //TimePeriod4
        const timePeriod4 = new TimePeriod();
        timePeriod4.fromTime = "8.00"
        timePeriod4.toTime = "9.00"

        //TimePeriod5
        const timePeriod5 = new TimePeriod();
        timePeriod5.fromTime = "13.00"
        timePeriod5.toTime = "14.00"

        //PhoneHour1
        const phoneHour1 = new PhoneHour()
        phoneHour1.timePeriods = [timePeriod1, timePeriod2]
        phoneHour1.days = [DayEnum.Monday, DayEnum.Tuesday, DayEnum.Thursday]
        //PhoneHour2
        const phoneHour2 = new PhoneHour()
        phoneHour2.timePeriods = [timePeriod3]
        phoneHour2.days = [DayEnum.Wednesday]
        //PhoneHour3
        const phoneHour3 = new PhoneHour()
        phoneHour3.timePeriods = [timePeriod4, timePeriod5]
        phoneHour3.days = [DayEnum.Friday]

        department.phoneHours = [phoneHour1,phoneHour2,phoneHour3]
        this.setState({ department: department })
    }

    async componentDidMount(): Promise<void> {
        try {

            this.setState({ loading: true })

            await this.populateDepartments();

            this.setState({ loading: false })
        } catch (error) {
            this.setState(() => { throw error });
        }

    }
    initialiseServices(): void {
        this.careplanService = this.context.careplanService;
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

