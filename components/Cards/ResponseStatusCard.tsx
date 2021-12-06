import { Component } from "react";
import { Card, CardContent, Avatar, Grid, Typography } from '@mui/material';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../Models/QuestionnaireResponse";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PatientCareplan } from "../Models/PatientCareplan";
import IsEmptyCard from "../Cards/IsEmptyCard"
import ApiContext from "../../pages/_context";
import IDateHelper from "../../globalHelpers/interfaces/IDateHelper";

interface Props{
    questionnaireResponse : QuestionnaireResponse;
    careplan : PatientCareplan;
}

export default class ResponseStatusCard extends Component<Props,{}>{
    static contextType = ApiContext
    dateHelper!: IDateHelper;

    initializeServices() : void{
        this.dateHelper = this.context.dateHelper;
    }

    getStatusIcon(status : QuestionnaireResponseStatus) : JSX.Element{
        let toReturn = (<></>);
        switch(status){
            case QuestionnaireResponseStatus.InProgress:
                toReturn = (<MailOutlineIcon/>)
            break;
            case QuestionnaireResponseStatus.NotAnswered:
                toReturn = (<MailOutlineIcon/>)
            break;
            case QuestionnaireResponseStatus.NotProcessed:
                toReturn = (<MailOutlineIcon/>)
            break;
            case QuestionnaireResponseStatus.Processed:
                toReturn = (<CheckCircleOutlineIcon/>)
            break;
        }
        return toReturn;
    }

    render() : JSX.Element{
        this.initializeServices();

        const questionnaireId = this.props.questionnaireResponse?.questionnaireId;
        const questionnaire = this.props.careplan?.questionnaires?.find(x=>x.id === questionnaireId);
        const questionnaireResponse = this.props.questionnaireResponse;
            return (
            <IsEmptyCard object={questionnaireResponse} textWhenEmpty="Ingen besvarelse fundet" >
                <IsEmptyCard object={questionnaire} textWhenEmpty="Intet spørgeskema fundet" >
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Avatar variant="square">
                                        {this.getStatusIcon(questionnaireResponse.status)}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{questionnaire?.name}</Typography>
                                    <Typography></Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography>Sendt den</Typography>
                                    <Typography>{questionnaireResponse.answeredTime ? this.dateHelper.DateToString(questionnaireResponse!.answeredTime) : "-"}</Typography>
                                </Grid>
                            </Grid>
                            
                        </CardContent>
                    </Card>
                </IsEmptyCard>
            </IsEmptyCard>
            )
        
    }
}