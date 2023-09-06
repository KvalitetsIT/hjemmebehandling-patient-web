// import { ImageList, ImageListItem } from "@mui/material";

import { Item, List, Root } from "./ScrollableRow.styles";

interface Props {
    jsxList: JSX.Element[]
    cols : number;
}

const ScrollableRow: React.FC<Props> = ({jsxList, cols}) => {

    return (
        <Root>
            <List columns={cols} numOfItems={jsxList.length}>
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
