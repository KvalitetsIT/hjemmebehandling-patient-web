import {BaseIcon, BaseIconProps} from "@kvalitetsit/hjemmebehandling/Icons/BaseIcon"

export function HomeIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_home.svg'}></BaseIcon>
    );
}

export function SurveyIcon(props?: BaseIconProps): JSX.Element {
    
    return (
        <BaseIcon {...props} src={'/assets/icons/_survey.svg'}></BaseIcon>
    );
}

export function GrapphIcon(props?: BaseIconProps): JSX.Element {
    
    return (
        <BaseIcon {...props} src={'/assets/icons/_graph.svg'}></BaseIcon>
    );
}

export function ContactIcon(props?: BaseIconProps): JSX.Element {
    
    return (
        <BaseIcon {...props} src={'/assets/icons/_contact.svg'}></BaseIcon>
    );
}


export function ProfileIcon(props?: BaseIconProps): JSX.Element {
    
    return (
        <BaseIcon {...props} src={'/assets/icons/_profile.svg'}></BaseIcon>
    );
}

export function PhoneIcon(props?: BaseIconProps): JSX.Element {
    

    return (
        <BaseIcon {...props} src={'/assets/icons/_phone.svg'}></BaseIcon>
    );
}

export function CheckmarkIcon(props?: BaseIconProps): JSX.Element {
    
    return (
        <BaseIcon {...props} src={'/assets/icons/_checkmark.svg'}></BaseIcon> 
    );
}
export function MessagesIcon(props?: BaseIconProps): JSX.Element {
    
   
    return (
        <BaseIcon {...props} src={'/assets/icons/_messages.svg'}></BaseIcon> 
    );
}

export function LogoTextlessIcon(props?: BaseIconProps): JSX.Element {
    
   
    return (
        <BaseIcon {...props} src={'/assets/icons/_logo_textless.svg'}></BaseIcon> 
    );
}


export function LogoIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_logo.svg'}></BaseIcon> 
    );
}
