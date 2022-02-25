import React, { Component } from "react";
import { Grid, Typography, Button } from '@mui/material';
import ApiContext from "../../pages/_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper"
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import IValidationService from "../../services/interfaces/IValidationService";
import { TextFieldValidation } from "../Inputs/TextFieldValidation";
import { Answer, BooleanAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";

interface Props {
    question: Question;
    answer?: Answer;
    setQuestionAnswer: (question: Question, answer: Answer) => void;
}

interface State {
    tempAnswer: string;
    errorArray: InvalidInputModel[];
}
export default class QuestionPresenterCard extends Component<Props, State>{
    static contextType = ApiContext
    dateHelper!: IDateHelper;
    validationService!: IValidationService;

    constructor(props: Props) {
        super(props);

        let initialAnswer = "";
        if (props.answer instanceof NumberAnswer) {
            initialAnswer = props.answer.answer + "";
        }
        if (props.answer instanceof StringAnswer) {
            initialAnswer = props.answer.answer + ""
        }

        this.state = {
            tempAnswer: initialAnswer,
            errorArray: []
        }
    }

    initializeServices(): void {
        this.validationService = this.context.validationService;
    }

    render(): JSX.Element {
        this.initializeServices();
        return (
            <>
                <Grid container spacing={2} justifyContent="center" >
                    <Grid item xs={12} >
                        <Typography>{this.props.question.question}</Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <Typography variant="subtitle2">{this.props.question.helperText}</Typography>
                    </Grid>
                    <Grid item xs={12} >

                        {this.renderQuestionInput(this.props.question)}
                    </Grid>

                    <Grid item xs={12}>

                        <Button
                            disabled={this.buttonShouldBeDisabled()}
                            onClick={() => this.answerQuestion()}
                            variant="contained">
                            Næste
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    }

    answerQuestion(): void {
        const answer: Answer = this.createAnswer(this.props.question, this.state.tempAnswer);
        this.props.setQuestionAnswer(this.props.question, answer);
    }

    createAnswer(question: Question, answerString: string): Answer {
        let answer: Answer = new StringAnswer();
        switch (question.type) {
            case QuestionTypeEnum.OBSERVATION:
                const observationAnswer = new NumberAnswer();
                observationAnswer.answer = answerString as unknown as number;
                answer = observationAnswer;
                break;
            case QuestionTypeEnum.INTEGER:
                const integerAnswer = new NumberAnswer();
                integerAnswer.answer = answerString as unknown as number;
                answer = integerAnswer;
                break;
            case QuestionTypeEnum.CHOICE:
                const choiceAnswer = new StringAnswer();
                choiceAnswer.answer = answerString as unknown as string;
                answer = choiceAnswer;
                break;
            case QuestionTypeEnum.BOOLEAN:
                const booleanAnswer = new BooleanAnswer();
                booleanAnswer.answer = answerString.toLowerCase() == "ja"
                answer = booleanAnswer;
                break;
        }
        return answer;
    }


    buttonShouldBeDisabled(): boolean {
        const answer = this.state.tempAnswer
        let nextIsDisabled = false;
        nextIsDisabled ||= !answer
        nextIsDisabled ||= answer == ""
        nextIsDisabled ||= this.state.errorArray.length != 0

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
        }
        return (<>Spørgsmålstype ikke genkendt</>)
    }

    getChoiceInput(): JSX.Element {
        return (
            <>
                {this.props.question.options?.map(option => {
                    let variant: "contained" | "text" = "text"
                    if (this.state.tempAnswer === option)
                        variant = "contained"
                    return (
                        <Button variant={variant} onClick={() => this.setState({ tempAnswer: option })}>{option}</Button>
                    )
                })}
            </>
        )
    }

    getBooleanInput(): JSX.Element {
        return (
            <>
                {["Ja", "Nej"].map(option => {
                    let variant: "contained" | "text" = "text"
                    if (this.state.tempAnswer === option)
                        variant = "contained"
                    return (
                        <Button variant={variant} onClick={() => this.setState({ tempAnswer: option })}>{option}</Button>
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
                validate={(cpr) => this.validationService.ValidateNumber(cpr)}
                required={true}
                label="Svar"
                type="number"
                value={this.state.tempAnswer}
                onChange={input => this.setState({ tempAnswer: input.target.value })}
                uniqueId={0} />
        )
    }

    onValidation(from: number, invalid: InvalidInputModel[]): void {
        this.setState({ errorArray: invalid })
    }
}