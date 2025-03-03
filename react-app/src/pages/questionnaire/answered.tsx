
import { Grid, Typography } from "@mui/material";
import React, { Component } from "react";

import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";

import QuestionnaireResponseTable from "../../components/Tables/QuestionnaireResponseTable";
import QuestionnaireAnswerCard from "../../components/Cards/QuestionnaireAnswerCard";
import ICareplanService from "../../services/interfaces/ICareplanService";
import ApiContext, { IApiContext } from "../_context";


import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";
import ScrollableRow from "../../components/ScrollableRow";
import IsEmptyCard from "../../components/Errorhandling/IsEmptyCard";
import IDateHelper from "../../components/Helpers/interfaces/IDateHelper";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { Questionnaire } from "../../components/Models/Questionnaire";

interface State {
    loadingPage: boolean;
    careplans: PatientCareplan[] | undefined;
    answeredTodayList?: Questionnaire[]
    answeredOtherdayList?: Questionnaire[]
}

export default class AnsweredPage extends Component<{}, State>{
    static contextType = ApiContext

    careplanService!: ICareplanService;
    questionnaireResponseService!: IQuestionnaireResponseService;
    dateHelper!: IDateHelper;

    constructor(props: {}) {
        super(props);
        this.state = {
            loadingPage: true,
            careplans: undefined,
            answeredOtherdayList: [],
            answeredTodayList: []
        }
    }

    initializeServices(): void {
        const api = this.context as IApiContext
        this.careplanService = api.careplanService;
        this.questionnaireResponseService = api.questionnaireResponseService;
        this.dateHelper = api.dateHelper;
    }

    async componentDidMount(): Promise<void> {

        try {
            const careplans = await this.careplanService.GetActiveCareplans()
            const questionnairesToAnswerToday: Questionnaire[] = []
            const questionnairesToAnswerOtherDay: Questionnaire[] = []

            const today = this.dateHelper.DayIndexToDay(new Date().getDay());

            careplans.forEach(careplan => {
                for (const questionnaire of careplan.questionnaires) {
                    if (questionnaire.frequency?.days.find(day => day === today)) {
                        questionnairesToAnswerToday.push(questionnaire)
                    }
                    else {
                        questionnairesToAnswerOtherDay.push(questionnaire);
                    }
                }
            })

            this.setState({
                careplans: careplans,
                answeredTodayList: questionnairesToAnswerToday,
                answeredOtherdayList: questionnairesToAnswerOtherDay,
                loadingPage: false
            })

        }
        catch (error) {
            this.setState(() => { throw error });
        }
    }

    render(): JSX.Element {
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }


    renderPage(): JSX.Element {

        const careplans = this.state.careplans;
        const allQuestionnaires = this.state.careplans?.flatMap(carePlan => carePlan.questionnaires);
        
        return (
            <IsEmptyCard list={careplans} jsxWhenEmpty="Ingen behandlingsplan fundet">
                <Grid container spacing={2}>
                    <IsEmptyCard list={allQuestionnaires} jsxWhenEmpty="Ingen spørgeskemaer fundet på behandlingsplan">
                        <Grid item xs={12} className="headline-wrapper">
                            <Typography className="headline">Spørgeskemaer til besvarelse i dag</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <IsEmptyCard list={this.state.answeredTodayList} jsxWhenEmpty="Du har ikke flere spørgeskemaer der skal besvares">
                                <ScrollableRow cols={2.5} jsxList={this.state.answeredTodayList!.map(questionnaire => {
                                    const carePLanIncludingTheQuestionnaire = careplans?.find(careplan => careplan.questionnaires.find(q => q.id == questionnaire.id))
                                    return (
                                        <QuestionnaireAnswerCard careplan={carePLanIncludingTheQuestionnaire} questionnaire={questionnaire} />
                                    )
                                })}
                                />
                            </IsEmptyCard>
                        </Grid>

                        <Grid item xs={12} className="headline-wrapper">
                            <Typography className="headline">Andre spørgeskemaer til besvarelse</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <IsEmptyCard list={this.state.answeredOtherdayList} jsxWhenEmpty="Ingen spørgeskemaer">
                                <ScrollableRow cols={2.5} jsxList={this.state.answeredOtherdayList!.map(questionnaire =>
                                    <QuestionnaireAnswerCard careplan={careplans?.find(careplan => careplan.questionnaires.find(q => q.id == questionnaire.id))} questionnaire={questionnaire} />
                                )}
                                />
                            </IsEmptyCard>
                        </Grid>
                    </IsEmptyCard>
                </Grid>

                <Grid paddingTop={10} container spacing={0}>
                    <Grid item xs={12} >
                        <Typography className="headline">Dine tidligere besvarelser</Typography>
                    </Grid>
                    <Grid item mt={0} mx={-3} sx={{ maxWidth: `calc(100% + 48px)`, flexBasis: `calc(100% + 48px)` }}>
                        <QuestionnaireResponseTable careplans={careplans!} />
                    </Grid>

                </Grid>
            </IsEmptyCard>
        )
    }
}