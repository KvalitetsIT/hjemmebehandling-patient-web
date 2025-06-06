import { Button, Grid, Typography } from "@mui/material";
import { Component } from "react";
import { Link } from "react-router-dom";

import { MiniChartRow } from "../components/Cards/MiniChartRow";
import QuestionnaireAnswerCard from "../components/Cards/QuestionnaireAnswerCard";

import { LoadingBackdropComponent } from "../components/Layout/LoadingBackdropComponent";


import ScrollableRow from "../components/ScrollableRow";
import QuestionnaireResponseTable from "../components/Tables/QuestionnaireResponseTable";
import ICareplanService from "../services/interfaces/ICareplanService";
import ApiContext, { IApiContext } from "./_context";
import { ErrorBoundary } from "../components/Errorhandling/ErrorBoundary";
import IsEmptyCard from "../components/Errorhandling/IsEmptyCard";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { QuestionTypeEnum, Question, BaseQuestion } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";


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
        const careplans = this.state.careplans
        const questionnaires = this.state.careplans?.flatMap(c => c.questionnaires);

        const observationQuestions = questionnaires?.flatMap(questionnaire => questionnaire?.questions?.map(question => new QuestionQuestionnaire(question, questionnaire))).filter(x => x?.question.type === QuestionTypeEnum.OBSERVATION || x?.question.type === QuestionTypeEnum.GROUP) ?? [];
        const jsxList = this.state.careplans?.flatMap(careplan => careplan.questionnaires.map(q => <QuestionnaireAnswerCard careplan={careplan} questionnaire={q} />)) ?? [];

        return (
            <>
                <ErrorBoundary>
                    <IsEmptyCard list={careplans} jsxWhenEmpty={"Ingen behandlingsplaner fundet"}>


                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className="headline">Spørgeskemaer til besvarelse</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <IsEmptyCard list={questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer på behandlingsplanen"}>
                                    <ErrorBoundary>
                                        <ScrollableRow cols={2} jsxList={jsxList} />
                                    </ErrorBoundary>
                                </IsEmptyCard>
                            </Grid>

                            <Grid item xs={12} mt={6}>
                                <Typography className="headline">Mine målinger</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <IsEmptyCard list={questionnaires} jsxWhenEmpty={"Ingen spørgeskemaer fundet"}>
                                    <ScrollableRow cols={3} jsxList={this.renderObservationsList(observationQuestions)}/>                                            
                                </IsEmptyCard>
                            </Grid>
                            <Grid item container xs={12} mt={6} alignItems="center">
                                <Grid item xs={10}>
                                    <Typography className="headline">Mine tidligere besvarelser</Typography>
                                </Grid>
                                <Grid item xs={2} className="show-all-answered">
                                    <Button component={Link} to="/questionnaire/answered" variant="outlined" className="showAllButton">Vis alle</Button>
                                </Grid>

                                <IsEmptyCard object={careplans} jsxWhenEmpty={"Ingen behandlingsplan fundet"}>
                                    <Grid item mt={0} mx={-3} sx={{ maxWidth: `calc(100% + 48px)`, flexBasis: `calc(100% + 48px)` }}>
                                        <ErrorBoundary>
                                            <QuestionnaireResponseTable careplans={careplans!} />
                                        </ErrorBoundary>
                                    </Grid>
                                </IsEmptyCard>
                            </Grid>
                        </Grid>


                    </IsEmptyCard>
                </ErrorBoundary>
            </>
        )
    }

    renderObservationsList(observarionQuestions: (QuestionQuestionnaire | undefined)[]): JSX.Element[] {
        const result: JSX.Element[] = [];

        observarionQuestions.forEach(q => {
            const careplan: PatientCareplan = this.state.careplans?.find(careplan => careplan.questionnaires.find(questionnaire => q?.questionnaire.id == questionnaire.id))!
            if (q && q.question!.type === QuestionTypeEnum.GROUP) {

                const groupQuestion = q.question as Question;
                groupQuestion.subQuestions?.map(subQuestion => {
                    result.push(
                        <IsEmptyCard object={q} jsxWhenEmpty={"Intet spørgsmål fundet"}>
                            {q ? <MiniChartRow questionnaire={q.questionnaire} careplan={careplan} question={q.question!} subQuestion={subQuestion} /> : <></>}
                        </IsEmptyCard>
                        )
                    })
                                                
            }
            else if (q && q.question!.type === QuestionTypeEnum.OBSERVATION) {
                result.push(
                    <IsEmptyCard object={q} jsxWhenEmpty={"Intet spørgsmål fundet"}>
                        {q ? <MiniChartRow questionnaire={q.questionnaire} careplan={careplan} question={q.question!} /> : <></>}
                    </IsEmptyCard>
                )

            }
        })
        return result;
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