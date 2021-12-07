import { Component } from "react";
import { Card, TableContainer, TableHead, TableBody, TableRow, TableCell, Table } from '@mui/material';
import { Question } from "../Models/Question"
import { Answer } from "../Models/Answer"
import ApiContext from "../../pages/_context";

interface Props {
    questionAnswerMap: Map<Question, Answer>;
}

export default class QuestionAndAnswerTable extends Component<Props, {}>{
    static contextType = ApiContext

    render(): JSX.Element {
        const array: { q: Question, a: Answer }[] = [];
        this.props.questionAnswerMap.forEach((answer, question) => {
            array.push({ q: question, a: answer })
        });

        return (
            <>
            
                <TableContainer component={Card}>
                    <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Spørgsmål</TableCell>
                            <TableCell>Svar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {array.map(questionAnswer => {
                            return (
                                <TableRow>
                                    <TableCell>{questionAnswer.q.question}</TableCell>
                                    <TableCell>{questionAnswer.a.ToString()}</TableCell>
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