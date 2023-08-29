
import { Grid, Typography } from "@mui/material";
import React, { Component } from "react";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import QuestionnaireResponseTable from "../../components/Tables/QuestionnaireResponseTable";
import QuestionnaireAnswerCard from "../../components/Cards/QuestionnaireAnswerCard";
import ICareplanService from "../../services/interfaces/ICareplanService";
import ApiContext from "../_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";
import ScrollableRow from "../../components/ScrollableRow";

interface State{
    loadingPage : boolean;
    careplan : PatientCareplan | undefined;
    answeredTodayList?: Questionnaire[]
    answeredOtherdayList?: Questionnaire[]
}

export default class AnsweredPage extends Component<{},State>{
    static contextType = ApiContext
    declare context: React.ContextType<typeof ApiContext>
    careplanService! : ICareplanService;
    questionnaireResponseService!: IQuestionnaireResponseService;
    dateHelper!: IDateHelper;

    constructor(props : {}){
        super(props);
        this.state = {
            loadingPage : true,
            careplan : undefined,
            answeredOtherdayList: [],
            answeredTodayList: []
        }
    }

    initializeServices() : void{
        this.careplanService = this.context.careplanService;
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.dateHelper = this.context.dateHelper;
    }

    async componentDidMount() : Promise<void>{
        try{
            const careplan = await this.careplanService.GetActiveCareplan()
            const questionnairesToAnswerToday: Questionnaire[] = []
            const questionnairesToAnswerOtherDay: Questionnaire[] = []

            const today = this.dateHelper.DayIndexToDay( new Date().getDay());
            for (const questionnaire of careplan.questionnaires) {
                if (questionnaire.frequency?.days.find(day => day === today)) {
                    questionnairesToAnswerToday.push(questionnaire)
                }
                else {
                    questionnairesToAnswerOtherDay.push(questionnaire);
                }
            }

            this.setState({
                careplan: careplan,
                answeredTodayList: questionnairesToAnswerToday,
                answeredOtherdayList: questionnairesToAnswerOtherDay,
                loadingPage: false
            })

        } 
        catch(error){
            this.setState(()=>{throw error});
        }
    }

    render() : JSX.Element{
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    renderPage() : JSX.Element{
        return (
            <IsEmptyCard object={this.state.careplan} jsxWhenEmpty="Ingen behandlingsplan fundet">
                <Grid container spacing={2}>
                    <IsEmptyCard list={this.state.careplan?.questionnaires} jsxWhenEmpty="Ingen spørgeskemaer fundet på behandlingsplan">
                        <Grid item xs={12} className="headline-wrapper">
                            <Typography className="headline">Spørgeskemaer til besvarelse i dag</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <IsEmptyCard list={this.state.answeredTodayList} jsxWhenEmpty="Du har ikke flere spørgeskemaer der skal besvares">
                                <ScrollableRow cols={2.5} jsxList={this.state.answeredTodayList!.map(questionnaire => 
                                        <QuestionnaireAnswerCard careplan={this.state.careplan} questionnaire={questionnaire} />
                                    )}
                                />
                            </IsEmptyCard>
                        </Grid>

                        <Grid item xs={12} className="headline-wrapper">
                            <Typography className="headline">Andre spørgeskemaer til besvarelse</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <IsEmptyCard list={this.state.answeredOtherdayList} jsxWhenEmpty="Ingen spørgeskemaer">
                                <ScrollableRow cols={2.5} jsxList={this.state.answeredOtherdayList!.map(questionnaire => 
                                       <QuestionnaireAnswerCard careplan={this.state.careplan} questionnaire={questionnaire} />
                                    )}
                                />
                            </IsEmptyCard>
                        </Grid>
                    </IsEmptyCard>
                </Grid>
                
                <Grid paddingTop={10} container spacing={2}>
                    <Grid item xs={12} >
                        <Typography className="headline">Dine tidligere besvarelser</Typography>
                    </Grid>
                    <Grid item mt={2} mx={-3} sx={{maxWidth: `calc(100% + 48px)`, flexBasis: `calc(100% + 48px)`}}>
                        <QuestionnaireResponseTable careplan={this.state.careplan!}/>
                    </Grid>
                </Grid>
            </IsEmptyCard>
        )
    }
}