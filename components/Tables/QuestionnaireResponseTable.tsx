import React, { Component } from "react";
import { Button, Card, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard"
import ApiContext from "../../pages/_context";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";
import IDateHelper from "@kvalitetsit/hjemmebehandling/Helpers/interfaces/IDateHelper";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link } from "react-router-dom";
import { LoadingSmallComponent } from "../Layout/LoadingSmallComponent";


interface Props {
    careplan: PatientCareplan
}
interface State {
    questionnaireResponses: QuestionnaireResponse[]
    fetchingData: boolean;
    page: number;
    pagesize: number;
}
export default class QuestionnaireResponseTable extends Component<Props, State>{
    static contextType = ApiContext
    questionnaireResponseService!: IQuestionnaireResponseService;
    dateHelper!: IDateHelper;

    constructor(props: Props) {
        super(props)
        this.state = {
            questionnaireResponses: [],
            fetchingData: false,
            page: 1,
            pagesize: 5
        }
    }

    async populateData(page: number): Promise<void> {
        try {
            this.setState({ fetchingData: true })
            const questionnaireResponses = await this.questionnaireResponseService.GetQuestionnaireResponses(
                this.props.careplan!.id!,
                this.props.careplan?.questionnaires?.map(x => x.id),
                page,
                this.state.pagesize
            )
            this.setState({ questionnaireResponses: questionnaireResponses, page: page });
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ fetchingData: false })

    }

    async componentDidMount(): Promise<void> {


        await this.populateData(this.state.page)

    }

    initializeServices(): void {
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.dateHelper = this.context.dateHelper;
    }

    render(): JSX.Element {
        this.initializeServices();
        return this.state.fetchingData ? <LoadingSmallComponent /> : this.renderPage();

    }

    renderPage(): JSX.Element {
        let hasMorePages = false;
        if (this.state.questionnaireResponses.length >= this.state.pagesize)
            hasMorePages = true;

        return (
            <>
                <IsEmptyCard jsxWhenEmpty="Ingen besvarelser fundet" list={this.state.questionnaireResponses}>
                    <TableContainer component={Card}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="10%">Spørgeskema</TableCell>
                                    <TableCell width="10%">Afdeling</TableCell>
                                    <TableCell width="10%">Besvarelsesdato</TableCell>
                                    <TableCell width="10%">Status</TableCell>
                                    <TableCell width="10%"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.questionnaireResponses.map(questionnaireResponse => {
                                    const questionnaire = this.props.careplan?.questionnaires?.find(x => x.id === questionnaireResponse.questionnaireId);
                                    let questionnaireName = questionnaire?.name
                                    if (!questionnaire) {
                                        questionnaireName = "Ukendt"
                                    }
                                    return (
                                        <TableRow>
                                            <TableCell>{questionnaireName}</TableCell>
                                            <TableCell>Afdeling</TableCell>
                                            <TableCell>{this.dateHelper.DateToString(questionnaireResponse.answeredTime!)}</TableCell>
                                            <TableCell>{this.GetStatusName(questionnaireResponse.status)}</TableCell>
                                            <TableCell>
                                                <LoadingButton component={Link} to={"/questionnaire/" + questionnaire?.id + "/response/" + questionnaireResponse.id} endIcon={<NavigateNextIcon />} variant="text">Se besvarelse</LoadingButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </IsEmptyCard>
                <ButtonGroup>
                    <Button variant="text" disabled={this.state.page <= 1} onClick={async () => await this.PreviousPage()}><NavigateBeforeIcon /></Button>
                    <Button variant="text" disabled >{this.state.page}</Button>
                    <Button variant="text" disabled={!hasMorePages} onClick={async () => await this.NextPage()}><NavigateNextIcon /></Button>
                </ButtonGroup>
            </>

        )
    }
    async NextPage(): Promise<void> {
        const currenpage = this.state.page;
        const nextPage = currenpage + 1
        await this.populateData(nextPage)

        this.forceUpdate()
    }

    async PreviousPage(): Promise<void> {
        const currenpage = this.state.page;
        const nextPage = currenpage - 1
        await this.populateData(nextPage)

        this.forceUpdate()
    }

    GetStatusName(status: QuestionnaireResponseStatus): string {
        let statusString = "Ukendt";
        switch (status) {
            case QuestionnaireResponseStatus.InProgress:
                statusString = "Sendt";
                break;
            case QuestionnaireResponseStatus.NotAnswered:
                statusString = "Ikke besvaret";
                break;
            case QuestionnaireResponseStatus.NotProcessed:
                statusString = "Sendt";
                break;
            case QuestionnaireResponseStatus.Processed:
                statusString = "Kvitteret";
                break;
        }
        return statusString;
    }

}