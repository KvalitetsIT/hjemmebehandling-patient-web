import React, { Component } from "react";
import { Button, ButtonGroup, Table as MuiTable, TableBody, TableCell as MuiTableCell, TableContainer, TableHead as MuiTableHead, TableRow as MuiTableRow, Stack, Typography, styled } from '@mui/material';



import ApiContext, { IApiContext } from "../../pages/_context";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link } from "react-router-dom";
import { LoadingSmallComponent } from "../Layout/LoadingSmallComponent";
import { CheckmarkIcon, MessagesIcon } from "../icons/Icons";
import IsEmptyCard from "../Errorhandling/IsEmptyCard";
import IDateHelper from "../Helpers/interfaces/IDateHelper";
import { PatientCareplan } from "../Models/PatientCareplan";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../Models/QuestionnaireResponse";

const Table = styled(MuiTable)(() => ({
    borderCollapse: 'separate',
    borderSpacing: '0 0.4em',
}));

const TableCell = styled(MuiTableCell)(({ theme }) => ({
    '&:first-child': {
        paddingLeft: theme.spacing(3),
    },
    '&:last-child': {
        paddingRight: theme.spacing(3),
    },
    borderWidth: 0
}));

const TableRow = styled(MuiTableRow)(() => ({
    position: 'relative',
    overflow: 'hidden',
}));

const TableHead = styled(MuiTableHead)(() => ({}));

const Bar = styled('div')(() => ({
    background: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
}));

interface Props {
    careplans: PatientCareplan[]
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


    async getQuestionnaireResponses(page: number): Promise<QuestionnaireResponse[]> {
        let { careplans } = this.props;

        const carePlanIds = careplans.map(careplan => careplan.id).filter((id: string | undefined): id is string => !!id )
        const questionnaireIds = careplans.flatMap(careplan => careplan.questionnaires).map(x => x.id)

        let questionnaireResponses: QuestionnaireResponse[] = await this.questionnaireResponseService.GetQuestionnaireResponsesForMultipleCareplans(
            carePlanIds,
            questionnaireIds,
            page,
            this.state.pagesize
        )
        return questionnaireResponses
    }


    async populateData(page: number): Promise<void> {
        try {
            this.setState({ fetchingData: true })

            // The refactor for this is a little tricky since we are requesting the questionnaireResponses for every careplan
            let questionnaireResponses: QuestionnaireResponse[] = await this.getQuestionnaireResponses(page);
            console.log("populateData", questionnaireResponses)
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
        const api = this.context as IApiContext

        this.questionnaireResponseService = api.questionnaireResponseService;
        this.dateHelper = api.dateHelper;
    }

    render(): JSX.Element {
        this.initializeServices();
        return this.state.fetchingData ? <LoadingSmallComponent /> : this.renderPage();

    }

    renderPage(): JSX.Element {
        let hasMorePages = false;
        if (this.state.questionnaireResponses.length >= this.state.pagesize)
            hasMorePages = true;


        const allQuestionnaires = this.props.careplans?.flatMap(careplan => careplan.questionnaires)

        return (
            <>
                <IsEmptyCard jsxWhenEmpty="Ingen besvarelser fundet" list={this.state.questionnaireResponses}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="25%" sx={{padding: 0}}>Spørgeskema</TableCell>
                                    <TableCell width="25%" sx={{padding: 0}}>Besvarelsesdato</TableCell>
                                    <TableCell width="20%" sx={{padding: 0}}>Status</TableCell>
                                    <TableCell width="30%" sx={{padding: 0}}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.questionnaireResponses.map(questionnaireResponse => {
                                    const questionnaire = allQuestionnaires.find(x => x.id === questionnaireResponse.questionnaireId)!;
                                    const careplan = this.props.careplans.find(x => x.questionnaires.find(q => q.id == questionnaire.id))!
                                        let questionnaireName = questionnaire?.name
                                    if (!questionnaire) {
                                        questionnaireName = "Ukendt"
                                    }
                                    return (
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                    <Stack>
                                                        <Typography> {questionnaireName}</Typography>
                                                        <Typography variant="caption">{careplan.organization?.name}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{this.dateHelper.DateToString(questionnaireResponse.answeredTime!)}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} className="questionnaireStatus">
                                                        <Typography>{this.GetStatusRepresentation(questionnaireResponse.status)}</Typography>
                                                        <Typography>{this.GetStatusText(questionnaireResponse.status)}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <LoadingButton component={Link} to={"/questionnaire/" + questionnaire?.id + "/response/" + questionnaireResponse.id} endIcon={<NavigateNextIcon />} variant="text">Se mine svar</LoadingButton>
                                                </TableCell>
                                                <Bar />
                                            </TableRow>
                                        </>
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

    GetStatusText(status: QuestionnaireResponseStatus): string {
        let statusString: string = "Ukendt";

        switch (status) {
            case QuestionnaireResponseStatus.InProgress:
                statusString = "Sendt (afventer)";
                break;
            case QuestionnaireResponseStatus.NotAnswered:
                statusString = "Ikke besvaret";
                break;
            case QuestionnaireResponseStatus.NotProcessed:
                statusString = "Sendt (afventer)";
                break;
            case QuestionnaireResponseStatus.Processed:
                statusString = "Kvitteret"
                break;
        }
        return statusString;
    }

    GetStatusRepresentation(status: QuestionnaireResponseStatus): JSX.Element {
        let representation: JSX.Element = <></>;

        const size = "1.2rem"

        const messageIcon = <MessagesIcon size={size}></MessagesIcon>
        const checkMarkIcon = <CheckmarkIcon size={size}></CheckmarkIcon>
        switch (status) {
            case QuestionnaireResponseStatus.InProgress:
                representation = messageIcon
                break;
            case QuestionnaireResponseStatus.NotAnswered:
                representation = messageIcon
                break;
            case QuestionnaireResponseStatus.NotProcessed:
                representation = messageIcon
                break;
            case QuestionnaireResponseStatus.Processed:
                representation = checkMarkIcon
                break;
        }
        return representation;
    }


}