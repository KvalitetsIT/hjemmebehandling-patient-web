import { styled, css } from "@mui/material/styles";

const DEFAULT_GAP = 1;
const DEFAULT_COLUMNS = 2;
const DEFAULT_SCROLLINDICATOR_WIDTH_PROCENT = 0;

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
}

export const List = styled('ul')<ListProps>(({ gap = DEFAULT_GAP, columns = DEFAULT_COLUMNS }) => ({
    display: 'grid',
    margin: '0',
    padding: '0',
    gap: '1em',
    width: '100%',
    gridAutoFlow: 'column',
    gridTemplateColumns: `repeat(2, calc(${100 / columns - DEFAULT_SCROLLINDICATOR_WIDTH_PROCENT}% - ${gap / columns * (columns - 1)}em))`,
    gridAutoColumns: `calc(${100 / columns - DEFAULT_SCROLLINDICATOR_WIDTH_PROCENT}% - ${gap / columns * (columns - 1)}em)`,
}))

export const Item = styled('li')({
    display: 'flex',
    flexDirection: 'column',
})