import { Component } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { Questionnaire } from "../Models/Questionnaire";

interface Props{
    questionnaire : Questionnaire
    showDeadline : boolean
}

export default class QuestionnaireAnswerCard extends Component<Props,{}>{
    render() : JSX.Element{
        const questionnaire = this.props.questionnaire;
        return (
            <Card>
                <CardHeader subheader={questionnaire?.name}/>
                <Divider/>
                <CardContent>
                    <Typography variant="subtitle2">
                    Infektionssygdomme har sendt dig dette spørgeskema
                    </Typography>
                    {this.props.showDeadline ? 
                        <Typography variant="caption">Besvares i dag, inden kl {questionnaire?.frequency?.deadline}</Typography> : 
                        <></>
                    }
                </CardContent>
                <CardActions>
                    <Button fullWidth variant="contained">Besvar nu</Button>
                </CardActions>
            </Card>
        )
    }
}