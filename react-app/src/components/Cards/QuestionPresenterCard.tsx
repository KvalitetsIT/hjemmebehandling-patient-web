import React, { Component } from "react";
import { Grid, Typography, Button, Box } from '@mui/material';
import ApiContext, { IApiContext } from "../../pages/_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper"
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import IValidationService from "../../services/interfaces/IValidationService";
import { TextFieldValidation } from "../Inputs/TextFieldValidation";
import { Answer, BooleanAnswer, GroupAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";

interface Props {
    question: Question;
    thresholds: ThresholdCollection;
    answer?: Answer;
    setQuestionAnswer: (question: Question, answer: Answer) => void;
}

interface State {
    tempAnswer: Answer;
    errorArray: InvalidInputModel[];
}
export default class QuestionPresenterCard extends Component<Props, State>{
    static contextType = ApiContext
     
    dateHelper!: IDateHelper;
    validationService!: IValidationService;

    constructor(props: Props) {
        super(props);

        let answer;
        if (this.props.answer) {
            answer = this.props.answer;
        }
        else {
            answer = this.createInitialAnswer(this.props.question);
        }

        this.state = {
            tempAnswer: answer!,
            errorArray: []
        }

        this.updateAnswer = this.updateAnswer.bind(this);
    }

    createInitialAnswer(question: Question): Answer {
        let answer : Answer;
        switch (question.type) {
            case QuestionTypeEnum.OBSERVATION:
                answer = new NumberAnswer();
                break;
            case QuestionTypeEnum.INTEGER:
                answer = new NumberAnswer();
                break;
            case QuestionTypeEnum.CHOICE:
                answer = new StringAnswer();
                break;
            case QuestionTypeEnum.BOOLEAN:
                answer = new BooleanAnswer();
                break;
            case QuestionTypeEnum.GROUP:
                const groupAnswer = new GroupAnswer();
                groupAnswer.subAnswers = [];
                question.subQuestions!.map(subQuestion => {
                    const subAnswer = this.createInitialAnswer(subQuestion);
                    groupAnswer.subAnswers.push(subAnswer)
                });
                answer = groupAnswer
                break;
        }
        answer!.questionId = question.Id!;
        return answer!;
    }

    initializeServices(): void {
        const api = this.context as IApiContext
        this.validationService = api.validationService;
    }

    render(): JSX.Element {
        
        this.initializeServices();
        return (
            <>
                <Grid container spacing={2} justifyContent="center" >
                    <Grid item xs={12} >
                        <Typography className="question">{this.props.question.question}</Typography>
                    </Grid>
                    <Grid item xs={8} minHeight={75}>
                        <Typography variant="subtitle2">{this.props.question.helperText}</Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Box sx={{ minHeight:60 }}>
                            {this.renderQuestionInput(this.props.question)}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>

                        <Button
                            disabled={this.buttonShouldBeDisabled()}
                            onClick={() => this.props.setQuestionAnswer(this.props.question, this.state.tempAnswer)}
                            variant="contained">
                            Næste
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    }

    buttonShouldBeDisabled(): boolean {
        const answer = this.state.tempAnswer
        let nextIsDisabled = false;
        nextIsDisabled ||= !answer
        
        let emptyAnswer = true;
        if (this.state.tempAnswer instanceof GroupAnswer) {
            const empty = this.state.tempAnswer.subAnswers.find(sa => !(sa.AnswerAsString()));
            if (!empty) {
                console.log("disabling buttoin?", empty)
                emptyAnswer = false
            }
        }
        else if (this.state.tempAnswer instanceof BooleanAnswer) {
            emptyAnswer = this.state.tempAnswer.answer == undefined;
        }
        else {
            const empty = this.state.tempAnswer.AnswerAsString();
            if (empty) {
                console.log("disabling buttoin?", empty)  
                emptyAnswer = false
            }
        }
        nextIsDisabled ||= emptyAnswer!;
        nextIsDisabled ||= this.state.errorArray.length !== 0

        return nextIsDisabled;
    }

    renderQuestionInput(question: Question): JSX.Element {
        const questionType = question.type;
        switch (questionType) {
            case QuestionTypeEnum.OBSERVATION:
                return this.getNumberInput();
            case QuestionTypeEnum.INTEGER:
                return this.getNumberInput();
            case QuestionTypeEnum.CHOICE:
                return this.getChoiceInput();
            case QuestionTypeEnum.BOOLEAN:
                return this.getBooleanInput();
            case QuestionTypeEnum.GROUP:
                return this.getGroupInput();
        }
        return (<>Spørgsmålstype ikke genkendt</>)
    }

    getGroupInput(): JSX.Element {
        return (
            <Grid container columnSpacing={2} justifyContent="center" direction={"column"}>
                <Grid item xs={12}  >
                {this.props.question.subQuestions?.map((subQuestion, index) => {
                    const answer = this.state.tempAnswer as GroupAnswer;
                    const subAnswer = answer.subAnswers.find(a => a.questionId === subQuestion.Id)
                    console.log("blaaahh", subQuestion, answer, subAnswer)
                    console.log("")
                    return (
                        <Grid container columnSpacing={2} justifyContent="center" direction={"row"}>
                            <Grid item >
                            <TextFieldValidation
                                id={"questionInput_"+index}
                                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                                validate={(cpr) => this.validationService.ValidateQuestionInput(cpr,this.props.thresholds)}
                                required={true}
                                label="Svar"
                                type="number"
                                value={subAnswer?.AnswerAsString()}
                                onChange={input => this.updateAnswer(subQuestion.Id!, input.target.value)}
                                uniqueId={index} />
                            </Grid>
                            <Grid item>
                            <Typography>{subQuestion.question}</Typography>
                            </Grid>
                            </Grid>
                    )
                })}
                </Grid>
            </Grid>
        )
    }

    getChoiceInput(): JSX.Element {
        return (
            <>
                {this.props.question.options?.map(option => {
                    let variant: "contained" | "text" = "text"
                    if (this.state.tempAnswer.AnswerAsString()?.toLowerCase() === option.toLowerCase())
                        variant = "contained"
                    return (
                        <Button variant={variant} onClick={() => this.updateAnswer(this.state.tempAnswer.questionId, option)}>{option}</Button>
                    )
                })}
            </>
        )
    }

    getBooleanInput(): JSX.Element {
        return (
            <>
                {[true, false].map(option => {
                    let variant: "contained" | "text" = "text"

                    const optionAsString = option.toString()
                    const tempAnswer = this.state.tempAnswer as BooleanAnswer

                    if (option === tempAnswer.answer)
                        variant = "contained"

                    return (
                        <Button sx={{pt: 2, pb: 2}} variant={variant} onClick={() => this.updateAnswer(this.state.tempAnswer.questionId, optionAsString)}>{option ? "Ja" : "Nej"}</Button>
                    )
                })}
            </>
        )
    }

    getNumberInput(): JSX.Element {
        return (
            <TextFieldValidation
                id="questionInput"
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                validate={(cpr) => this.validationService.ValidateQuestionInput(cpr,this.props.thresholds)}
                required={true}
                label="Svar"
                type="number"
                value={this.state.tempAnswer.AnswerAsString()}
                onChange={input => this.updateAnswer(this.state.tempAnswer.questionId, input.target.value)}
                uniqueId={0} />
        )
    }

    updateAnswer(questionId: string, answerValue: string): void {
        console.log("ugf")
        let answer : Answer;

        if (this.state.tempAnswer instanceof NumberAnswer) {
            const tmpAnswer = this.state.tempAnswer as NumberAnswer;
            tmpAnswer.answer = parseFloat(answerValue);
            answer = tmpAnswer;
        }
        else if (this.state.tempAnswer instanceof StringAnswer) {
            const tmpAnswer = this.state.tempAnswer as StringAnswer;
            tmpAnswer.answer = answerValue;
            answer = tmpAnswer;
        }
        else if (this.state.tempAnswer instanceof BooleanAnswer) {
            console.log("ugf", answerValue)
            const tmpAnswer = this.state.tempAnswer as BooleanAnswer;
            tmpAnswer.answer = answerValue.toLowerCase() === "true";
            answer = tmpAnswer;
        }
        else if (this.state.tempAnswer instanceof GroupAnswer) {
            const tmpAnswer = this.state.tempAnswer as GroupAnswer;
            const subAnswer = tmpAnswer.subAnswers.find(a => a.questionId === questionId);
            console.log("updateAnswer: group", tmpAnswer, subAnswer)
            if (subAnswer instanceof NumberAnswer) {
                subAnswer.answer = parseFloat(answerValue);
            }
            else if (subAnswer instanceof StringAnswer) {
                subAnswer.answer = answerValue;
            }
            else if (subAnswer instanceof BooleanAnswer) {
                subAnswer.answer = answerValue.toLowerCase() === "true";
            }
            answer = tmpAnswer;
        }
        
        this.setState({ tempAnswer: answer! });
    }

    onValidation(from: number, invalid: InvalidInputModel[]): void {
        this.setState({ errorArray: invalid })
    }
}