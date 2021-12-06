import { Component } from "react";
import { Card, CardContent, Typography } from '@mui/material';

interface Props{
    list : any[];
    textWhenEmpty : string;
}

export default class ListIsEmptyCard extends Component<Props,{}>{
    render() : JSX.Element{
        if(this.props.list.length == 0){
            return (
            <Card>
                <CardContent>
                    <Typography>{this.props.textWhenEmpty}</Typography>
                </CardContent>
            </Card>
            )
        }
        return this.props.children as JSX.Element;
    }
}