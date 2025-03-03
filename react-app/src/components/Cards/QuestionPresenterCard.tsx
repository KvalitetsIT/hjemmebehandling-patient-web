import React, { Component } from "react";
import { Grid, Typography, Button, Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import ApiContext, { IApiContext } from "../../pages/_context";


import IValidationService from "../../services/interfaces/IValidationService";
import { TextFieldValidation } from "../Inputs/TextFieldValidation";
import { InvalidInputModel } from "../Errorhandling/ServiceErrors/InvalidInputError";
import IDateHelper from "../Helpers/interfaces/IDateHelper";
import { Answer, GroupAnswer, NumberAnswer, StringAnswer, BooleanAnswer } from "../Models/Answer";
import { Question, QuestionTypeEnum } from "../Models/Question";
import { ThresholdCollection } from "../Models/ThresholdCollection";




interface Props {
    question: Question;
    thresholds: ThresholdCollection[];
    answer?: Answer<any>;
    setQuestionAnswer: (question: Question, answer: Answer<any>) => void;
}

interface State {
    displayValue: Map<string,string>;
    tempAnswer: Answer<any>;
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

        const displayValues = new Map<string, string>();
        if (answer instanceof GroupAnswer) {
            answer.answer?.forEach(subAnswer => displayValues.set(subAnswer.questionId, subAnswer.answer?.toString()));
        }
        else {
            displayValues.set(answer.questionId, answer.answer?.toString());
        }

        this.state = {
            displayValue: displayValues,
            tempAnswer: answer!,
            errorArray: []
        }

        this.updateAnswer = this.updateAnswer.bind(this);
    }

    createInitialAnswer(question: Question): Answer<any> {

        if (!question.Id) throw new Error("Question.id is missing / undefined")

        switch (question.type) {
            case QuestionTypeEnum.OBSERVATION:
                return new NumberAnswer(question.Id);

            case QuestionTypeEnum.INTEGER:
                return new NumberAnswer(question.Id);

            case QuestionTypeEnum.CHOICE:
                return new StringAnswer(question.Id);

            case QuestionTypeEnum.BOOLEAN:
                return new BooleanAnswer(question.Id);

            case QuestionTypeEnum.GROUP:
                const groupAnswer = new GroupAnswer(question.Id);
                groupAnswer.answer = question.subQuestions ? question.subQuestions.map(subQuestion => this.createInitialAnswer(subQuestion)) : []
                return groupAnswer

            default:
                return new StringAnswer(question.Id)
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
                        <Box sx={{ minHeight: 60 }}>

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
            const noneEmpty = this.state.tempAnswer.answer?.every(sa => !(isNaN(sa.answer)));
            if (noneEmpty) {
                emptyAnswer = false
            }
        }
        else if (this.state.tempAnswer instanceof NumberAnswer) {
            const empty = !isNaN(this.state.tempAnswer.answer!);

            if (empty) {
                emptyAnswer = false
            }
        }
        else if (this.state.tempAnswer instanceof BooleanAnswer) {
            emptyAnswer = this.state.tempAnswer.answer == undefined;
        }
        else {
            const empty = this.state.tempAnswer.AnswerAsString();
            if (empty) {
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
            <Grid container spacing={1} >
                {this.props.question.subQuestions?.map((subQuestion, index) => {
                    const answer = this.state.tempAnswer as GroupAnswer;
                    const subAnswer = answer.answer?.find(a => a.questionId === subQuestion.Id)

                    const threshold = this.props.thresholds.find(t => t.questionId === subQuestion.Id);

                    return (
                        <Grid container item spacing={1} justifyContent={"center"} alignItems="center" direction={"row"}>
                            <Grid item xs={7} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <TextFieldValidation
                                    id={"questionInput_" + index}
                                    onValidation={(uid, errors) => this.onValidation(uid, errors)}
                                    validate={(cpr) => this.validationService.ValidateQuestionInput(cpr, threshold)}
                                    required={true}
                                    label="Svar"
                                    type="number"
                                    value={this.state.displayValue.get(subAnswer.questionId)}
                                    onChange={input => this.updateAnswer(subQuestion.Id!, input.target.value)}
                                    uniqueId={index} />
                            </Grid>
                            <Grid item xs sx={{ display: "flex", justifyContent: "flex-start" }}>
                                <Typography>{subQuestion.measurementType?.displayName}</Typography>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    getChoiceInput(): JSX.Element {
        const isNumbers = this.props.question.options?.every(x => !Number.isNaN(parseFloat(x.option)))
        return (
            <>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue={this.state.tempAnswer.answer}
                        onChange={x => this.updateAnswer(this.state.tempAnswer.questionId, x.target.value)}>
                        {this.props.question.options?.map(option => {
                            return (
                                <FormControlLabel sx={isNumbers ? {} : {paddingTop: '4px'}}
                                    value={option.option}
                                    control={<Radio />}
                                    label={
                                        <Stack justifyContent="start" alignItems={"flex-start"} direction={isNumbers ? "row" : "column"} >
                                            <Typography fontWeight={"bold"}>{option.option}</Typography>
                                            {isNumbers ? <Typography>&nbsp; - &nbsp;</Typography> : <></> }
                                            { (option.comment !== undefined  || option.comment !== "") && <Typography variant={isNumbers ? "body1" : "caption"}>{option.comment}</Typography>}
                                        </Stack>
                                    }
                                />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
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
                        <Button sx={{ pt: 2, pb: 2 }} variant={variant} onClick={() => this.updateAnswer(this.state.tempAnswer.questionId, optionAsString)}>{option ? "Ja" : "Nej"}</Button>
                    )
                })}
            </>
        )
    }

    getNumberInput(): JSX.Element {
        const threshold = this.props.thresholds.find(t => t.questionId === this.props.question.Id);
        return (
            <TextFieldValidation
                id="questionInput"
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                validate={(cpr) => this.validationService.ValidateQuestionInput(cpr, threshold)}
                required={true}
                label="Svar"
                type="number"
                value={this.state.displayValue.get(this.state.tempAnswer.questionId)}
                onChange={input => this.updateAnswer(this.state.tempAnswer.questionId, input.target.value)}
                uniqueId={0} />
        )
    }

    updateAnswer(questionId: string, answerValue: string): void {

        let answer: Answer<any>;

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
            const tmpAnswer = this.state.tempAnswer as BooleanAnswer;
            tmpAnswer.answer = answerValue.toLowerCase() === "true";
            answer = tmpAnswer;
        }
        else if (this.state.tempAnswer instanceof GroupAnswer) {
            const tmpAnswer = this.state.tempAnswer as GroupAnswer;
            const subAnswer = tmpAnswer.answer?.find(a => a.questionId === questionId);
            //console.log("updateAnswer: group", tmpAnswer, subAnswer)
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

        const displayValues = this.state.displayValue;
        displayValues.set(questionId, answerValue);

        this.setState({ displayValue: displayValues, tempAnswer: answer! });
    }

    onValidation(from: number, invalid: InvalidInputModel[]): void {
        this.setState({ errorArray: invalid })
    }
}