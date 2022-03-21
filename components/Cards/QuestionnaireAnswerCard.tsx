import { Component } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Typography } from '@mui/material';
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Link } from "react-router-dom";
import ApiContext from "../../pages/_context";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import ICareplanService from "../../services/interfaces/ICareplanService";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";

interface Props {
    questionnaire: Questionnaire
    careplan?: PatientCareplan
}

interface State {
    shouldBeAnswered: boolean;
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
            shouldBeAnswered: false
        }
    }

    initialiseServices(): void {
        this.dateHelper = this.context.dateHelper;
        this.careplanService = this.context.careplanService;
        this.questionnaireResponseService = this.context.questionnaireResponseService;
    }

    async shouldBeAnsweredToday(): Promise<boolean> {

        const careplan = this.props.careplan;
        const questionnaire = this.props.questionnaire;

        if (!careplan?.id) {
            return false;
        }

        const shouldBeAnswered: boolean = await this.questionnaireResponseService.QuestionnaireShouldBeAnsweredToday(careplan?.id, questionnaire);
        return shouldBeAnswered;
    }

    async componentDidMount() : Promise<void>{
        this.setState({
            loading: true
        });

        try {
            const shouldBeAnswered = await this.shouldBeAnsweredToday();
            this.setState({
                shouldBeAnswered: shouldBeAnswered
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
        const shouldBeAnsweredToday = this.state.shouldBeAnswered

        return (
            <Card>
                <CardHeader subheader={questionnaire?.name} />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2">
                        Infektionssygdomme har sendt dig dette spørgeskema
                    </Typography>
                    {shouldBeAnsweredToday ?
                        <Typography variant="caption">Besvares i dag, senest kl. {questionnaire?.frequency?.deadline}</Typography> :
                        <Typography variant="caption">Besvares {questionnaire?.frequency?.ToString()}</Typography>
                    }
                </CardContent>
                <CardActions>
                    <Button component={Link} to={"/questionnaire/" + questionnaire.id + "/answer"} fullWidth variant="contained">Besvar nu</Button>
                </CardActions>
            </Card>
        )
    }
}