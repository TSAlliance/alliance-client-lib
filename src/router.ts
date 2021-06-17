import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";
import { ApiError, ErrorHandler } from "./error";
import { Pageable } from "./pagination";
import { HashMap } from "./util";

export enum AllianceRouteMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
}

export interface AllianceConfig {
    protocol: string;
    host: string;
    port: number;
    path?: string;
    errorHandler: ErrorHandler;
    requestBuilder: AllianceRequestBuilder;
}

export interface AllianceRoute {
    path: string;
    method: AllianceRouteMethod;
    params?: HashMap<any>;
    query?: HashMap<any>;
    pageable?: Pageable;
    authRequired?: boolean;
    useOptionalAuth?: boolean;
}

export class AllianceRequest<T> {
    private _route: AllianceRoute;
    private _config: AxiosRequestConfig;
    private _data: HashMap<any> = {};
    private _defaults: T;
    private _cancelTokenSource: CancelTokenSource;
    private _allianceConfig: AllianceConfig;

    constructor(route: AllianceRoute, config: AxiosRequestConfig, allianceConfig?: AllianceConfig) {
        this._cancelTokenSource = axios.CancelToken.source();
        this._route = route;
        this._config = config;
        this._allianceConfig = allianceConfig;
    }

    /**
     * Cancel current request
     */
    public cancel(): void {
        this._cancelTokenSource.cancel();
    }

    /**
     * Set request's body data
     * @param data Data to be in the body
     * @returns AllianceRequest
     */
    public body(data: HashMap<any>): AllianceRequest<T> {
        this._data = data;
        return this;
    }

    /**
     * Return default object on failure
     * @param defaults Default values in object if not found
     * @returns AllianceRequest
     */
    public orDefault(defaults: T): AllianceRequest<T> {
        this._defaults = defaults;
        return this;
    }

    /**
     * Perform the request
     * @returns A promise containing the requested type or null
     */
    public async perform(handleErrorInternal: boolean = true): Promise<T> {
        return new Promise((resolve, reject) => {
            let result: T = null;
            let promise: Promise<AxiosResponse<T>>;

            if (this._route.method.toLowerCase() === "get") {
                promise = axios.get(
                    buildFullPath(this._route),
                    this._allianceConfig.requestBuilder.buildRequestConfig(
                        this._route,
                        this._config,
                        this._allianceConfig.errorHandler,
                    ),
                );
            } else if (this._route.method.toLowerCase() === "post") {
                promise = axios.post(
                    buildFullPath(this._route),
                    this._data,
                    this._allianceConfig.requestBuilder.buildRequestConfig(
                        this._route,
                        this._config,
                        this._allianceConfig.errorHandler,
                    ),
                );
            } else if (this._route.method.toLowerCase() === "put") {
                promise = axios.put(
                    buildFullPath(this._route),
                    this._data,
                    this._allianceConfig.requestBuilder.buildRequestConfig(
                        this._route,
                        this._config,
                        this._allianceConfig.errorHandler,
                    ),
                );
            } else if (this._route.method.toLowerCase() === "delete") {
                promise = axios.delete(
                    buildFullPath(this._route),
                    this._allianceConfig.requestBuilder.buildRequestConfig(
                        this._route,
                        this._config,
                        this._allianceConfig.errorHandler,
                    ),
                );
            }

            promise
                .then((value: AxiosResponse<any>) => {
                    if (value.status != 200) {
                        const response: AxiosResponse<ApiError> = value;

                        if (handleErrorInternal) {
                            this._allianceConfig.errorHandler.handleErrorResponse(response);
                        } else {
                            reject(response.data as ApiError);
                        }

                        // Return default values if set
                        if (this._defaults) {
                            result = this._defaults;
                        }
                    } else {
                        result = value.data;
                    }

                    resolve(result);
                })
                .catch((reason) => {
                    if (reason.response) {
                        const response: AxiosResponse<ApiError> = reason.response;

                        if (handleErrorInternal) {
                            this._allianceConfig.errorHandler.handleErrorResponse(response);
                        } else {
                            reject(response.data);
                        }
                    } else {
                        if (handleErrorInternal) {
                            this._allianceConfig.errorHandler.handleError(reason);
                        } else {
                            reject(reason);
                        }
                    }

                    // Return default values if set
                    if (this._defaults) {
                        result = this._defaults;
                    }

                    resolve(result);
                });
        });
    }
}

export class AllianceApiService {
    private static _instance: AllianceApiService;
    private _allianceConfig: AllianceConfig;

    constructor(config: AllianceConfig) {
        this._allianceConfig = config;
    }

    /**
     * Create new request instance
     * @param route Route to request
     * @param requestConfig AxiosRequestConfig
     * @returns Instance of AllianceRequest
     */
    public request<T>(route: AllianceRoute, requestConfig?: AxiosRequestConfig): AllianceRequest<T> {
        return new AllianceRequest(route, requestConfig || {}, this._allianceConfig);
    }

    /**
     * Create new instance of AllianceApiService
     * @param config Configuration of base url
     * @returns Instance of AllianceApiService
     */
    public static createInstance(config: AllianceConfig): AllianceApiService {
        this._instance = new AllianceApiService(config);
        this._instance._allianceConfig.requestBuilder.buildAxios(config);
        return this._instance;
    }

    /**
     * Get the active instance of AllianceApiService
     * @returns Instance of AllianceApiService
     */
    public static getInstance(): AllianceApiService {
        return this._instance;
    }
}

export interface AllianceRequestBuilder {
    /**
     * Add default headers to request like Authorization if required by route
     * @param route Route to build config for
     * @param config Config that should be modified
     * @param errorHandler Handle errors
     * @returns AxiosRequestConfig
     */
    buildRequestConfig(
        route: AllianceRoute,
        config: AxiosRequestConfig,
        errorHandler: ErrorHandler,
    ): AxiosRequestConfig;

    /**
     * Setup axios with default values for requests
     * @param config Instance of AllianceConfig
     */
    buildAxios(config: AllianceConfig): void;
}

/**
 * Insert query and params into the given path
 * @param path Path with parameters (e.g.: /example/:id)
 * @param query Query parameters
 * @param params Parameters list of path
 * @param errorHandler Handle errors
 * @returns Path as string
 */
function buildFullPath(route: AllianceRoute): string {
    let path = route.path;

    const query = {
        ...route.query,
        ...route.pageable,
    };

    path +=
        "?" +
        Object.keys(query)
            .map((key) => key + "=" + query[key])
            .join("&");

    if (route.params) {
        for (const key in route.params) {
            path = path.replace(":" + key, route.params[key]);
        }
    }

    return path;
}
