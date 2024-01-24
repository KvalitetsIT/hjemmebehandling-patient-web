import { Component } from "react";
import { Card, TableContainer, TableHead, TableBody, TableRow, TableCell, Table } from '@mui/material';
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question"
import { Answer, GroupAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer"
import ApiContext from "../../pages/_context";

interface Props {
    questionAnswerMap: Map<Question, Answer<any>>;
    lastRowJsx? : (questionId : string) => JSX.Element;
}

export default class QuestionAndAnswerTable extends Component<Props, {}>{
    static contextType = ApiContext

    render(): JSX.Element {
        const parentQuestions: Question[] = [], childQuestions: Question[] = [];
        this.props.questionAnswerMap.forEach((answer, question) => {
            if (question.enableWhen) {
                childQuestions.push(question);
            }
            else {
                parentQuestions.push(question);
            }
        });

        const array: { q: Question, a: Answer<any> }[] = [];
        parentQuestions.forEach(question => {
            array.push({ q: question, a: this.props.questionAnswerMap.get(question)! })

            if (question.type === QuestionTypeEnum.GROUP) {
                question.subQuestions?.map(subQuestion => {
                    const answer = this.props.questionAnswerMap.get(question)! as GroupAnswer;
                    const subAnswer = answer.answer?.find(a => a.questionId === subQuestion.Id)
                    array.push({ q: subQuestion, a: subAnswer! })
                })
            }
            

            childQuestions.filter(q => q instanceof Question && q.enableWhen?.questionId === question.Id).forEach(question => {
                array.push({ q: question, a: this.props.questionAnswerMap.get(question)! })
            })
        })

        return (
            <>
            
                <TableContainer component={Card}>
                    <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Spørgsmål</TableCell>
                            <TableCell>Svar</TableCell>
                            {this.props.lastRowJsx ? <TableCell></TableCell> : <></>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {array.map(questionAnswer => {
                            return (
                                <TableRow>
                                    <TableCell>{questionAnswer.q.question}</TableCell>
                                    <TableCell>{questionAnswer.a.ToString()}</TableCell>
                                    {this.props.lastRowJsx ? <TableCell>{this.props.lastRowJsx(questionAnswer.q.Id!)}</TableCell> : <></>}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                    </Table>
                </TableContainer>

            </>
        )
    }
}