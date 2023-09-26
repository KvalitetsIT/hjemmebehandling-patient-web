import { Button, Grid, Typography } from "@mui/material";
import { Component } from "react";
import { Link } from "react-router-dom";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { MiniChartRow } from "../components/Cards/MiniChartRow";
import QuestionnaireAnswerCard from "../components/Cards/QuestionnaireAnswerCard";
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";
import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { BaseQuestion, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import ScrollableRow from "../components/ScrollableRow";
import QuestionnaireResponseTable from "../components/Tables/QuestionnaireResponseTable";
import ICareplanService from "../services/interfaces/ICareplanService";
import ApiContext, { IApiContext } from "./_context";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";

interface State {
    careplans?: PatientCareplan[],
    loading: boolean
}
export default class HomePage extends Component<{}, State> {
    careplanService!: ICareplanService;
    static contextType = ApiContext


    constructor(props: {}) {
        super(props);
        this.state = {
            careplans: undefined,
            loading: true
        }
    }
    async populateCareplan(): Promise<void> {
        const activeCareplans = await this.careplanService.GetActiveCareplans();
        this.setState({ careplans: activeCareplans })
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
        const api = this.context as IApiContext
        this.careplanService = api.careplanService;
    }
    render(): JSX.Element {
        this.initialiseServices();
        return this.state.loading ? <LoadingBackdropComponent /> : this.renderPage();
    }

    renderPage(): JSX.Element {
        const questionnaires = this.state.careplans?.flatMap(c => c.questionnaires);

        const observarionQuestions = questionnaires?.flatMap(questionnaire => questionnaire?.questions?.map(question => new QuestionQuestionnaire(question, questionnaire))).filter(x => x?.question.type === QuestionTypeEnum.OBSERVATION) ?? [];
        const careplan = this.state.careplans;
        const jsxList = this.state.careplans?.flatMap(careplan => careplan.questionnaires.map(q => <QuestionnaireAnswerCard careplan={careplan} questionnaire={q} />)) ?? [];

        return (
            <>
                <ErrorBoundary>
                    <IsEmptyCard list={this.state.careplans} jsxWhenEmpty={"Ingen behandlingsplaner fundet"}>
                        {this.state.careplans?.map(careplan => (
                            <IsEmptyCard object={careplan} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography className="headline">Spørgeskemaer til besvarelse</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <IsEmptyCard list={careplan.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplanen"}>
                                            <ErrorBoundary>
                                                <ScrollableRow cols={2} jsxList={jsxList} />
                                            </ErrorBoundary>
                                        </IsEmptyCard>
                                    </Grid>

                                    <Grid item xs={12} mt={6}>
                                        <Typography className="headline">Mine målinger</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <IsEmptyCard list={careplan.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplan"}>
                                            <IsEmptyCard list={careplan.questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplan"}>

                                                <IsEmptyCard object={careplan.questionnaires.find(qu => qu.questions?.find(x => x.type === QuestionTypeEnum.OBSERVATION))} jsxWhenEmpty={""}>
                                                    <ScrollableRow cols={3} jsxList={observarionQuestions.map((q) =>
                                                        <IsEmptyCard object={q} jsxWhenEmpty={"Intet spørgsmål fundet"}>
                                                            {q ? <MiniChartRow questionnaire={q.questionnaire} careplan={careplan} question={q.question!} /> : <></>}
                                                        </IsEmptyCard>)} />
                                                </IsEmptyCard>
                                            </IsEmptyCard>
                                        </IsEmptyCard>
                                    </Grid>
                                    <Grid item container xs={12} mt={6} alignItems="center">
                                        <Grid item xs={10}>
                                            <Typography className="headline">Mine tidligere besvarelser</Typography>
                                        </Grid>
                                        <Grid item xs={2} className="show-all-answered">
                                            <Button component={Link} to="/questionnaire/answered" variant="outlined" className="showAllButton">Vis alle</Button>
                                        </Grid>

                                        <IsEmptyCard object={careplan} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                                            <Grid item mt={2} mx={-3} sx={{ maxWidth: `calc(100% + 48px)`, flexBasis: `calc(100% + 48px)` }}>
                                                <ErrorBoundary>
                                                    <QuestionnaireResponseTable careplan={careplan} />
                                                </ErrorBoundary>
                                            </Grid>
                                        </IsEmptyCard>
                                    </Grid>
                                </Grid>

                            </IsEmptyCard>
                        ))}
                    </IsEmptyCard>
                </ErrorBoundary>
            </>
        )
    }
}

class QuestionQuestionnaire {
    question: BaseQuestion
    questionnaire: Questionnaire

    constructor(question: BaseQuestion, questionnaire: Questionnaire) {
        this.question = question;
        this.questionnaire = questionnaire;
    }
}