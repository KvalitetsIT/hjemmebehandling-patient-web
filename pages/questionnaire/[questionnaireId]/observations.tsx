import { Typography } from "@mui/material"
import { Component } from "react"
import IsEmptyCard from "../../../components/Cards/IsEmptyCard"
import { ObservationCard } from "../../../components/Cards/ObservationCard"
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent"
import { PatientCareplan } from "../../../components/Models/PatientCareplan"
import ICareplanService from "../../../services/interfaces/ICareplanService"
import ApiContext from "../../_context"

interface State {
    loadingPage: boolean
    careplan?: PatientCareplan
}
export default class ObservationPage extends Component<{}, State>{
    static contextType = ApiContext
    careplanService!: ICareplanService;

    constructor(props: {}) {
        super(props);
        this.state = {
            loadingPage: false,
            careplan: undefined
        }
    }

    async componentDidMount(): Promise<void> {
        this.setState({ loadingPage: true })
        try {

            const careplan = await this.careplanService.GetActiveCareplan();
            this.setState({ careplan: careplan })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loadingPage: false })
    }

    initializeServices(): void {
        this.careplanService = this.context.careplanService;
    }
    render(): JSX.Element {
        this.initializeServices();
        return this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage()
    }

    renderPage(): JSX.Element {
        return (
            <>
                <Typography>Målinger</Typography>
                <IsEmptyCard object={this.state.careplan} jsxWhenEmpty="Ingen behandlingsplan fundet">
                    {this.state.careplan?.questionnaires.map(questionnaire => {
                        return (
                            <ObservationCard careplan={this.state.careplan!} questionnaire={questionnaire} />
                        )

                    })}
                </IsEmptyCard>
            </>
        )
    }
}