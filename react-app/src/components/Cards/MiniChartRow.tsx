import * as React from 'react';
import { Component } from 'react';

import { Button, Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Typography } from '@mui/material';


import ApiContext, { IApiContext } from '../../pages/_context';


import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';


import { Link } from 'react-router-dom';

import LatestResponseCard from './LatestResponseCard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { group } from 'console';
import ChartData from '../Charts/ChartData';
import IsEmptyCard from '../Errorhandling/IsEmptyCard';
import { ICollectionHelper } from '../Helpers/interfaces/ICollectionHelper';
import IDateHelper from '../Helpers/interfaces/IDateHelper';
import { GroupAnswer } from '../Models/Answer';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Question, QuestionTypeEnum } from '../Models/Question';
import { Questionnaire } from '../Models/Questionnaire';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';

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
