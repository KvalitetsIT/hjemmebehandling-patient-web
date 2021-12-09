import { Box, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import IsEmptyCard from "../../components/Cards/IsEmptyCard";
import QuestionnaireAnswerCard from "../../components/Cards/QuestionnaireAnswerCard";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { DayEnum } from "../../components/Models/Frequency";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import IDateHelper from "../../globalHelpers/interfaces/IDateHelper";
import ICareplanService from "../../services/interfaces/ICareplanService";
import ApiContext from "../_context";

interface State {
    loadingPage: boolean
    careplan?: PatientCareplan
}

export default class UnAnsweredPage extends Component<{}, State>{
    static contextType = ApiContext
    careplanService!: ICareplanService;
    dateHelper!: IDateHelper;

    constructor(props: {}) {
        super(props)
        this.state = {
            loadingPage: false,
            careplan: undefined
        }
    }

    initializeServices(): void {
        this.careplanService = this.context.careplanService;
        this.dateHelper = this.context.dateHelper;
    }

    async componentDidMount() : Promise<void> {
        this.setState({ loadingPage: true })
        try {
            
            const activeCareplan = await this.careplanService.GetActiveCareplan();
            this.setState({ careplan: activeCareplan})
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

    renderPage(): JSX.Element {
        const todaysDayIndex = this.getTodaysDay();
        const questionnairesToAnswerToday = this.state.careplan?.questionnaires?.filter(q => q.frequency?.days?.includes(todaysDayIndex));
        const questionnairesToAnswerOtherDay = this.state.careplan?.questionnaires?.filter(q => !q.frequency?.days?.includes(todaysDayIndex));

        return (
            <IsEmptyCard object={this.state.careplan} jsxWhenEmpty="Ingen behandlingsplan fundet på bruger">
                <IsEmptyCard list={this.state.careplan?.questionnaires} jsxWhenEmpty="Ingen spørgeskemaer fundet på behandlingsplan">
                    <Typography component={Box} paddingBottom={1} variant="h6">Spørgeskemaer til besvarelse i dag</Typography>

                    <IsEmptyCard list={questionnairesToAnswerToday} jsxWhenEmpty="Ingen spørgeskemaer">
                        <Stack direction="row" >
                            {questionnairesToAnswerToday?.map(questionnaire => {
                                return <QuestionnaireAnswerCard showDeadline={true} questionnaire={questionnaire} />
                            })}

                        </Stack>
                    </IsEmptyCard>

                    <Typography component={Box} paddingBottom={1} paddingTop={10} variant="h6">Andre spørgeskemaer til besvarelse</Typography>
                    <IsEmptyCard list={questionnairesToAnswerOtherDay} jsxWhenEmpty="Ingen spørgeskemaer">
                        <Stack direction="row" >
                            {questionnairesToAnswerOtherDay?.map(questionnaire => {
                                return <QuestionnaireAnswerCard showDeadline={false} questionnaire={questionnaire} />
                            })}

                        </Stack>
                    </IsEmptyCard>
                </IsEmptyCard>

            </IsEmptyCard>
        )
    }
}