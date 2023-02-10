// import { ImageList, ImageListItem } from "@mui/material";

import { Item, List, Root } from "./ScrollableRow.styles";

interface Props {
    jsxList: JSX.Element[]
    cols : number;
}

const ScrollableRow: React.FC<Props> = ({jsxList, cols}) => {

    return (
        <Root>
            <List columns={cols}>
                {jsxList.map(x => (
                    <Item key={x.key}>
                        {x}
                    </Item>
                ))}
            </List>
        </Root>
    )
}

export default ScrollableRow

// export default class ScrollableRow extends Component<Props, {}> {
//     root: CSSProperties = {
        
//         display: 'flex',
//         flexWrap: 'wrap',
//         justifyContent: 'space-around',
//         overflow: 'hidden',
//     }

//     gridList: CSSProperties = {

//         width: "100%",
//         flexWrap: 'nowrap'
//     }

//     gridListTile: CSSProperties = {
//         height: 'auto',
//         padding: 0,
//         paddingRight: 20,
//         display: 'flex',
//         flexDirection: 'column',
//     }

//     render(): JSX.Element {
//         return (
//             <>

//                 {this.renderComponent()}


//             </>

//         )
//     }
//     renderComponent(): JSX.Element {
//         let key = 0;
//         return (
//             <>

//                 <div style={this.root} >
//                     <ImageList style={this.gridList} cols={this.props.cols}>
//                         {this.props.jsxList.map(x => {
//                             return (
//                                 <ImageListItem style={this.gridListTile} key={key++}>
//                                     {x}
//                                 </ImageListItem>
//                             )
//                         })}


//                     </ImageList>
//                 </div>

//             </>
//         )
//     }
// }