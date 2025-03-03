import { BaseServiceError, DisplaySettings } from "../Errorhandling/BaseServiceError";
import { CallToActionMessage } from "../Models/CallToActionMessage";



export class CallToActionError extends BaseServiceError {
    message: string;
    onClose: () => void;
    constructor(callToAction: CallToActionMessage, onClose: () => void) {
        super();
        this.onClose = onClose
        this.message = callToAction.message!
    }

    displayMessage(): string {
        return this.message;
    }
    displayTitle(): string {
        return "Din besvarelse betyder, at du skal reagere";
    }
    displayUrl(): string {
        return "";
    }
    displaySettings(): DisplaySettings {
        const toReturn = new DisplaySettings();
        toReturn.displayInLargeDialog = true;
        toReturn.showCloseButton = true;
        toReturn.showRefreshButton = false;
        toReturn.whenClosed = this.onClose
        return toReturn;
    }
}