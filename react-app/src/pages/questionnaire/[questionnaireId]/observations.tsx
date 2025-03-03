import { Grid, Typography } from "@mui/material"
import { Component } from "react"

import { ObservationCard } from "../../../components/Cards/ObservationCard"
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent"

import ICareplanService from "../../../services/interfaces/ICareplanService"
import ApiContext, { IApiContext } from "../../_context"
import IsEmptyCard from "../../../components/Errorhandling/IsEmptyCard"
import { PatientCareplan } from "../../../components/Models/PatientCareplan"

interface State {
    loadingPage: boolean
    careplans?: PatientCareplan[]
}
export default class ObservationPage extends Component<{}, State>{
    static contextType = ApiContext

    careplanService!: ICareplanService;

    constructor(props: {}) {
        super(props);
        this.state = {
            loadingPage: false,
            careplans: undefined
        }
    }

    async componentDidMount(): Promise<void> {
        this.setState({ loadingPage: true })
        try {

            const careplan = await this.careplanService.GetActiveCareplans();
            this.setState({ careplans: careplan })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loadingPage: false })
    }

    initializeServices(): void {
        const api = this.context as IApiContext
        this.careplanService = api.careplanService;
    }
    render(): JSX.Element {
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage()
    }

    renderPage(): JSX.Element {
        return (
            <>
                <Grid item xs={12} className="headline-wrapper">
                    <Typography className="headline">Målinger</Typography>
                </Grid>
                <IsEmptyCard list={this.state.careplans} jsxWhenEmpty="Ingen behandlingsplaner fundet">
                    {
                        this.state.careplans?.map(careplan => (
                            <IsEmptyCard object={this.state.careplans} jsxWhenEmpty="Ingen behandlingsplan fundet">
                                {careplan?.questionnaires.map(questionnaire => {
                                    return (
                                        <ObservationCard careplan={careplan} questionnaire={questionnaire} />
                                    )
                                })}
                            </IsEmptyCard>
                        ))
                    }
                </IsEmptyCard>
            </>
        )
    }
}