import { Grid, Typography } from "@material-ui/core";
import { Box } from "@mui/system";
import React, { Component } from "react";
import { PatientCareplan } from "../../../components/Models/PatientCareplan";
import QuestionnaireResponseTable from "../../../components/Tables/QuestionnaireResponseTable";
import ApiContext from "../../_context";

interface Props {
    careplan : PatientCareplan
}

interface State{
    loadingPage : boolean;
}

export default class AnsweredPage extends Component<Props,State>{
    static contextType = ApiContext

    constructor(props : Props){
        super(props);
        this.state = {
            loadingPage : true
        }
    }

    render() : JSX.Element{
        return (
            <Grid  container>
                <Grid  item xs={12}>
                    <Typography component={Box} paddingLeft={2} paddingTop={3} variant="h6">Dine tidligere besvarelser</Typography>
                    
                </Grid>
                <Grid item xs={12}>
                    <QuestionnaireResponseTable careplan={this.props.careplan}/>
                </Grid>
            </Grid>
        )
    }


}