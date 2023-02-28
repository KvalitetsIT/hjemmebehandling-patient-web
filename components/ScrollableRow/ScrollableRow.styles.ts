import { styled } from "@mui/material/styles";

const DEFAULT_GAP = 1;
const DEFAULT_COLUMNS = 2;
const DEFAULT_SCROLLINDICATOR_WIDTH_PROCENT = 10;

export const Root = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    overflowY: 'hidden',
})

interface ListProps {
    gap?: number
    columns?: number
    numOfItems?: number
}

export const List = styled('ul')<ListProps>(({ gap = DEFAULT_GAP, columns = DEFAULT_COLUMNS, numOfItems = DEFAULT_COLUMNS }) => {
    const scrollIndicatorWidth = numOfItems > columns ? (DEFAULT_SCROLLINDICATOR_WIDTH_PROCENT) : 0
    const gapSubstraction = numOfItems > columns ? (gap / columns * columns) : (gap / columns * (columns - 1));
    return ({
        display: 'grid',
        margin: '0',
        padding: '0',
        gap: `${gap}em`,
        width: '100%',
        gridAutoFlow: 'column',
        // gridTemplateColumns: `repeat(${numOfItems}, calc(${100 / columns - scrollIndicatorWidth}% - ${gap / columns * (columns - 1)}em))`,
        // gridAutoColumns: `calc(${(100 - scrollIndicatorWidth) / columns}% - ${gapSubstraction}em)`,
        gridAutoColumns: `max(10em, calc(${(100 - scrollIndicatorWidth) / columns}% - ${gapSubstraction}em))`,
    })
})

export const Item = styled('li')({
    display: 'flex',
    flexDirection: 'column',
})