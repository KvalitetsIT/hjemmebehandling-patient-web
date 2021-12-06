import { Component } from "react";
import { Card, CardContent, Typography,Grid, Box } from '@mui/material';
import {Question} from "../Models/Question"
import {Answer} from "../Models/Answer"
import ApiContext from "../../pages/_context";

interface Props{
    questionAnswerMap : Map<Question,Answer>;
}

export default class QuestionAndAnswerCard extends Component<Props,{}>{
    static contextType = ApiContext
    render() : JSX.Element{
            const array : {q : Question, a : Answer}[] = [];
            this.props.questionAnswerMap.forEach( (answer,question) => {
                array.push({q : question, a : answer})
            });

            return (
                <>
                {array.map(questionAnswer => {
                    return (
                        <Card component={Box} marginTop={2}>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={8}>
                                        <Typography>{questionAnswer.q.question}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>{questionAnswer.a.ToString()}</Typography>
                                    </Grid>
                                </Grid>
                                    
                            </CardContent>
                        </Card>
                    )
                })}
                
                </>
            )
    }
}