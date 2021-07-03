import { HashMap } from "../util/hashMap";

export abstract class ApiError extends Error {
    public timestamp: Date;
    public message: string;
    public error: string;
    public details: HashMap<any> = {};
    public statusCode: number;

    constructor(message: string, statusCode: number, errorCode?: string) {
        super(message);

        this.timestamp = new Date();
        this.error = errorCode || "UNKNOWN_ERROR";
        this.message = this.message;
        this.statusCode = statusCode;
    }

    public putDetail(key: string, value: any): void {
        let details: HashMap<any> = this.details || {};
        details[key] = value;

        this.details["details"] = details;
    }

    public setDetailsList(details: Array<any>): void {
        this.details["details"] = details;
    }

    public setDetailsMap(details: HashMap<any>): void {
        this.details["details"] = details;
    }
}
