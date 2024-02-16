import * as React from 'react';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Typography } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext, { IApiContext } from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import ChartData from '@kvalitetsit/hjemmebehandling/Charts/ChartData';
import { Link } from 'react-router-dom';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import LatestResponseCard from './LatestResponseCard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { GroupAnswer } from '@kvalitetsit/hjemmebehandling/Models/Answer';
import { group } from 'console';

export interface Props {
    careplan: PatientCareplan;
    questionnaire: Questionnaire
    question: Question;
    subQuestion?: Question;
}

export interface State {
    questionnaire: Questionnaire
    questionnaireResponses: QuestionnaireResponse[]
    loading: boolean
}

export class MiniChartRow extends Component<Props, State> {
    static displayName = MiniChartRow.name;
    static contextType = ApiContext
     
    questionnaireService!: IQuestionnaireResponseService;
    collectionHelper!: ICollectionHelper;
    dateHelper!: IDateHelper

    constructor(props: Props) {

        super(props);

        this.state = {
            questionnaire: props.questionnaire,
            questionnaireResponses: [],
            loading: true
        }


    }
    initialiseServices(): void {
        const api = this.context as IApiContext

        this.questionnaireService = api.questionnaireResponseService;
        this.collectionHelper = api.collectionHelper;
        this.dateHelper = api.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        try {
            const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan.id!, [this.state.questionnaire.id], 1, 5)

            this.setState({ questionnaireResponses: responses, loading: false })
        } catch (error: any) {
            this.setState(() => { throw error })
        }
    }

    render(): JSX.Element {
        this.initialiseServices()

        if (this.state.loading)
            return (<Skeleton width="100%" height="20em" />)

        const question = this.props.question;

        const threshold = this.state.questionnaire.thresholds?.find(x => x.questionId === question.Id)

        const dateToString = (date: Date) => this.dateHelper.DateToString(date);
        const chartData = new ChartData(this.state.questionnaireResponses, question, threshold, dateToString);

        if (question.type === QuestionTypeEnum.GROUP && this.props.subQuestion) {
            const sorted = this.state.questionnaireResponses.sort((a, b) => a.answeredTime && b.answeredTime ? a.answeredTime.compareTo(b.answeredTime) : 0)
            
            const answerData: number[] = [];
            for (let i = 0; i < sorted.length; i++) {
                const response = sorted[i];
                if (response && response.questions) {
                    const questionnaireQuestion = Array.from(response.questions?.keys()).find(x => x.Id === question.Id);
                    const groupAnswer = response.questions?.get(questionnaireQuestion!) as GroupAnswer 
                    if (groupAnswer) {
                        const latestAnswer = groupAnswer.answer?.find(sa => sa.questionId === this.props.subQuestion?.Id)
                        if (latestAnswer) {
                            answerData.push(latestAnswer.answer);
                        }
                    }
                }
            }
            
            const latestData = answerData.pop();
            const secondLatestData = answerData.pop();
    
            let status = "Værdien er stabil"
            if (latestData !== undefined && secondLatestData !== undefined) {
              if (latestData > secondLatestData)
                  status = "Værdien er stigende"
              if (latestData < secondLatestData)
                  status = "Værdien er faldende"
            }
           
            return (
                <IsEmptyCard
                    list={this.state.questionnaireResponses}
                    jsxWhenEmpty={
                        <>
                            <Typography variant="subtitle2">{this.props.subQuestion?.measurementType?.displayName}</Typography>
                            <Typography variant="caption">Ingen tilgængelige målinger</Typography>
                        </>
                    }>
                    
                    <Link to="/measurements" style={{flexGrow: 1, display: 'flex'}}>
                        <Card >
                            <CardHeader subheader={this.props.subQuestion?.measurementType?.displayName}/>
                            <Divider />
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography>Seneste værdi</Typography>
                                <Typography variant="h2">{latestData}</Typography>
                                <Typography>{status}</Typography>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ float: "right" }}>
                                <Button endIcon={<NavigateNextIcon />} variant="text">Se målinger</Button>
                            </CardActions>
                        </Card>
                    </Link>
                </IsEmptyCard>
            )
        }
        else {
            return (
                <IsEmptyCard
                    list={this.state.questionnaireResponses}
                    jsxWhenEmpty={
                        <>
                            <Typography variant="subtitle2">{question.question}</Typography>
                            <Typography variant="caption">Ingen tilgængelige målinger</Typography>
                        </>
                    }>
                    <Link to="/measurements" style={{flexGrow: 1, display: 'flex'}}>
                        <LatestResponseCard chartData={chartData} />
                    </Link>
                </IsEmptyCard>
            );
        }
    }
}
