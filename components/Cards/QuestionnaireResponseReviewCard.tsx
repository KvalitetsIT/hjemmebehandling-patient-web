import { Component } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { Questionnaire } from "../Models/Questionnaire";
import { Link } from "react-router-dom";

interface Props{
    questionnaire : Questionnaire
    showDeadline : boolean
}

export default class QuestionnaireResponseReviewCard extends Component<Props,{}>{
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
                    <Button component={Link} to={"/questionnaire/"+questionnaire.id+"/answer"} fullWidth variant="contained">Besvar nu</Button>
                </CardActions>
            </Card>
        )
    }
}