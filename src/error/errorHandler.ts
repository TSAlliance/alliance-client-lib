import { AxiosResponse } from "axios";
import { ApiError } from "./apiError";

export interface ErrorHandler {
    handleError(error: ApiError): void;
    handleErrorResponse(response: AxiosResponse<any>): void;
}
