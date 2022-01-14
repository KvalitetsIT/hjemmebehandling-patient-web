import { Box, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import QuestionnaireAnswerCard from "../../components/Cards/QuestionnaireAnswerCard";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { DayEnum } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import ICareplanService from "../../services/interfaces/ICareplanService";
import ApiContext from "../_context";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";

interface State {
    loadingPage: boolean
    careplan?: PatientCareplan
    answeredTodayList?: Questionnaire[]
    answeredOtherdayList?: Questionnaire[]
}

export default class UnAnsweredPage extends Component<{}, State>{
    static contextType = ApiContext
    careplanService!: ICareplanService;
    questionnaireResponseService!: IQuestionnaireResponseService;
    dateHelper!: IDateHelper;

    constructor(props: {}) {
        super(props)
        this.state = {
            loadingPage: true,
            careplan: undefined,
            answeredOtherdayList: [],
            answeredTodayList: []
        }
        this.shouldBeAnsweredToday = this.shouldBeAnsweredToday.bind(this);
    }

    initializeServices(): void {
        this.careplanService = this.context.careplanService;
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.dateHelper = this.context.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        this.setState({ loadingPage: true })
        try {

            const activeCareplan = await this.careplanService.GetActiveCareplan();
            const questionnairesToAnswerToday: Questionnaire[] = []
            const questionnairesToAnswerOtherDay: Questionnaire[] = []

            for (const questionnaire of activeCareplan.questionnaires) {
                const shouldBeAnsweredToday = await this.shouldBeAnsweredToday(questionnaire, activeCareplan);
                if (shouldBeAnsweredToday)
                    questionnairesToAnswerToday.push(questionnaire)
                else
                    questionnairesToAnswerOtherDay.push(questionnaire)
            }

            console.log(questionnairesToAnswerToday)
            this.setState({
                careplan: activeCareplan,
                answeredTodayList: questionnairesToAnswerToday,
                answeredOtherdayList: questionnairesToAnswerOtherDay
            })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loadingPage: false })
    }

    getTodaysDay(): DayEnum {
        const today = new Date().getDay()
        return this.dateHelper.DayIndexToDay(today);
    }

    render(): JSX.Element {
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    async shouldBeAnsweredToday(questionnaire: Questionnaire, careplan?: PatientCareplan): Promise<boolean> {

        if (!careplan?.id) {
            return false;
        }

        const todaysDayIndex = this.getTodaysDay();
        const frequencyIsToday: boolean = questionnaire.frequency?.days?.includes(todaysDayIndex) ?? false
        const hasBeenAnsweredToday: boolean = await this.questionnaireResponseService.QuestionnaireHasBeenAnsweredToday(careplan?.id, questionnaire);

        console.log(questionnaire.name + ": "+ frequencyIsToday +"&&"+ hasBeenAnsweredToday)
        return frequencyIsToday && !hasBeenAnsweredToday
    }

    renderPage(): JSX.Element {



        return (
            <IsEmptyCard object={this.state.careplan} jsxWhenEmpty="Ingen behandlingsplan fundet på bruger">
                <IsEmptyCard list={this.state.careplan?.questionnaires} jsxWhenEmpty="Ingen spørgeskemaer fundet på behandlingsplan">
                    <Typography component={Box} paddingBottom={1} variant="h6">Spørgeskemaer til besvarelse i dag</Typography>

                    <IsEmptyCard list={this.state.answeredTodayList} jsxWhenEmpty="Du har ikke flere spørgeskemaer der skal besvares">
                        <Stack direction="row" >
                            {this.state.answeredTodayList?.map(questionnaire => {
                                return <QuestionnaireAnswerCard questionnaire={questionnaire} />
                            })}

                        </Stack>
                    </IsEmptyCard>

                    <Typography component={Box} paddingBottom={1} paddingTop={10} variant="h6">Andre spørgeskemaer til besvarelse</Typography>
                    <IsEmptyCard list={this.state.answeredOtherdayList} jsxWhenEmpty="Ingen spørgeskemaer">
                        <Stack direction="row" spacing={2} >
                            {this.state.answeredOtherdayList?.map(questionnaire => {
                                return <QuestionnaireAnswerCard hasBeenAnswered={true} questionnaire={questionnaire} />
                            })}

                        </Stack>
                    </IsEmptyCard>
                </IsEmptyCard>

            </IsEmptyCard>
        )
    }
}