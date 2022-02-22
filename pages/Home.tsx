import { Button, Grid, Typography } from "@mui/material";
import { Component } from "react";
import { Link } from "react-router-dom";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { MiniChartRow } from "../components/Cards/MiniChartRow";
import QuestionnaireAnswerCard from "../components/Cards/QuestionnaireAnswerCard";
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
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
        const questionnaires = this.state.careplan?.questionnaires;
        const observarionQuestions = questionnaires?.flatMap(x => x.questions).filter(x => x?.type == QuestionTypeEnum.OBSERVATION) ?? [];
        const careplan = this.state.careplan;

        return (
            <>
                <ErrorBoundary>
                    <IsEmptyCard object={this.state.careplan} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                        <Grid container spacing={2}>
                            <Grid item xs={10}>
                                <Typography>Spørgeskemaer til besvarelse</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button component={Link} to="/questionnaire/answered" variant="outlined">Vis alle</Button>
                            </Grid>
                            <Grid item xs={12}>

                                <IsEmptyCard list={this.state.careplan?.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplanen"}>
                                    <ErrorBoundary>
                                        <ScrollableRow cols={2.5} jsxList={this.state.careplan!.questionnaires.map(q => <QuestionnaireAnswerCard careplan={careplan} questionnaire={q} />)} />
                                    </ErrorBoundary>
                                </IsEmptyCard>

                            </Grid>
                            <Grid item xs={10}>
                                <Typography>Dine målinger</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button component={Link} to="/measurements" variant="outlined">Vis alle</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <IsEmptyCard list={this.state.careplan!.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplan"}>
                                    <IsEmptyCard list={this.state.careplan!.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplan"}>

                                        <IsEmptyCard object={this.state.careplan!.questionnaires.find(qu => qu.questions?.find(x => x.type == QuestionTypeEnum.OBSERVATION))} jsxWhenEmpty={"Ingen målinger på behandlingsplanen"}>
                                            <ScrollableRow cols={2.5} jsxList={observarionQuestions.map((q) => <IsEmptyCard object={q} jsxWhenEmpty={"Intet spørgsmål fundet"}><MiniChartRow careplan={this.state.careplan!} question={q!} /></IsEmptyCard>)} />
                                        </IsEmptyCard>
                                    </IsEmptyCard>
                                </IsEmptyCard>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography>Dine tidligere besvarelser</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button component={Link} to="/questionnaire/answered" variant="outlined">Vis alle</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <IsEmptyCard object={this.state.careplan} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                                    <ErrorBoundary>
                                        <QuestionnaireResponseTable careplan={this.state.careplan!} />
                                    </ErrorBoundary>
                                </IsEmptyCard>
                            </Grid>
                        </Grid>
                    </IsEmptyCard>
                </ErrorBoundary>
            </>
        )
    }
}

