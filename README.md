# Alliance Client Library
Javascript library for making development easier and more maintainable for client applications

## Quick start
#### Usage of the AllianceApiService
The `AllianceApiService` provides functionality for very simple api calls, 
like GET, POST, PUT and DELETE for just JSON data transfer.
First you have to create an instance of the class:

```
AllianceApiService.createInstance({
    host: "localhost",
    port: 3333,
    protocol: "http",
    path: "/",                                  // This is optional. Set this if you host the api under a "subdirectory" like /api/
    requestBuilder: new AppRequestBuilder(),
    errorHandler: new AppErrorHandler()
});
```

To this point you have successfully set up the service to connect to your api backend. 
The next step would be to implement the `AllianceRequestBuilder` and the `ErrorHandler`. But we skip
that for now and focus on how to send a get request. <br> Sending a request is done by providing a `AllianceRoute` object, which consists of
properties like `method` (for the HTTP Request Method), `params` (for data to be inserted in paths), `query` (to add query params to the end of the url) and 
the `path` itself. Have a look at the example below:

```
const request = AllianceApiService.getInstance().request<Member>({ // Define the returned type in <>
    method: AllianceRouteMethod.GET,    // Set the Request Method
    params: {                           // Add some params
        id: "123"
    },
    path: "/members/:id"                // Set the path
})

request.perform().then((member) => {
    console.log(member);
})

```
When the request is triggered by calling `perform()`, the url will be built using the previously configured host, port, etc.
The url for this example would look like this: `http://localhost:3333/members/123`. Like you may have noticed, the placeholder for `:id` in the
path property has been replaced by the actual value `123`. When providing a query object to the request, the url could look like this: 
`http://localhost:3333/members/123?filter=abc&sort=DESC`.

<br> <br>
Moving on to implementing the `AllianceRequestBuilder`, we have to keep in mind, that the functionality of this class is to set some default values to 
`axios` requests. Axios is a Javascript library for sending requests. <br> You create an implementation by implementing the interface `AllianceRequestBuilder`.
Please follow the example below:

````
import axios, { AxiosRequestConfig } from "axios";

import { AllianceConfig, AllianceRequestBuilder, AllianceRoute } from "alliance-client-lib/lib/router";
import { ErrorHandler } from "alliance-client-lib/lib/error";
import { InternalError } from "@/error/internalError";

export class AppRequestBuilder implements AllianceRequestBuilder {

    public buildRequestConfig(route: AllianceRoute, config: AxiosRequestConfig, errorHandler: ErrorHandler): AxiosRequestConfig {

        // You could set an authorization header based on wether the route needs authentication or if a user is currently logged in
        if(route.authRequired) {
            if(AuthenticationService.getCurrentMember().accessToken) {
                config.headers["Authorization"] = "Bearer " + AuthenticationService.getCurrentMember().accessToken;
            } else {
                errorHandler.handleError(new InternalError());
            }
        }
        return config;
    }

    public buildAxios(config: AllianceConfig): void {
        // Set the default baseUrl of axios. (You need to import axios firstly)
        axios.defaults.baseURL = config.protocol + "://" + config.host + (config.port != 80 && config.port != 433 ? ":" + config.port : "") + (config.path ? config.path : "");
    }

}
```

<br> <br>
Last but not least we have to create an implementation of the `ErrorHandler` class. Like the `AllianceRequestBuilder` we just have to implement the interface called `ErrorHandler`.
The following code should be straight forward:

```
import { ApiError, ErrorHandler } from "alliance-client-lib/lib/error";
import { AxiosResponse } from "axios";

export class AppErrorHandler implements ErrorHandler {

    public handleError(error: Error): void {
        console.log("handling error...", error);
    }

    public handleErrorResponse(response: AxiosResponse<any>): void {
        const error: ApiError = response.data;        

        // Print error to console
        console.warn("An error [" + error.statusCode + "] occured when calling the api at '" + response.config.baseURL + "': \n\n [" + error.error + "] " + error.message + "\n", error.details || "No details are provided.");
    }

}
```

The `handleError(error: Error)` method is used to handle every error that is not caused by a returned api response (like server-side errors). This method is used for errors
that occured during data processing, whereas `handleErrorResponse(response: AxiosResponse<any>)` is used to handle server-side errors. <br> <br>

