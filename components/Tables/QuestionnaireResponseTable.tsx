import React, { Component } from "react";
import { Button, Card, ButtonGroup,Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PatientCareplan } from "../Models/PatientCareplan";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../Models/QuestionnaireResponse";
import ListIsEmptyCard from "../Cards/ListIsEmptyCard"
import ApiContext from "../../pages/_context";
import IQuestionnaireResponseService from "../../services/interfaces/IQuestionnaireResponseService";
import { LoadingBackdropComponent } from "../Layout/LoadingBackdropComponent";
import IDateHelper from "../../globalHelpers/interfaces/IDateHelper";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LoadingButton from '@mui/lab/LoadingButton';


interface Props {
    careplan : PatientCareplan
}
interface State {
    questionnaireResponses : QuestionnaireResponse[]
    fetchingData : boolean;
    page : number;
    pagesize : number;
}
export default class QuestionnaireResponseTable extends Component<Props,State>{
    static contextType = ApiContext
    questionnaireResponseService!: IQuestionnaireResponseService;
    dateHelper!: IDateHelper;
    
    constructor(props : Props){
        super(props)
        this.state = {
            questionnaireResponses : [],
            fetchingData : false,
            page : 1,
            pagesize : 5
        }
    }

    async populateData(page : number) :  Promise<void> {
        try{
            const questionnaireResponses = await this.questionnaireResponseService.GetQuestionnaireResponses(
                this.props.careplan?.id,
                this.props.careplan?.questionnaires?.map(x=>x.id),
                page,
                this.state.pagesize
            )
            this.setState({questionnaireResponses : questionnaireResponses, page : page});
        } catch(error){
            this.setState(()=>{throw error})
        }

    }

    async componentDidMount() : Promise<void>{
        this.setState({fetchingData : true})
        
        await this.populateData(this.state.page)
        this.setState({fetchingData : false})
    }

    initializeServices() : void{
        this.questionnaireResponseService = this.context.questionnaireResponseService;
        this.dateHelper = this.context.dateHelper;
    }

    render() : JSX.Element{
        this.initializeServices();
        return this.state.fetchingData ? <LoadingBackdropComponent/> : this.renderPage();
        
    }

    renderPage() : JSX.Element {
        let hasMorePages = false;
        if(this.state.questionnaireResponses.length === this.state.pagesize)
            hasMorePages = true;

        return (
            <ListIsEmptyCard textWhenEmpty="Ingen besvarelser fundet" list={this.state.questionnaireResponses}>
                <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Spørgeskema</TableCell>
                            <TableCell>Afdeling</TableCell>
                            <TableCell>Besvarelsesdato</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.questionnaireResponses.map( questionnaireResponse => {
                            const questionnaire = this.props.careplan?.questionnaires?.find(x=>x.id === questionnaireResponse.questionnaireId);
                            let questionnaireName = questionnaire?.name
                            if(!questionnaire){
                                questionnaireName = "Ukendt"
                            }
                            return (
                                <TableRow>   
                                    <TableCell>{questionnaireName}</TableCell>
                                    <TableCell>Afdeling</TableCell>
                                    <TableCell>{this.dateHelper.DateToString(questionnaireResponse.answeredTime!)}</TableCell>
                                    <TableCell>{this.GetStatusName(questionnaireResponse.status)}</TableCell>
                                    <TableCell>
                                        <LoadingButton endIcon={<NavigateNextIcon />} variant="text">Se besvarelse</LoadingButton>
                                    </TableCell> 
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
                <ButtonGroup>
                        <Button variant="text" disabled={this.state.page <= 1} onClick={ async () => await this.PreviousPage()}><NavigateBeforeIcon/></Button>
                        <Button variant="text" disabled >{this.state.page}</Button>
                        <Button variant="text" disabled={!hasMorePages} onClick={ async () => await this.NextPage()}><NavigateNextIcon/></Button>
                </ButtonGroup>
            </ListIsEmptyCard>
        )
    }
    async NextPage() :  Promise<void>{
        const currenpage = this.state.page;
        const nextPage =currenpage+1
        await this.populateData(nextPage)
    
        this.forceUpdate()
    }
    
     async PreviousPage() : Promise<void> {
         const currenpage = this.state.page;
         const nextPage = currenpage-1
         await this.populateData(nextPage)
    
        this.forceUpdate()
    }

    GetStatusName(status : QuestionnaireResponseStatus) : string{
        let statusString = "Ukendt";
        switch(status){
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