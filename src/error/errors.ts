import { ApiError } from "./apiError";

export class ClientInternalError extends ApiError {
    constructor() {
        super("Ein interner App-Fehler ist aufgetreten.", "INTERNAL_ERROR", { statusCode: 500 });
    }
}

export class ClientNetworkError extends ApiError {
    constructor() {
        super("Es ist ein Netzwerkfehler aufgetreten. Bitte überprüfe deine Internetverbindung", "NETWORK_ERROR", {
            statusCode: 500,
        });
    }
}
