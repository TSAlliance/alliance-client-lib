export interface ApiErrorInfo {
    statusCode?: number;
    isCritical?: boolean;
    details?: Record<string, any>;
}
export class ApiError extends Error {
    public timestamp: Date;
    public message: string;
    public errorId: string;
    public details: Record<string, any> = {};
    public statusCode: number;
    public isCritical: boolean;

    constructor(message: string, errorId: string, info?: ApiErrorInfo) {
        super(message);

        this.timestamp = new Date();
        this.errorId = errorId || "UNKNOWN_ERROR";
        this.message = this.message;
        this.statusCode = info?.statusCode;
        this.isCritical = info?.isCritical;
        this.details = info?.details;
    }

    public putDetail(key: string, value: any): void {
        let details: Record<string, any> = this.details || {};
        details[key] = value;

        this.details["details"] = details;
    }

    public setDetailsList(details: Array<any>): void {
        this.details["details"] = details;
    }

    public setDetailsMap(details: Record<string, any>): void {
        this.details["details"] = details;
    }

    public toResponse(): Record<string, unknown> {
        return {
            statusCode: this.statusCode || 500,
            message: this.isCritical
                ? "An internal server error occured. Please report to administrator"
                : this.message,
            timestamp: this.timestamp,
            errorId: this.errorId,
            details: this.details,
        };
    }
}
