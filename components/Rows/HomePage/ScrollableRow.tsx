import { Component, CSSProperties } from "react";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

interface Props {
    jsxList: JSX.Element[]
    cols : number;
}

export class ScrollableRow extends Component<Props, {}> {
    root: CSSProperties = {
        
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    }

    gridList: CSSProperties = {

        width: "100%",
        flexWrap: 'nowrap'
    }

    gridListTile: CSSProperties = {
        height: 'auto',
        padding: 0,
        paddingRight: 20

    }

    render(): JSX.Element {
        return (
            <>

                {this.renderComponent()}


            </>

        )
    }
    renderComponent(): JSX.Element {
        let key = 0;
        return (
            <>

                <div style={this.root} >
                    <GridList style={this.gridList} cols={this.props.cols}>
                        {this.props.jsxList.map(x => {
                            return (
                                <GridListTile style={this.gridListTile} key={key++}>
                                    {x}
                                </GridListTile>
                            )
                        })}


                    </GridList>
                </div>

            </>
        )
    }
}