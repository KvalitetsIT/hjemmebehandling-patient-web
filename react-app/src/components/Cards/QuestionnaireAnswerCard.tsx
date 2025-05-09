import { Component } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Typography } from '@mui/material';

import { Link } from "react-router-dom";
import ApiContext, { IApiContext } from "../../pages/_context";


import ICareplanService from "../../services/interfaces/ICareplanService";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";
import { LatestResponseEnum } from "../../services/QuestionnaireResponseService";
import IDateHelper from "../Helpers/interfaces/IDateHelper";
import { PatientCareplan } from "../Models/PatientCareplan";
import { Questionnaire } from "../Models/Questionnaire";

interface Props {
    questionnaire: Questionnaire
    careplan?: PatientCareplan
}

interface State {
    latestResponse: LatestResponseEnum;
    loading: boolean;
}

export default class QuestionnaireAnswerCard extends Component<Props, State>{
    dateHelper!: IDateHelper;
    static contextType = ApiContext
     

    careplanService!: ICareplanService;
    questionnaireResponseService!: IQuestionnaireResponseService;

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            latestResponse: LatestResponseEnum.Unknown
        }
    }

    initialiseServices(): void {
        const api = this.context as IApiContext

        this.dateHelper = api.dateHelper;
        this.careplanService = api.careplanService;
        this.questionnaireResponseService = api.questionnaireResponseService;
    }

    async shouldBeAnsweredToday(): Promise<LatestResponseEnum> {

        const careplan = this.props.careplan;
        const questionnaire = this.props.questionnaire;

        const shouldBeAnswered: LatestResponseEnum = await this.questionnaireResponseService.GetQuestionnaireAnsweredStatus(careplan!.id!, questionnaire);
        return shouldBeAnswered;
    }

    async componentDidMount(): Promise<void> {
        this.setState({
            loading: true
        });

        try {
            const shouldBeAnswered = await this.shouldBeAnsweredToday();
            this.setState({
                latestResponse: shouldBeAnswered
            });
        } catch (error) {
            this.setState(() => { throw error });
        }
        this.setState({
            loading: false
        });
    }

    render(): JSX.Element {
        this.initialiseServices();

        if (this.state.loading) {
            return <Skeleton width={300} height={400}></Skeleton>
        }

        const questionnaire = this.props.questionnaire;
        const latestResponse = this.state.latestResponse
        const today = this.dateHelper.DayIndexToDay( new Date().getDay());

        return (
            <Card>
                <CardHeader subheader={questionnaire?.name} />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2">
                        {this.props.careplan?.organization?.name} har sendt dig dette spørgeskema
                    </Typography>
                    {questionnaire.frequency?.days.find(day => day === today) ?
                        <Typography variant="caption">Besvares i dag, senest kl. {questionnaire?.frequency?.deadline}</Typography> :
                        <Typography variant="caption">Besvares {questionnaire?.frequency?.ToString()}</Typography>
                    }
                </CardContent>
                <CardActions>
                    {latestResponse === LatestResponseEnum.NeverAnswered ?
                        <Button component={Link} to={"/questionnaire/" + questionnaire.id + "/answer"} fullWidth variant="contained">Besvar nu</Button> : <></>}
                    {latestResponse === LatestResponseEnum.HasBeenAnsweredToday ?
                        <Button component={Link} to={"/questionnaire/" + questionnaire.id + "/answer"} fullWidth variant="outlined">Besvar igen</Button> : <></>}
                    {latestResponse === LatestResponseEnum.ShouldBeAnsweredToday ?
                        <Button component={Link} to={"/questionnaire/" + questionnaire.id + "/answer"} fullWidth variant="contained">Besvar nu</Button> : <></>}
                    {latestResponse === LatestResponseEnum.ShouldNotBeAnsweredToday ?
                        <Button component={Link} to={"/questionnaire/" + questionnaire.id + "/answer"} fullWidth variant="outlined">Besvar igen</Button> : <></>}
                </CardActions>
            </Card>
        )
    }
}