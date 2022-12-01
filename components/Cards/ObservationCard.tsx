import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { CardHeader, Grid, Skeleton } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { NumberAnswer } from '@kvalitetsit/hjemmebehandling/Models/Answer';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import ResponseViewCard from '@kvalitetsit/hjemmebehandling/Charts/ResponseViewCard';
import ChartData from '@kvalitetsit/hjemmebehandling/Charts/ChartData';
import { ThresholdSlider } from '@kvalitetsit/hjemmebehandling/Charts/ThresholdSlider';
import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';

export interface Props {
    careplan: PatientCareplan;
    questionnaire: Questionnaire;
}

export interface State {
    questionnaireResponses: QuestionnaireResponse[]
    loading: boolean
}

export class ObservationCard extends Component<Props, State> {
    static displayName = ObservationCard.name;
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireResponseService;
    collectionHelper!: ICollectionHelper;
    dateHelper!: IDateHelper

    constructor(props: Props) {
        super(props);
        this.state = {
            questionnaireResponses: [],
            loading: true
        }
    }
    initialiseServices(): void {
        this.questionnaireService = this.context.questionnaireResponseService;
        this.collectionHelper = this.context.collectionHelper;
        this.dateHelper = this.context.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        try {
            const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan.id!, [this.props.questionnaire.id], 1, 50)
            //console.log(responses)
            //console.log(this.props.questionnaire.thresholds)
            this.setState({ questionnaireResponses: responses, loading: false })
        } catch (error: any) {
            this.setState(() => { throw error })
        }
    }

    findObservationQuestions(questionnaireResponse: QuestionnaireResponse): Question[] {
        console.log(questionnaireResponse)
        const questions: Question[] = [];
        questionnaireResponse.questions?.forEach((answer, question) => {
            const numberAnswer: boolean = answer instanceof NumberAnswer;
            if (numberAnswer) {
                questions.push(question)
            }
        })
        return questions;
    }

    render(): JSX.Element {
        this.initialiseServices()

        if (this.state.loading)
            return (<Skeleton height="20em" width="100%" />)

        const allQuestions: Question[] = [];

        if (this.state.questionnaireResponses && this.state.questionnaireResponses.length > 0) {
            const questionIterator = this.state.questionnaireResponses[0].questions?.keys()
            let question = questionIterator?.next()

            while (!question?.done) {
                if (question?.value.type === QuestionTypeEnum.OBSERVATION)
                    allQuestions.push(question?.value)
                question = questionIterator?.next()
            }
        }

        let counter = 0

        return (
            <IsEmptyCard list={allQuestions} jsxWhenEmpty={""}>
                <Grid container spacing={5}>
                    {allQuestions.map(question => {
                        const isFirst = counter++ == 0;
                        const threshold = this.props.questionnaire?.thresholds?.find(x => x.questionId == question.Id)

                        const dateToString = (date: Date) => this.dateHelper.DateToString(date);
                        const chartData = new ChartData(this.state.questionnaireResponses, question, threshold, dateToString);

                        const subheader = question.abbreviation ?? question.question ?? "";
                        return (
                            <Grid paddingLeft={isFirst ? 0 : 2} item xs={12}>
                                <ResponseViewCard chartData={chartData} />
                                
                                <IsEmptyCard object={threshold} jsxWhenEmpty="Ingen alarmgrænser">
                                    <Card marginTop={1} component={Box}>
                                        <CardHeader subheader={subheader + " - Alarmgrænser"} />
                                        <CardContent>
                                            {threshold && threshold.thresholdNumbers ? <ThresholdSlider threshold={threshold.thresholdNumbers} question={question} /> : <></>}
                                        </CardContent>
                                    </Card>
                                </IsEmptyCard>

                            </Grid>
                        )
                    })}
                </Grid>
            </IsEmptyCard>
        );
    }
}