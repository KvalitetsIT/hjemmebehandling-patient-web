import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { Button, CardHeader, Grid, Skeleton, Typography } from '@mui/material';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import { QuestionnaireResponse } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import ApiContext from '../../pages/_context';
import IDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { QuestionChart } from '@kvalitetsit/hjemmebehandling/Charts/QuestionChart';
import IQuestionnaireResponseService from '../../services/interfaces/IQuestionnaireResponseService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';

export interface Props {
    careplan: PatientCareplan;
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
        const questionnaire = this.props.careplan.questionnaires.find(qnaire => qnaire.questions?.find(q => q.Id == this.props.question.Id))

        this.state = {
            questionnaire: questionnaire!,
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
            return (<Skeleton width="20em" height="100%" />)

        const question = this.props.question;

        const threshold = this.state.questionnaire.thresholds?.find(x => x.questionId == question.Id)

        return (
            <IsEmptyCard list={this.state.questionnaireResponses} jsxWhenEmpty={
                <>
                    <Typography variant="subtitle2">{question.question}</Typography>
                    <Typography variant="caption">Ingen tilgængelige målinger</Typography>
                </>
            }>


                <Link to="/measurements">
                    <Card >
                        <CardHeader action={
                            <Button ><ChevronRightIcon /></Button>
                        }
                            subheader={
                                <>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            {question.question} </Grid>
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
                </Link>
            </IsEmptyCard>
        );
    }
}