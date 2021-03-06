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
import { Prompt, Redirect } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { CallToActionMessage } from "@kvalitetsit/hjemmebehandling/Models/CallToActionMessage";
import { CallToActionError } from "../../../components/Errors/CallToActionError";
import { DialogError } from "@kvalitetsit/hjemmebehandling/Errorhandling/DialogError";
import ErrorIcon from '@mui/icons-material/Error';
import { CreateToastEvent, CreateToastEventData } from "@kvalitetsit/hjemmebehandling/Events/CreateToastEvent";
interface Props {
    match: { params: { questionnaireId: string } };
    startQuestionIndex?: number;
}

interface State {
    submitted: boolean;
    loadingPage: boolean;
    careplan: PatientCareplan | undefined;
    indexJourney: number[];
    callToActions: CallToActionMessage[];
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
            indexJourney: props.startQuestionIndex ? [props.startQuestionIndex] : [0],
            questionnaireResponse: newQuestionnaireResponse,
            careplan: undefined,
            callToActions: []
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
        if (this.state.submitted) {
            new CreateToastEvent(new CreateToastEventData("Din besvarelse blev sendt", "", "success")).dispatchEvent();
            return (<Redirect push to={"/"} />)
        }

        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    GetLastElement<T>(list: T[], offset?: number): T {
        const offsetNullsafe = offset ?? 0;
        const objectIndex = list.length - 1 - offsetNullsafe;

        return list[objectIndex]

    }

    GetPercentageDone(questionnaire: Questionnaire): number {
        if (!questionnaire.questions?.length)
            return -1;

        const questionIndex: number = this.GetLastElement(this.state.indexJourney)
        const totalNumberOfQuestions: number = questionnaire.questions?.length
        const percentageDone = questionIndex / totalNumberOfQuestions * 100;

        return percentageDone
    }

    renderPage(): JSX.Element {
        const questionnaire = this.state.careplan?.questionnaires.find(x => x.id == this.props.match.params.questionnaireId);
        const showReview = questionnaire?.questions?.length == this.GetLastElement(this.state.indexJourney)

        const prompt = (
            <Prompt
                when={true}
                message={() => "Du er p?? vej ud af sp??rgeskemaet, og din besvarelse vil g?? tabt"}
            />
        )

        if (showReview)
            return (
                <>
                    {prompt}
                    {this.renderReview(questionnaire)}
                </>
            )

        return (
            <>
                {prompt}
                {this.renderQuestion(questionnaire)}
            </>
        )

    }

    GoToPreviousPage(): void {
        const goToPage = this.GetLastElement(this.state.indexJourney) - 1
        this.GoToPage(goToPage)
    }
    GoToNextPage(): void {
        const goToPage = this.GetLastElement(this.state.indexJourney) + 1
        this.GoToPage(goToPage)
    }

    GoToPage(page: number): void {
        const currentIndexJourney = this.state.indexJourney;
        currentIndexJourney.push(page)
        this.setState({ indexJourney: currentIndexJourney })
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
                        <Button size="small" disabled={this.GetLastElement(this.state.indexJourney) == 0} onClick={() => this.GoToPreviousPage()}>
                            <NavigateBeforeIcon />
                            <Typography fontSize={10}>
                                Forrige
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={12} >
                        <Typography variant="caption">{this.GetPercentageDone(questionnaire!).toFixed(0)}% f??rdig</Typography>
                    </Grid>
                </Grid>
            </>
        )
    }

    shouldShowQuestion(question: Question | undefined): boolean {
        if (question?.enableWhen?.questionId) {
            const questionAnswerTuple = this.questionnaireResponseService.GetQuestionAnswerFromMap(this.state.questionnaireResponse.questions, question.enableWhen.questionId);
            const booleanAnswer: BooleanAnswer = questionAnswerTuple?.answer as BooleanAnswer;

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
        const currentPage = this.GetLastElement(this.state.indexJourney);
        if (questions) {
            question = questions.length > currentPage ? questions[currentPage] : undefined;
        }

        if (!this.shouldShowQuestion(question)) {
            const isGoingBack = this.state.indexJourney.length == 1 ? false : this.GetLastElement(this.state.indexJourney) < this.GetLastElement(this.state.indexJourney, 1)
            if (isGoingBack)
                this.GoToPreviousPage();
            else
                this.GoToNextPage();
            return <></>
        }

        return (
            <IsEmptyCard object={questionnaire} jsxWhenEmpty="Intet sp??rgeskema blev fundet">
                <IsEmptyCard list={questions} jsxWhenEmpty="Ingen sp??rgsm??l blev fundet i sp??rgeskemaet">
                    <IsEmptyCard object={question} jsxWhenEmpty="Intet sp??rgsm??l fundet">
                        {this.renderProgressbar(questionnaire!)}
                        <Grid component={Box} spacing={4} container textAlign="center">
                            <Grid item xs={12} >
                                <QuestionPresenterCard key={question?.Id} questionnaire={questionnaire!} question={question!} answer={this.state.questionnaireResponse.questions?.get(question!)} setQuestionAnswer={this.setAnswerToQuestion} />
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
                <IsEmptyCard object={questionnaire} jsxWhenEmpty="Intet sp??rgeskema blev fundet">
                    <Grid component={Box} spacing={4} container textAlign="center">
                        <Grid item xs={12} >
                            <Typography fontWeight="bold" variant="inherit">Din besvarelse af {questionnaire?.name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>F??r du indsender besvarelsen til afdelingen, bedes du tjekke og evt. rette dine svar.</Typography>
                            <Typography>Hvis du kommer til at indsende en besvarelse med fejl, skal du indsende en ny.</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography fontWeight="bold" fontSize="1em" variant="h6">Husk at trykke "Indsend" i bunden af siden</Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <QuestionAndAnswerTable lastRowJsx={(questionId) => this.createLastColoumn(questionId, questionnaire!)} questionAnswerMap={this.state.questionnaireResponse.questions!} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Du bliver ringet op, hvis personalet har brug for yderligere oplysninger.</Typography>
                            <Typography fontWeight="bold" variant="inherit">Husk at du ved problemer d??gnet rundt kan kontakte afdelingen p?? 24 77 78 80.</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={() => this.submitQuestionnaireResponse()} variant="contained">Indsend</Button>
                        </Grid>
                    </Grid>
                </IsEmptyCard>
                {this.state.callToActions.length > 0 ?
                    <DialogError iconAtStart={<ErrorIcon />} error={new CallToActionError(this.state.callToActions, () => this.setState({ submitted: true }))} /> :
                    <></>
                }
            </>
        )
    }

    setAnswerToQuestion(question: Question, answer: Answer): void {
        const response = this.state.questionnaireResponse;

        const oldAnswer = response.questions?.get(question); //When you answered all questions, and go back to a question again - You will have an oldAnswer
        if (oldAnswer?.ToString() != answer.ToString()) { //Only change answer, if answer has changed
            response.questions?.set(question, answer);
            this.resetChildQuestions(question, response);
        }

        this.GoToNextPage();
        this.setState({ questionnaireResponse: response })
    }

    resetChildQuestions(parentQuestion: Question, response: QuestionnaireResponse): void {
        //In case you answered a parentquestion
        //All children should be reset
        response.questions?.forEach((_a, q) => {
            if (q.enableWhen?.questionId == parentQuestion.Id)
                response.questions?.delete(q);
        })
    }

    createLastColoumn(questionId: string, questionnaire: Questionnaire): JSX.Element {
        const questionIndex: number | undefined = questionnaire.questions!.findIndex(x => x.Id === questionId);
        if (questionIndex >= 0)
            return (<Button onClick={() => this.GoToPage(questionIndex)}> <EditIcon />  </Button>)
        return (<></>)
    }

    async submitQuestionnaireResponse(): Promise<void> {
        this.setState({ loadingPage: true })
        try {
            const questionnaireResponse = this.state.questionnaireResponse;
            questionnaireResponse.answeredTime = new Date();
            questionnaireResponse.status = QuestionnaireResponseStatus.NotProcessed
            const response = await this.questionnaireResponseService.SubmitQuestionnaireResponse(questionnaireResponse) ?? []
            let submitted = true;
            if (response.length > 0)
                submitted = false;

            this.setState({ loadingPage: false, submitted: submitted, callToActions: response })
        } catch (error) {
            this.setState(() => { throw error })
        }

    }
}