import { Card, CardHeader, Divider, CardContent, Typography, CardActions } from "@mui/material"
import { PhoneIcon } from "../icons/Icons"
import Department from "../../components/Models/DetailedOrganization";

import DOMPurify from "dompurify";


export const ContactCard = (props: { department: Department }) => {

    const { department } = props

    return (
        <Card sx={{ marginTop: 3 }}>
            <CardHeader subheader={department.name}></CardHeader>
            <Divider />
            <CardContent>
                {/* 
                <Typography>Aarhus Universitetshospital</Typography>
                <Typography>Palle Juul-Jensen Boulevard 99, Indgang E eller D3</Typography>
                <Typography>Krydspunkt: Infektionsklinikken E202 eller sengeafsnittet E201</Typography>
                <Typography>8200 Aarhus N</Typography>

                <br />
                <Typography sx={{ fontWeight: 'bold' }}>Infektionsklinikken</Typography>
                <Typography>Infektionsklinikken kan kontaktes telefonisk på {department.phoneNumber} hverdage i nedenstående tidsrum</Typography>
                <br />
                <Typography sx={{ fontWeight: 'bold' }}>Sekretær</Typography>
                <Typography>Alle hverdage <span>kl. 9.00-12.00</span></Typography>
                <br />
                <Typography sx={{ fontWeight: 'bold' }}>Sygeplejerske</Typography>
                <Typography>Mandag <span>kl. 8.15-9.00 og 13.00-14.30</span></Typography>
                <Typography>Tirsdag <span>kl. 8.15-9.00 og 13.00-14.30</span></Typography>
                <Typography>Onsdag <span>kl. 8.15-9.00</span></Typography>
                <Typography>Torsdag <span>kl. 8.15-9.00 og 13.00-14.30</span></Typography>
                <Typography>Fredag <span>kl. 8.15-9.00 og 13.00-14.00</span> </Typography>
                <br />
                <Typography sx={{ fontWeight: 'bold' }}>Sengeafsnittet</Typography>
                <Typography>Ved behov for hjælp uden for ovenstående tidspunkter, ring på telefon 24 77 78 80 (hele døgnet)</Typography>
                */}

                { department.html ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(department.html) }} /> : <Typography>Ingen detaljer fundet</Typography> }
            </CardContent>
            <Divider />
            <CardActions className="call-hospital-wrapper">
                <PhoneIcon></PhoneIcon>
                <Typography className="call-hospital" sx={{ textAlign: 'right' }}>{department.phoneNumber}</Typography>
            </CardActions>
        </Card>

    )
}