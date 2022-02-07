import { Component } from "react";
import { Card, TableContainer, TableHead, TableBody, TableRow, TableCell, Table } from '@mui/material';
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question"
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer"
import ApiContext from "../../pages/_context";

interface Props {
    questionAnswerMap: Map<Question, Answer>;
    lastRowJsx? : (questionId : string) => JSX.Element;
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