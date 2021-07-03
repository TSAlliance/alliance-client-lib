import { ResolvedUserId, UserDetails } from "./userDetails";

export abstract class UserDetailsService {
    /**
     * Load user details based on the id. The additional token data is optional
     * @param resolvedUserId User's resolved id data
     * @returns Promise of type UserDetails
     */
    public abstract loadUserDetails(resolvedUserId: ResolvedUserId): Promise<UserDetails>;

    /**
     * Read users id from authorization info provided by the requester
     * @param request Express' request instance
     * @returns Instance of ResolvedUserId
     */
    public abstract resolveUserIdFromRequest(request: any): ResolvedUserId;

    /**
     * Check if some kind of authorization info is provided by the requester.
     * @param request Express' request instance
     * @returns True or False
     */
    public abstract isAuthorizationPresent(request: any): boolean;
}
