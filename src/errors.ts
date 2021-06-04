import { ApiError } from "./error";

export class ClientInternalError extends ApiError {
    constructor() {
        super("Ein interner App-Fehler ist aufgetreten.", 500, "INTERNAL_ERROR");
    }
}

export class ClientNetworkError extends ApiError {
    constructor() {
        super("Es ist ein Netzwerkfehler aufgetreten. Bitte überprüfe deine Internetverbindung", 500, "NETWORK_ERROR");
    }
}
