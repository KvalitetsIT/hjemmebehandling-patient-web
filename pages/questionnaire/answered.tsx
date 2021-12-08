
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Component } from "react";
import IsEmptyCard from "../../components/Cards/IsEmptyCard";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import QuestionnaireResponseTable from "../../components/Tables/QuestionnaireResponseTable";
import ICareplanService from "../../services/interfaces/ICareplanService";
import ApiContext from "../_context";


interface State{
    loadingPage : boolean;
    careplan : PatientCareplan | undefined;
}

export default class AnsweredPage extends Component<{},State>{
    static contextType = ApiContext
    careplanService! : ICareplanService;

    constructor(props : {}){
        super(props);
        this.state = {
            loadingPage : false,
            careplan : undefined
        }
    }

    initializeServices() : void{
        this.careplanService = this.context.careplanService;
    }

    async componentDidMount() : Promise<void>{

        this.setState({loadingPage : true});

        try{
            const careplan = await this.careplanService.GetActiveCareplan()
            this.setState({careplan : careplan});

        } catch(error){
            this.setState(()=>{throw error});
        }

        this.setState({loadingPage : false});

        
    }

    render() : JSX.Element{
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
    }

    renderPage() : JSX.Element{
        return (
            <IsEmptyCard object={this.state.careplan} jsxWhenEmpty="Ingen behandlingsplan fundet">
                <Grid  component={Box} container>
                    <Grid  item xs={12}>
                        <Typography component={Box} paddingBottom={1} variant="h6">Dine tidligere besvarelser</Typography>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <QuestionnaireResponseTable careplan={this.state.careplan!}/>
                    </Grid>
                </Grid>
            </IsEmptyCard>
        )
    }


}