import { ApiError } from "./apiError";

export class InternalError extends ApiError {
    constructor() {
        super("Ein interner Server-Fehler ist aufgetreten.", "INTERNAL_ERROR", { 
            statusCode: 500,
            isCritical: true 
        });
    }
}

export class NetworkError extends ApiError {
    constructor() {
        super("Es ist ein Netzwerkfehler aufgetreten. Bitte überprüfe deine Internetverbindung", "NETWORK_ERROR", {
            statusCode: 500,
            isCritical: true
        });
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor() {
        super("Der Service ist derzeit nicht erreichbar", "SERVICE_UNAVAILABLE", {
            statusCode: 500,
            isCritical: true
        });
    }
}
