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

export function AboutIcon(props?: BaseIconProps): JSX.Element {
    return (
        <BaseIcon {...props} src={'/assets/icons/_about.svg'}></BaseIcon>
    );
}

export function AboutManufacturerIcon(props?: BaseIconProps): JSX.Element {
    const src = '/assets/icons/_aboutManufacturer.svg';
    const size = '4em';

    return (
        <div style={{
            backgroundColor: props?.color ?? "black",
            WebkitMask: `url(${src}) no-repeat center`,
            mask: `url(${src}) no-repeat center`,
            height: size,
            width: size,
            marginTop: '-10px',
            marginLeft: '-10px',
            marginRight: '15px',    
        }}></div>
    );
    
}

export function AboutUserGuideIcon(props?: BaseIconProps): JSX.Element {
    const src ='/assets/icons/_aboutUserGuide.svg';
    const size = '4em';
    
    return (
        <div style={{
            backgroundColor: props?.color ?? "black",
            WebkitMask: `url(${src}) no-repeat center`,
            mask: `url(${src}) no-repeat center`,
            height: size,
            width: size,
            marginTop: '-10px',
            marginLeft: '-10px',
            marginRight: '15px',    
        }}></div>
    );
}

export function AboutMedicalDeviceIcon(props?: BaseIconProps): JSX.Element {
    const src = '/assets/icons/_aboutMedicalDevice.svg';
    const size = '4em';

    return (
        <div style={{
            backgroundColor: props?.color ?? "black",
            WebkitMask: `url(${src}) no-repeat center`,
            mask: `url(${src}) no-repeat center`,
            height: size,
            width: size,
            marginTop: '-10px',
            marginLeft: '-10px',
            marginRight: '15px',    
        }}></div>
    );
}

export function AboutWarningsIcon(props?: BaseIconProps): JSX.Element {
    const src = '/assets/icons/_aboutWarnings.svg';
    const size = '4em';
    
    return (
        <div style={{
            backgroundColor: props?.color ?? "black",
            WebkitMask: `url(${src}) no-repeat center`,
            mask: `url(${src}) no-repeat center`,
            height: size,
            width: size,
            marginTop: '-10px',
            marginLeft: '-10px',
            marginRight: '15px',
        }}></div>
    );
}