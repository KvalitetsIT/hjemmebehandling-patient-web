import { Component } from "react";
import { Card, Avatar, Grid, Typography } from '@mui/material';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard"
import ApiContext from "../../pages/_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";

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
    getStatusColor(status : QuestionnaireResponseStatus) : "lightblue" | "green" {
        let toReturn : "lightblue" | "green"  = "lightblue";
        switch(status){
            case QuestionnaireResponseStatus.Processed:
                toReturn = "green"
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
            <IsEmptyCard object={questionnaireResponse} jsxWhenEmpty="Ingen besvarelse fundet" >
                <IsEmptyCard object={questionnaire} jsxWhenEmpty="Intet spørgeskema fundet" >
                    <Card>
                        <Grid container>
                            <Grid item xs={1}>
                                <Avatar sx={{height:"100%",width:"100%", bgcolor : this.getStatusColor(questionnaireResponse.status)}} variant="square">
                                    {this.getStatusIcon(questionnaireResponse.status)}
                                </Avatar>
                            </Grid>
                            <Grid item sx={{padding:2}} xs={8}>
                                <Typography variant="subtitle1">{questionnaire?.name}</Typography>
                                <Typography variant="subtitle2">SomeHardcodedAfdeling</Typography>
                            </Grid>
                            {(questionnaireResponse.status ==  QuestionnaireResponseStatus.Processed) ?
                                <Grid item sx={{padding:2}} xs={2}>
                                    <Typography variant="subtitle1">Kvitteret den</Typography>
                                    <Typography variant="subtitle2">{this.dateHelper.DateToString(questionnaireResponse.examinedTime!)}</Typography>
                                </Grid>
                                :
                                <Grid item sx={{padding:2}} xs={2}>
                                    <Typography variant="subtitle1">Sendt den</Typography>
                                    <Typography variant="subtitle2">{questionnaireResponse.answeredTime ? this.dateHelper.DateToString(questionnaireResponse!.answeredTime) : "-"}</Typography>
                                </Grid>
                            }
                        </Grid>                            
                    </Card>
                </IsEmptyCard>
            </IsEmptyCard>
        )
    }
}