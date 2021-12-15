import { Grid } from "@mui/material";
import { Component } from "react";

interface Props {
    jsxList: JSX.Element[]
}

export class ScrollableRow extends Component<Props, {}> {
    render(): JSX.Element {
        const width = (window.innerWidth - 50) + "px";
        return (
            <>
                <Grid container spacing={2} wrap="nowrap" sx={{ maxWidth: width, overflowX: "auto" }}>
                    {this.renderComponent()}
                </Grid>


            </>

        )
    }
    renderComponent(): JSX.Element {
        return (
            <>

                {this.props.jsxList.map(jsx => {
                    return (
                        <>
                            <Grid item>
                                {jsx}
                            </Grid>
                        </>
                    )
                })}

            </>
        )
    }
}