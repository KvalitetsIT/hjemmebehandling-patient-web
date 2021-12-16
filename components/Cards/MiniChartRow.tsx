import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { Alert, Button, CardHeader, Grid, Stack, Typography } from '@mui/material';
import { Questionnaire } from '../Models/Questionnaire';
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import { NumberAnswer } from '../Models/Answer';
import { Question, QuestionTypeEnum } from '../Models/Question';
import { QuestionChart } from '../Charts/QuestionChart';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';
import { ICollectionHelper } from '../../globalHelpers/interfaces/ICollectionHelper';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';

export interface Props {
    careplan: PatientCareplan;
    questionnaire: Questionnaire;
}

export interface State {
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
            const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan.id, [this.props.questionnaire.id], 1, 5)
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
            return (<LoadingSmallComponent />)

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

        if (allQuestions.length == 0) {
            return (
                <Alert severity="info">
                    <Typography>Ingen tilgængelige målinger</Typography>
                </Alert>
            )
        }

        return (
            <Stack direction="row" spacing={2}>
                {
                    allQuestions.map(question => {
                        const threshold = this.props.questionnaire?.thresholds?.find(x => x.questionId == question.Id)
                        console.log(question.Id)
                        console.log(threshold)
                        return (
                            <>
                                <Card component={Link} to="/measurements">
                                    <CardHeader subheader={
                                        <>
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    {question.question} </Grid>
                                                <Grid item xs={2}>
                                                    <Button ><ChevronRightIcon/></Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    }
                                    />
                                    <CardContent>
                                        {threshold && threshold.thresholdNumbers ?
                                            <QuestionChart minimal={true} thresholds={threshold.thresholdNumbers} question={question} questionnaireResponses={this.state.questionnaireResponses} /> :
                                            <QuestionChart minimal={true} thresholds={[]} question={question} questionnaireResponses={this.state.questionnaireResponses} />}
                                    </CardContent>
                                </Card>
                            </>

                        )
                    })
                }
            </Stack>
        );
    }
}