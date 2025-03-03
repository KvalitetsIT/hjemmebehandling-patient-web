import { BaseServiceError, DisplaySettings } from "../../components/Errorhandling/BaseServiceError";



export class NoMeasurementTypesFound extends BaseServiceError {
    displayMessage() : string {
        return "Ingen målingstyper fundet";
    }
    displayTitle() : string {
        return "Ingen målingstyper fundet"
    }
    displaySettings(): DisplaySettings {
        const settings = new DisplaySettings();
        settings.displayInLargeDialog = true;
        settings.showLogoutButton = true;
        return settings;
    }
}