import {BaseIcon, BaseIconProps} from "@kvalitetsit/hjemmebehandling/icons/BaseIcon"

export function HomeIcon(props?: BaseIconProps): JSX.Element {
    
    props = {
        color: "white"
    }

    return (
        <BaseIcon {...props} src={'/assets/icons/_home.svg'}></BaseIcon>
    );
}

export function SurveyIcon(props?: BaseIconProps): JSX.Element {
    
    props = {
        color: "white"
    }

    return (
        <BaseIcon {...props} src={'/assets/icons/_survey.svg'}></BaseIcon>
    );
}

export function GrapphIcon(props?: BaseIconProps): JSX.Element {
    
    props = {
        color: "white"
    }

    return (
        <BaseIcon {...props} src={'/assets/icons/_graph.svg'}></BaseIcon>
    );
}

export function ContactIcon(props?: BaseIconProps): JSX.Element {
    
    props = {
        color: "white"
    }

    return (
        <BaseIcon {...props} src={'/assets/icons/_contact.svg'}></BaseIcon>
    );
}


export function ProfileIcon(props?: BaseIconProps): JSX.Element {
    
    props = {
        color: "rgb(153,0,51)"
    }

    return (
        <BaseIcon {...props} src={'/assets/icons/_profile.svg'}></BaseIcon>
    );
}