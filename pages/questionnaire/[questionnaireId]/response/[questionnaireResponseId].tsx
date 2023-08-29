import React, { Component } from "react";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { QuestionnaireResponse } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import ApiContext from "../../../_context";
import ResponseStatusCard from "../../../../components/Cards/ResponseStatusCard"
import IQuestionnaireResponseService from "../../../../services/interfaces/IQuestionnaireResponseService";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { LoadingBackdropComponent } from "../../../../components/Layout/LoadingBackdropComponent";
import ICareplanService from "../../../../services/interfaces/ICareplanService";
import { Grid, Typography, Card, Box } from "@mui/material";
import QuestionAndAnswerTable from "../../../../components/Tables/QuestionAndAnswerTable";

interface Props {
    match: { params: { questionnaireId: string, questionnaireResponseId: string } };
}

interface State {
    loadingPage: boolean;
    careplan: PatientCareplan | undefined;
    questionnaireResponse: QuestionnaireResponse | undefined;
}

export default class QuestionnaireResponseDetailsPage extends Component<Props, State>{
    static contextType = ApiContext
    declare context: React.ContextType<typeof ApiContext>
    questionnaireResponseService!: IQuestionnaireResponseService;
    careplanService!: ICareplanService;

    constructor(props: Props) {
        super(props);
        this.state = {
            loadingPage: true,
            questionnaireResponse: undefined,
            careplan: undefined
        }
    }

    initializeServices(): void {
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.careplanService = this.context.careplanService;
    }

    async componentDidMount(): Promise<void> {
        try {
            this.setState({ loadingPage: true })
            const response = await this.questionnaireResponseService.GetQuestionnaireResponse(this.props.match.params.questionnaireResponseId);
            const careplan = await this.careplanService.GetActiveCareplan();
            this.setState({ questionnaireResponse: response, careplan: careplan, loadingPage: false })
        } catch (error) {
            this.setState(() => { throw error })
        }
    }

    render(): JSX.Element {
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    renderPage(): JSX.Element {
        return (
            <IsEmptyCard object={this.state.careplan} jsxWhenEmpty="Ingen behandlingsplan fundet">
                <IsEmptyCard object={this.state.questionnaireResponse} jsxWhenEmpty="Ingen besvarelse fundet">
                    <IsEmptyCard object={this.state.questionnaireResponse?.questions} jsxWhenEmpty="Ingen spørgsmål på besvarelse">
                        <Grid component={Box} spacing={3} container>
                            <Grid item xs={12}>
                                <Card>
                                    <Box display="flex" p={2} alignItems="center" gap={2}>
                                        <Box display="flex" alignItems="center" justifyContent="center" borderRadius="50%" height="2rem" sx={{ backgroundColor: "rgb(153,0,51)", aspectRatio: "1 / 1" }}>
                                            <Typography color="white" fontSize="1.25rem">i</Typography>
                                        </Box>
                                        <Typography>Denne besvarelse er indsendt og kan derfor ikke rettes. Er der fejl i din besvarelse, skal du indsende en ny.</Typography>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <ResponseStatusCard careplan={this.state.careplan!} questionnaireResponse={this.state.questionnaireResponse!} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className="headline">Besvarelse</Typography>
                                <QuestionAndAnswerTable questionAnswerMap={this.state.questionnaireResponse!.questions!} />
                            </Grid>
                        </Grid>
                    </IsEmptyCard>
                </IsEmptyCard>
            </IsEmptyCard>
        )
    }


}