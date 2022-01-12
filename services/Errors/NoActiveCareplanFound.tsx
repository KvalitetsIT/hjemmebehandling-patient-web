import { BaseServiceError, DisplaySettings } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";


export class NoActiveCareplanFound extends BaseServiceError {
    displayMessage() {
        return "Ingen aktiv behandlingsplan blev fundet for brugeren";
    }
    displayTitle(){
        return "Ingen aktiv behandlingsplan"
    }
    displaySettings(): DisplaySettings {
        const settings = new DisplaySettings();
        settings.displayInLargeDialog = true;
        settings.showLogoutButton = true;
        return settings;
    }
}