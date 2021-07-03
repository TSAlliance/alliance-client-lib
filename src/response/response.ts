import { HashMap } from "../util/hashMap";

export interface Response {
    httpStatusCode: number;
    response: HashMap<any>;
}

export const EmptyResponse: Response = {
    httpStatusCode: 200,
    response: {},
};
