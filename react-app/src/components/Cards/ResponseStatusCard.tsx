import { Component } from "react";
import { Card, Avatar, Grid, Typography } from '@mui/material';



import ApiContext, { IApiContext } from "../../pages/_context";

import { CheckmarkIcon, MessagesIcon } from "../icons/Icons";
import IsEmptyCard from "../Errorhandling/IsEmptyCard";
import IDateHelper from "../Helpers/interfaces/IDateHelper";
import { PatientCareplan } from "../Models/PatientCareplan";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../Models/QuestionnaireResponse";

interface Props{
    questionnaireResponse : QuestionnaireResponse;
    careplan : PatientCareplan;
}

export default class ResponseStatusCard extends Component<Props,{}>{
    static contextType = ApiContext
     
    dateHelper!: IDateHelper;

    initializeServices() : void{
        const api = this.context as IApiContext
        this.dateHelper = api.dateHelper;
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
                        <Grid className="container-avatar" container  p={2}>
                            <Grid>
                                <Avatar sx={{ margin: 0, marginRight: 2, bgcolor : this.getStatusColor(questionnaireResponse.status)}} variant="rounded">
                                    {this.getStatusIcon(questionnaireResponse.status)}
                                </Avatar>
                            </Grid>
                            <Grid>
                                <Typography variant="subtitle1">{questionnaire?.name}</Typography>
                                <Typography variant="subtitle2">{organizationName}</Typography>
                            </Grid>
                            {(questionnaireResponse.status ===  QuestionnaireResponseStatus.Processed) ?
                                <Grid sx={{ textAlign: 'right', flexGrow: 1}}>
                                    <Typography variant="subtitle1">Kvitteret den</Typography>
                                    <Typography variant="subtitle2">{this.dateHelper.DateToString(questionnaireResponse.examinedTime!)}</Typography>
                                </Grid>
                                :
                                <Grid sx={{ textAlign: 'right', flexGrow: 1}}>
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