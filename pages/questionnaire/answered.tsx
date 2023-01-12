
import { Grid, Stack, Typography } from "@mui/material";
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
import { LatestResponseEnum } from "../../services/QuestionnaireResponseService";
import { ScrollableRow } from "../../components/Rows/HomePage/ScrollableRow";
import { ErrorBoundary } from "@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary";

interface State{
    loadingPage : boolean;
    careplan : PatientCareplan | undefined;
    answeredTodayList?: Questionnaire[]
    answeredOtherdayList?: Questionnaire[]
}

export default class AnsweredPage extends Component<{},State>{
    static contextType = ApiContext
    careplanService! : ICareplanService;
    questionnaireResponseService!: IQuestionnaireResponseService;
    dateHelper!: IDateHelper;

    constructor(props : {}){
        super(props);
        this.state = {
            loadingPage : false,
            careplan : undefined,
            answeredOtherdayList: [],
            answeredTodayList: []
        }
        this.shouldBeAnsweredToday = this.shouldBeAnsweredToday.bind(this);
    }

    initializeServices() : void{
        this.careplanService = this.context.careplanService;
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.dateHelper = this.context.dateHelper;
    }

    async componentDidMount() : Promise<void>{

        this.setState({loadingPage : true});

        try{
            const careplan = await this.careplanService.GetActiveCareplan()
            const questionnairesToAnswerToday: Questionnaire[] = []
            const questionnairesToAnswerOtherDay: Questionnaire[] = []
            this.setState({careplan : careplan});

            for (const questionnaire of careplan.questionnaires) {
                const latestResponse = await this.shouldBeAnsweredToday(questionnaire, careplan);
                if (latestResponse == LatestResponseEnum.ShouldBeAnsweredToday)
                    questionnairesToAnswerToday.push(questionnaire)
                else
                    questionnairesToAnswerOtherDay.push(questionnaire)
            }

            console.log(questionnairesToAnswerToday)
            this.setState({
                careplan: careplan,
                answeredTodayList: questionnairesToAnswerToday,
                answeredOtherdayList: questionnairesToAnswerOtherDay
            })

        } 
        catch(error){
            this.setState(()=>{throw error});
        }

        this.setState({loadingPage : false});

        
    }

    render() : JSX.Element{
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    async shouldBeAnsweredToday(questionnaire: Questionnaire, careplan?: PatientCareplan): Promise<LatestResponseEnum> {

        const latestResponse: LatestResponseEnum  = await this.questionnaireResponseService.GetQuestionnaireAnsweredStatus(careplan!.id!, questionnaire);

        return latestResponse
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
                
                <Grid paddingTop={10} container>
                    <Grid item xs={12} className="headline-wrapper">
                        <Typography className="headline">Dine tidligere besvarelser</Typography>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <QuestionnaireResponseTable careplan={this.state.careplan!}/>
                    </Grid>
                </Grid>
            </IsEmptyCard>
        )
    }
}