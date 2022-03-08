import ChartData from "@kvalitetsit/hjemmebehandling/Charts/ChartData";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React from "react";
import { Component, ReactNode } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export enum DisplayModeEnum {
    GRAPH = "Graf",
    TABLE = "Tabel"
}


export interface Props {
    chartData: ChartData
    showThresholds: boolean
    cardAction?: JSX.Element
}
export interface State {
    displayType: DisplayModeEnum
}

export default class LatestResponseCard extends Component<Props, State> {
    static defaultProps = {
        showThresholds: true,
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            displayType: DisplayModeEnum.GRAPH
        }
    }


    render(): ReactNode {
        const chartData = this.props.chartData;
        const answerData = chartData.answerData

        const latestData = answerData.pop();
        const secondLatestData = answerData.pop();

        let status = "Værdier er stabile"
        if (latestData != undefined && secondLatestData != undefined) {
            if (latestData > secondLatestData)
                status = "Værdier er stigende"
            if (latestData < secondLatestData)
                status = "Værdier er faldende"
        }

        return (
            <Card >
                <CardHeader subheader={chartData.label} />
                <Divider />
                <CardContent sx={{ textAlign: "center" }}>
                    <Typography>Seneste værdi</Typography>
                    <Typography variant="h2">{latestData}</Typography>
                    <Typography>{status}</Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ float: "right" }}>
                    <Button endIcon={<NavigateNextIcon />} variant="text">Se graf</Button>
                </CardActions>
            </Card>
        )
    }
}