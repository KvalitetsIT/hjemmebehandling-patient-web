import React, { Component } from "react";
import { Grid, Typography, Button, Box } from '@mui/material';
import ApiContext, { IApiContext } from "../../pages/_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper"
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import IValidationService from "../../services/interfaces/IValidationService";
import { TextFieldValidation } from "../Inputs/TextFieldValidation";
import { Answer, BooleanAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";

interface Props {
    question: Question;
    thresholds: ThresholdCollection;
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

        if (props.answer instanceof BooleanAnswer) {
            initialAnswer = props.answer.answer + ""
        }

        this.state = {
            tempAnswer: initialAnswer,
            errorArray: []
        }
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
                        <Box sx={{ height:60 }}>
                            {this.renderQuestionInput(this.props.question)}
                        </Box>
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
                observationAnswer.answer = parseFloat(answerString);
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
                booleanAnswer.answer = answerString.toLowerCase() === "true"
                answer = booleanAnswer;
                break;
        }
        return answer;
    }


    buttonShouldBeDisabled(): boolean {
        const answer = this.state.tempAnswer
        let nextIsDisabled = false;
        nextIsDisabled ||= !answer
        nextIsDisabled ||= answer === ""
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
        }
        return (<>Spørgsmålstype ikke genkendt</>)
    }

    getChoiceInput(): JSX.Element {
        return (
            <>
                {this.props.question.options?.map(option => {
                    let variant: "contained" | "text" = "text"
                    if (this.state.tempAnswer.toLowerCase() === option.toLowerCase())
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
                {[true, false].map(option => {
                    let variant: "contained" | "text" = "text"

                    const optionAsString = option.toString()
                    const tempAnswer = this.state.tempAnswer

                    if (optionAsString === tempAnswer)
                        variant = "contained"

                    return (
                        <Button sx={{pt: 2, pb: 2}} variant={variant} onClick={() => this.setState({ tempAnswer: optionAsString })}>{option ? "Ja" : "Nej"}</Button>
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
                value={this.state.tempAnswer}
                onChange={input => this.setState({ tempAnswer: input.target.value })}
                uniqueId={0} />
        )
    }

    onValidation(from: number, invalid: InvalidInputModel[]): void {
        this.setState({ errorArray: invalid })
    }
}