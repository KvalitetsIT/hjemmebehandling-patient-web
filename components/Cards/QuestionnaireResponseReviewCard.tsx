import { Component } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { Questionnaire } from "../Models/Questionnaire";
import { Link } from "react-router-dom";
import IDateHelper from "../../globalHelpers/interfaces/IDateHelper";
import ApiContext from "../../pages/_context";

interface Props {
    questionnaire: Questionnaire
}

export default class QuestionnaireResponseReviewCard extends Component<Props, {}>{
    dateHelper!: IDateHelper;
    static contextType = ApiContext

    initialiseServices() : void{
        this.dateHelper = this.context.dateHelper;
    }

    render(): JSX.Element {
        this.initialiseServices();
        const questionnaire = this.props.questionnaire;
        
        const todayEnum = this.dateHelper.DayIndexToDay(new Date().getDay());
        const deadlineIsToday = questionnaire.frequency?.repeated.includes(todayEnum);
        return (
            <Card>
                <CardHeader subheader={questionnaire?.name} />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2">
                        Infektionssygdomme har sendt dig dette spørgeskema
                    </Typography>
                    {deadlineIsToday ?
                        <Typography variant="caption">Besvares i dag, inden kl {questionnaire?.frequency?.deadline}</Typography> :
                        <></>
                    }
                </CardContent>
                <CardActions>
                    <Button component={Link} to={"/questionnaire/" + questionnaire.id + "/answer"} fullWidth variant="contained">Besvar nu</Button>
                </CardActions>
            </Card>
        )
    }
}