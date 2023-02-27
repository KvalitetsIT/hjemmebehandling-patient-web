import * as React from 'react';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { Skeleton, Typography } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import ChartData from '@kvalitetsit/hjemmebehandling/Charts/ChartData';
import { Link } from 'react-router-dom';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import LatestResponseCard from './LatestResponseCard';

export interface Props {
    careplan: PatientCareplan;
    questionnaire: Questionnaire
    question: Question;
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
        this.questionnaireService = this.context.questionnaireResponseService;
        this.collectionHelper = this.context.collectionHelper;
        this.dateHelper = this.context.dateHelper;
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

        const threshold = this.state.questionnaire.thresholds?.find(x => x.questionId == question.Id)

        const dateToString = (date: Date) => this.dateHelper.DateToString(date);
        const chartData = new ChartData(this.state.questionnaireResponses, question, threshold, dateToString);

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