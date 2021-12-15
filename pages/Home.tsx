import { Grid, Typography } from "@mui/material";
import { Component } from "react";
import IsEmptyCard from "../components/Cards/IsEmptyCard";
import QuestionnaireAnswerCard from "../components/Cards/QuestionnaireAnswerCard";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { ScrollableRow } from "../components/Rows/HomePage/ScrollableRow";
import QuestionnaireResponseTable from "../components/Tables/QuestionnaireResponseTable";
import ICareplanService from "../services/interfaces/ICareplanService";
import ApiContext from "./_context";

interface State {
    careplan?: PatientCareplan,
    loading: boolean
}
export default class HomePage extends Component<{}, State> {
    careplanService!: ICareplanService;
    static contextType = ApiContext

    constructor(props: {}) {
        super(props);
        this.state = {
            careplan: undefined,
            loading: true
        }
    }
    async populateCareplan(): Promise<void> {
        const activeCareplan = await this.careplanService.GetActiveCareplan();
        this.setState({ careplan: activeCareplan })
    }
    async componentDidMount(): Promise<void> {
        try {

            this.setState({ loading: true })
            await this.populateCareplan();
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
        return (
            <>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>Spørgeskemaer til besvarelse</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <IsEmptyCard object={this.state.careplan} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                            <IsEmptyCard list={this.state.careplan?.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplanen"}>
                                <ScrollableRow jsxList={this.state.careplan!.questionnaires.map(q => <QuestionnaireAnswerCard questionnaire={q} showDeadline={true} />)} />
                            </IsEmptyCard>
                        </IsEmptyCard>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Dine målinger</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Dine tidligere besvarelser</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <IsEmptyCard object={this.state.careplan} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                            <QuestionnaireResponseTable careplan={this.state.careplan!} />
                        </IsEmptyCard>
                    </Grid>


                </Grid>

            </>
        )
    }
}

