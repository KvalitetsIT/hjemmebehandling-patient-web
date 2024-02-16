import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { CardHeader, Divider, Grid, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext, { IApiContext } from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { GroupAnswer, NumberAnswer } from '@kvalitetsit/hjemmebehandling/Models/Answer';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import ResponseViewCard from '@kvalitetsit/hjemmebehandling/Charts/ResponseViewCard';
import ChartData from '@kvalitetsit/hjemmebehandling/Charts/ChartData';
import { ThresholdSlider } from '@kvalitetsit/hjemmebehandling/Charts/ThresholdSlider';
import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { ThresholdNumber } from '@kvalitetsit/hjemmebehandling/Models/ThresholdNumber';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { LineChart} from '@kvalitetsit/hjemmebehandling/Charts/LineChart';
import { TableChart} from '@kvalitetsit/hjemmebehandling/Charts/TableChart';
import { Line } from 'react-chartjs-2';
import annotationPlugin from "chartjs-plugin-annotation";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
  } from 'chart.js';
  
  ChartJS && ChartJS.register(
  
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    annotationPlugin,
    Title,
    Legend
  );

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
        const api = this.context as IApiContext
        
        this.questionnaireService = api.questionnaireResponseService;
        this.collectionHelper = api.collectionHelper;
        this.dateHelper = api.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        try {
            const responses = await this.questionnaireService.GetQuestionnaireResponses(this.props.careplan.id!, [this.props.questionnaire.id], 1, 50)
            this.setState({ questionnaireResponses: responses, loading: false })
        } catch (error: any) {
            this.setState(() => { throw error })
        }
    }

    findObservationQuestions(questionnaireResponse: QuestionnaireResponse): Question[] {
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
                if (question?.value.type === QuestionTypeEnum.OBSERVATION || question?.value.type === QuestionTypeEnum.GROUP)
                    allQuestions.push(question?.value)
                question = questionIterator?.next()
            }
        }

        let counter = 0

        return (
            <Grid container spacing={5}>
                {allQuestions.map(question => {
                    const isFirst = counter++ === 0;
                    const threshold = this.props.questionnaire?.thresholds?.find(x => x.questionId === question.Id)

                    // answer values can lie outside thresholds as a consequence of input validation when answering a question
                    // was split out into system-wide (organization) threshold configured on the measurement type.
                    // This code will search for such value(s), and if found add extra visual-only thresholds to be displayed by the graph.
                    if (threshold && threshold.thresholdNumbers) {
                        const froms = threshold.thresholdNumbers!.filter(t => t.from !== undefined).map(t => t.from!);
                        const tos = threshold.thresholdNumbers!.filter(t => t.to !== undefined).map(t => t.to!);

                        const minThreshold = Math.min(...froms);
                        const maxThreshold = Math.max(...tos);

                        let minAnswer, maxAnswer;
                        for (const qr of this.state.questionnaireResponses) {
                            const questionnaireQuestion = Array.from(qr.questions!.keys()).find(x => x == question);
                            const answer = qr.questions!.get(questionnaireQuestion!) as NumberAnswer | undefined

                            if (answer?.answer !== undefined) {
                                if (minAnswer === undefined || minAnswer > answer.answer!) {
                                    minAnswer = answer.answer
                                }
                                if (maxAnswer === undefined || maxAnswer < answer.answer!) {
                                    maxAnswer = answer.answer
                                }
                            }
                        }


                        if (minAnswer !== undefined && minAnswer < minThreshold) {
                            const extraVisualThreshold = new ThresholdNumber();
                            extraVisualThreshold.category = CategoryEnum.RED;
                            extraVisualThreshold.from = minThreshold;
                            extraVisualThreshold.to = minAnswer;

                            threshold?.thresholdNumbers?.push(extraVisualThreshold);
                        }
                        if (maxAnswer !== undefined && maxAnswer > maxThreshold) {
                            const extraVisualThreshold = new ThresholdNumber();
                            extraVisualThreshold.category = CategoryEnum.RED;
                            extraVisualThreshold.from = maxAnswer;
                            extraVisualThreshold.to = maxThreshold;

                            threshold?.thresholdNumbers?.push(extraVisualThreshold);
                        }
                    }
                    
                    const dateToString = (date: Date) => this.dateHelper.DateToString(date, { showDate: true, showTime: true, showMonth: true, showYear: false });
                    const chartData = new ChartData(this.state.questionnaireResponses, question, threshold, dateToString);
                    
                    let rows: string[] = [];
                    let groupData: (string | number | undefined)[][] = [];
                    let groupHeader: string[] = ['Dato'];
                    if (question.type === QuestionTypeEnum.GROUP) {
                        const sorted = this.state.questionnaireResponses.sort((a, b) => a.answeredTime && b.answeredTime ? a.answeredTime.compareTo(b.answeredTime) : 0)

                        question.subQuestions?.forEach(sq => {
                            groupHeader.push(sq.measurementType?.displayName!)
                            rows.push(sq.Id!)
                        })
                        
                        sorted.forEach(qr => {
                            const questionnaireQuestion = Array.from(qr.questions!.keys()).find(x => x.Id === question.Id);
                            const answer = qr.questions!.get(questionnaireQuestion!) as GroupAnswer | undefined

                            if (answer) {
                                let row: (string|number|undefined)[] = [];
                                row.push(dateToString(qr.answeredTime!));
                                
                                for (let i = 0; i < rows.length; i++) {
                                    const subQuestionId = rows[i];
                                    const subAnswer = answer!.answer?.find(sa => sa.questionId === subQuestionId) as NumberAnswer;
                                    
                                    row.push(subAnswer!.answer!)
                                }
                                groupData.push(row)
                            }

                        })
                    }
                    const subheader = question.abbreviation ?? question.question ?? "";
                    return (
                        <Grid paddingLeft={isFirst ? 0 : 2} item xs={12} marginTop={6}>
                            {/* <ResponseViewCard chartData={chartData} /> */}  
                            
                            {question.type === QuestionTypeEnum.OBSERVATION ?
                                <ResponseViewCard
                                    chartData={chartData}
                                    graph={<LineChart renderChart={(options, data, plugins) => <Line style={{ minHeight: "400px", maxHeight: "600px" }} plugins={plugins} options={options} data={data as any} />} chartData={chartData} />}
                                    table={<TableChart chartData={chartData} />}
                                />
                                :
                                <Card>
                                    <CardHeader subheader={<Typography variant="h6" fontWeight="bold">{chartData.label}</Typography>} />
                                    <Divider />
                                    <CardContent>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    {groupHeader.map(value => {
                                                        return (
                                                            <TableCell>{value}</TableCell>
                                                        )
                                                    })}

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {groupData.map((row, i) => {
                                                    return (
                                                        <TableRow>
                                                            {row.map(value => {
                                                               return (
                                                                   <TableCell>{value}</TableCell>
                                                                ) 
                                                            })}
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            }

                            <Card marginTop={1} component={Box}>
                                <CardHeader subheader={subheader + " - Alarmgrænser"} />
                                <Divider />
                                <CardContent>
                                    {question.type === QuestionTypeEnum.OBSERVATION && threshold && threshold.thresholdNumbers ? <ThresholdSlider threshold={threshold.thresholdNumbers} question={question} /> : <></>}
                                    {question.type === QuestionTypeEnum.GROUP ?
                                    <>
                                    {question.subQuestions?.map(subQuestion => {
                                        const subQuestionThreshold = this.props.questionnaire!.thresholds?.find(x => x.questionId === subQuestion.Id)
                                        
                                        if (subQuestionThreshold && subQuestionThreshold.thresholdNumbers) {
                                            return (
                                                <ThresholdSlider threshold={subQuestionThreshold?.thresholdNumbers} question={subQuestion} displayType={subQuestion.measurementType?.displayName}/>
                                            )
                                        }
                                        else {
                                            <></>
                                        }
                                    })}
                                    </>
                                    :
                                    <></>
                                }
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        );
    }
}