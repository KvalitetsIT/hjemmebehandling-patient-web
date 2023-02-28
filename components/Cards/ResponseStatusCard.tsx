import { Component } from "react";
import { Card, Avatar, Grid, Typography } from '@mui/material';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard"
import ApiContext from "../../pages/_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { CheckmarkIcon, MessagesIcon } from "../icons/Icons";

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
                toReturn = (<MessagesIcon size="2.5rem" color="#5D74AC"/>)
            break;
            case QuestionnaireResponseStatus.NotAnswered:
                toReturn = (<MessagesIcon size="2.5rem" color="#5D74AC"/>)
            break;
            case QuestionnaireResponseStatus.NotProcessed:
                toReturn = (<MessagesIcon size="2.5rem" color="#5D74AC"/>)
            break;
            case QuestionnaireResponseStatus.Processed:
                toReturn = (<CheckmarkIcon size="2.5rem" color="#4A6F58"/>)
            break;
        }
        return toReturn;
    }
    getStatusColor(status : QuestionnaireResponseStatus) : "#E8EFF7" | "#D0EFDC" {
        let toReturn : "#E8EFF7" | "#D0EFDC"  = "#E8EFF7";
        switch(status){
            case QuestionnaireResponseStatus.Processed:
                toReturn = "#D0EFDC"
            break;
        }
        return toReturn;
    }
    
    render() : JSX.Element{
        this.initializeServices();

        const questionnaireId = this.props.questionnaireResponse?.questionnaireId;
        const questionnaire = this.props.careplan?.questionnaires?.find(x=>x.id === questionnaireId);
        const questionnaireResponse = this.props.questionnaireResponse;
        const organizationName = this.props.careplan.organization?.name ?? "Ukendt afdeling";

        return (
            <IsEmptyCard object={questionnaireResponse} jsxWhenEmpty="Ingen besvarelse fundet" >
                <IsEmptyCard object={questionnaire} jsxWhenEmpty="Intet spørgeskema fundet" >
                    <Card>
                        <Grid className="container-avatar" container>
                            <Grid item xs={1}>
                                <Avatar sx={{height:"60px",width:"60px", bgcolor : this.getStatusColor(questionnaireResponse.status)}} variant="rounded">
                                    {this.getStatusIcon(questionnaireResponse.status)}
                                </Avatar>
                            </Grid>
                            <Grid xs={7} sx={{margin: 2 }}>
                                <Typography variant="subtitle1">{questionnaire?.name}</Typography>
                                <Typography variant="subtitle2">{organizationName}</Typography>
                            </Grid>
                            {(questionnaireResponse.status ==  QuestionnaireResponseStatus.Processed) ?
                                <Grid xs sx={{ margin: 2, textAlign: 'right' }}>
                                    <Typography variant="subtitle1">Kvitteret den</Typography>
                                    <Typography variant="subtitle2">{this.dateHelper.DateToString(questionnaireResponse.examinedTime!)}</Typography>
                                </Grid>
                                :
                                <Grid item xs sx={{ margin: 2, textAlign: 'right' }}>
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