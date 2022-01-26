import { Grid } from "@material-ui/core";
import { Box } from "@mui/system";
import React, { Component } from "react";
import { Button, Typography } from "@mui/material";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import ICareplanService from "../../../services/interfaces/ICareplanService";
import ApiContext from "../../_context";
import IQuestionnaireResponseService from "../../../services/interfaces/IQuestionnaireResponseService";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Answer, BooleanAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import LinearProgress from '@mui/material/LinearProgress';
import QuestionPresenterCard from "../../../components/Cards/QuestionPresenterCard";
import QuestionAndAnswerTable from "../../../components/Tables/QuestionAndAnswerTable";
import { Redirect } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface Props {
    match: { params: { questionnaireId: string } };
    startQuestionIndex?: number;
}

interface State {
    submitted: boolean;
    loadingPage: boolean;
    careplan: PatientCareplan | undefined;
    questionIndex: number;
    questionnaireResponse: QuestionnaireResponse; //The new response
}

export default class QuestionnaireResponseCreationPage extends Component<Props, State>{
    static contextType = ApiContext
    questionnaireResponseService!: IQuestionnaireResponseService;
    careplanService!: ICareplanService;

    constructor(props: Props) {
        super(props);
        const newQuestionnaireResponse = new QuestionnaireResponse();
        this.state = {
            submitted: false,
            loadingPage: true,
            questionIndex: props.startQuestionIndex ?? 0,
            questionnaireResponse: newQuestionnaireResponse,
            careplan: undefined
        }
        this.setAnswerToQuestion = this.setAnswerToQuestion.bind(this)
    }

    initializeServices(): void {
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.careplanService = this.context.careplanService;

    }

    async componentDidMount(): Promise<void> {
        try {
            this.setState({ loadingPage: true })
            const careplan = await this.careplanService.GetActiveCareplan();
            this.ResetResponse(careplan);
            this.setState({ careplan: careplan, loadingPage: false })
        } catch (error) {
            this.setState(() => { throw error })
        }
    }

    ResetResponse(careplan: PatientCareplan): void {
        const questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.questionnaireId = this.props.match.params.questionnaireId;
        questionnaireResponse.carePlanId = careplan!.id!
        questionnaireResponse.questions = new Map<Question, Answer>();
        questionnaireResponse.status = QuestionnaireResponseStatus.NotAnswered;
        questionnaireResponse.patient = careplan.patient!;
        this.setState({ questionnaireResponse: questionnaireResponse });
    }

    render(): JSX.Element {
        this.initializeServices();
        if (this.state.submitted)
            return (<Redirect push to={"/questionnaire/answered/"} />)

        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    GetPercentageDone(questionnaire: Questionnaire): number {
        if (!questionnaire.questions?.length)
            return -1;

        const questionIndex: number = this.state.questionIndex;
        const totalNumberOfQuestions: number = questionnaire.questions?.length
        const percentageDone = questionIndex / totalNumberOfQuestions * 100;

        return percentageDone
    }

    renderPage(): JSX.Element {
        const questionnaire = this.state.careplan?.questionnaires.find(x => x.id == this.props.match.params.questionnaireId);
        const showReview = questionnaire?.questions?.length == this.state.questionIndex

        if (showReview)
            return this.renderReview(questionnaire)


        return this.renderQuestion(questionnaire);

    }
    renderProgressbar(questionnaire: Questionnaire): JSX.Element {
        return (
            <>
                <Grid component={Box} spacing={4} container textAlign="center">
                    <Grid item xs={1}>

                    </Grid>
                </Grid>

                <Grid component={Box} spacing={4} container textAlign="center">

                    <Grid component={Box} textAlign="left" item xs={12} >
                        <LinearProgress variant="determinate" value={this.GetPercentageDone(questionnaire)} />
                        <Button size="small" disabled={this.state.questionIndex == 0} onClick={() => this.setState({ questionIndex: this.state.questionIndex - 1 })}>
                            <NavigateBeforeIcon />
                            <Typography fontSize={10}>
                                Forrige
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={12} >
                        <Typography variant="caption">{this.GetPercentageDone(questionnaire!).toFixed(0)}% færdig</Typography>
                    </Grid>
                </Grid>
            </>
        )
    }

    shouldShowQuestion(question: Question | undefined) : boolean{
        if (question?.enableWhen?.questionId) {
            const questionAnswerTuple = this.questionnaireResponseService.GetQuestionAnswerFromMap(this.state.questionnaireResponse.questions, question.enableWhen.questionId);
            console.log(questionAnswerTuple)
            const booleanAnswer = questionAnswerTuple?.answer as BooleanAnswer;
            console.log(booleanAnswer)
            if (booleanAnswer) {
                const shouldShowQuestion = question?.enableWhen?.ShouldBeEnabled(booleanAnswer.answer)
                return shouldShowQuestion
            }
        }

        return true;
    }
    renderQuestion(questionnaire: Questionnaire | undefined): JSX.Element {

        const questions = questionnaire?.questions;
        let question: Question | undefined = undefined;
        if (questions) {
            question = questions.length > this.state.questionIndex ? questions[this.state.questionIndex] : undefined;
        }

        if (!this.shouldShowQuestion(question)){
            const newIndex = this.state.questionIndex+1;
            this.setState({questionIndex : newIndex})
            return <></>
        }
            

        return (
            <IsEmptyCard object={questionnaire} jsxWhenEmpty="Intet spørgeskema blev fundet">
                <IsEmptyCard list={questions} jsxWhenEmpty="Ingen spørgsmål blev fundet i spørgeskemaet">
                    <IsEmptyCard object={question} jsxWhenEmpty="Intet spørgsmål fundet">
                        {this.renderProgressbar(questionnaire!)}
                        <Grid component={Box} spacing={4} container textAlign="center">
                            <Grid item xs={12} >
                                <QuestionPresenterCard key={question?.Id} question={question!} answer={this.state.questionnaireResponse.questions?.get(question!)} setQuestionAnswer={this.setAnswerToQuestion} />

                            </Grid>
                        </Grid>

                    </IsEmptyCard>
                </IsEmptyCard>
            </IsEmptyCard>
        )
    }

    renderReview(questionnaire: Questionnaire | undefined): JSX.Element {
        return (
            <>
                {this.renderProgressbar(questionnaire!)}
                <IsEmptyCard object={questionnaire} jsxWhenEmpty="Intet spørgeskema blev fundet">
                    <Grid component={Box} spacing={4} container textAlign="center">
                        <Grid item xs={12} >
                            <Typography>{questionnaire?.name}</Typography>
                            <Typography variant="caption">Du bliver ringet op, hvis personalet har brug for yderligere oplysninger</Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <QuestionAndAnswerTable lastRowJsx={(questionId) => this.createLastColoumn(questionId, questionnaire!)} questionAnswerMap={this.state.questionnaireResponse.questions!} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={() => this.submitQuestionnaireResponse()} variant="contained">Indsend</Button>
                        </Grid>
                    </Grid>
                </IsEmptyCard>
            </>
        )
    }

    setAnswerToQuestion(question: Question, answer: Answer): void {
        const response = this.state.questionnaireResponse;
        response.questions?.set(question, answer);
        this.setState({ questionnaireResponse: response, questionIndex: this.state.questionIndex + 1 })
    }

    createLastColoumn(questionId: string, questionnaire: Questionnaire): JSX.Element {
        const questionIndex: number | undefined = questionnaire.questions!.findIndex(x => x.Id === questionId);
        if (questionIndex >= 0)
            return (<Button onClick={() => this.setState({ questionIndex: questionIndex })}> <EditIcon />  </Button>)
        return (<></>)
    }

    async submitQuestionnaireResponse(): Promise<void> {
        this.setState({ loadingPage: true })
        try {
            const questionnaireResponse = this.state.questionnaireResponse;
            questionnaireResponse.answeredTime = new Date();
            questionnaireResponse.status = QuestionnaireResponseStatus.NotProcessed
            await this.questionnaireResponseService.SubmitQuestionnaireResponse(questionnaireResponse)
            this.setState({ loadingPage: false, submitted: true })
        } catch (error) {
            this.setState(() => { throw error })
        }

    }
}