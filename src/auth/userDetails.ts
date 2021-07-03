import { ApiError } from "../error/apiError";
import { HashMap } from "../util/hashMap";

export interface UserDetails {
    uuid: string;
    isAuthenticated: boolean;
    authenticationError?: ApiError;
    roleId: string;

    hasPermission(permission?: string): boolean;
    getHierarchy(): number;
}

export interface ResolvedUserId {
    value: string;
    additionalData: HashMap<any>;
}
