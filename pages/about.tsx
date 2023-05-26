import { Card, CardHeader, CardContent, Stack, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Link } from "@mui/material"
import { Component } from "react"

import { AboutManufacturerIcon, AboutUserGuideIcon, AboutMedicalDeviceIcon, AboutWarningsIcon } from '../components/icons/Icons';

export default class AboutPage extends Component<{}> {
    render() : JSX.Element{
        window.onbeforeunload = function () {
            return null; //Vi behøver ikke at give en warning fra aboutsiden
          };
        return (
            <>
                <Typography className="headline" sx={{ mt: 2, mb: 2 }}>Om KOMO</Typography>

                <Card >
                    <CardHeader subheader={"Infektionssygdomme"} sx={{ pl: 3 }}/>
                    <Divider />
                    <CardContent>
                        <Stack spacing={3}>
                            <Stack sx={{ pl: 1 }}>
                                <Typography >
                                    KOMO står for Kommunikation og Monitorering, og er en telemedicinsk softwareløsning til monitorering af patienter i eget hjem.  
                                </Typography>
                                <Typography >
                                    Løsningen består af en kliniker- og en patientrettet klient (webbaseret for kliniker og android app på tablet for patient).
                                </Typography>
                            </Stack>

                            <List>
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon>
                                        <AboutMedicalDeviceIcon size="65px"/>
                                    </ListItemIcon>
                                    <ListItemText disableTypography
                                        primary={<Typography className="headline" color={'inherit'}>Medicinsk udstyr</Typography>}
                                        secondary={<Typography>Versionsnummer på software: 2.0.0-2023-03-29</Typography>}
                                    />
                                </ListItem>

                                <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                    <AboutUserGuideIcon size="65px" />
                                </ListItemIcon>
                                <ListItemText disableTypography
                                    primary={<Typography className="headline" color={'inherit'}>Brugervejledning</Typography>}
                                    secondary={
                                        <List dense sx = {{listStyleType: 'disc', pl: 3, '& .MuiListItem-root': {display: 'list-item', mt: -1 },}}>
                                            <ListItem disableGutters>
                                                <Link fontSize={'0.875rem'} href="https://www.auh.dk/globalassets/allepatientinformationer/auh/afdelinger/infektionssygdomme/komo/komo_brugermanualer_patient_version2.0.pdf" color="inherit">Link til guide</Link>
                                            </ListItem>
                                            <ListItem disableGutters>
                                            <Link fontSize={'0.875rem'} href="https://www.auh.dk/globalassets/allepatientinformationer/auh/afdelinger/infektionssygdomme/komo/komo_brugermanualer_patientkvik_version2.0.pdf" color="inherit">Link til kvikguide</Link>
                                            </ListItem>
                                        </List>
                                    }
                                />
                            </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon>
                                        <AboutWarningsIcon />
                                    </ListItemIcon>
                                    <ListItemText disableTypography
                                        primary={<Typography className="headline" color={'inherit'}>Advarsler og begrænsninger</Typography>}
                                        secondary={
                                            <List dense sx = {{listStyleType: 'disc', pl: 3, '& .MuiListItem-root': {display: 'list-item', mt: -1 },}}>
                                                <ListItem disableGutters>
                                                    <Typography>Indtast aldrig ukorrekte oplysninger.</Typography>
                                                </ListItem>
                                                <ListItem disableGutters>
                                                    <Typography>KOMO må aldrig anvendes til kritiske patienter.</Typography>
                                                </ListItem>
                                                <ListItem disableGutters>
                                                    <Typography>Patienter kan ikke foretage målinger med KOMO. Målinger (som fx CRP, temperatur og andet), skal foretages med eksternt udstyr, som patienten skal læres op i af klinisk personale.</Typography>
                                                </ListItem>
                                                <ListItem disableGutters>
                                                    <Typography>Det er klinikkens ansvar at følge op på patienter, der er oprettet i KOMO til hjemmebehandling, samt at udarbejde arbejdsgange omkring dette. </Typography>
                                                </ListItem>
                                                <ListItem disableGutters>
                                                    <Typography>Det er ligeledes klinikkens ansvar at udarbejde arbejdsgange for kvalitetssikring af spørgeskemaer og patientgrupper.</Typography>
                                                </ListItem>
                                                <ListItem disableGutters>
                                                    <Typography>Enhver fejl eller uhensigtsmæssighed, der er indtruffet i forbindelse med den medicinske software, skal indberettes til afdelingen.</Typography>
                                                </ListItem>
                                            </List>
                                        }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon>
                                        <AboutManufacturerIcon />
                                    </ListItemIcon>
                                    <ListItemText MuiListItemText-multiline disableTypography
                                        primary={<Typography className="headline" color={'inherit'}>Fabrikant</Typography>}
                                        secondary={
                                            <Typography>Center for Telemedicin, Region Midtjylland, Olof Palmes Allé 36, 8200 Aarhus N</Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                    <CardHeader subheader={"Support"} sx={{ pl: 3 }}/>
                    <Divider />
                    <CardContent>
                        <Stack direction="row">
                            <Typography>Oplever du fejl, så</Typography>
                            <Typography>&nbsp;</Typography>
                            <Link fontSize={'0.875rem'} href="/contact" color="inherit">kontakt hospitalet.</Link> 
                        </Stack>
                    </CardContent>
                </Card>
            </>
        )
    }
}