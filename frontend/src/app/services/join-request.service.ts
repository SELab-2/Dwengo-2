import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { environment } from "../../environments/environment";
import { forkJoin, map, Observable, switchMap } from "rxjs";
import { User } from "../interfaces";
import { JoinRequestWithUser } from "../interfaces/join-requests/joinRequestWithUser";
import { JoinRequestResponse } from "../interfaces/join-requests/joinRequestResponse";
import { NewJoinRequest } from "../interfaces/join-requests/newJoinRequest";
import { JoinRequestsResponse } from "../interfaces/join-requests/joinRequestsResponse";

@Injectable({
    providedIn: 'root'
})
export class JoinRequestService {

    private API_URL = environment.API_URL;

    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
    ) {}

    /**
     * Given a list of join request responses, this method will fill the user information for each request.
     * @param requests List of join requests
     * @returns Observable of join requests with user information filled in
     */
    public fillUsers(requests: JoinRequestResponse[]): Observable<JoinRequestWithUser[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return forkJoin(
            // Per join request: GET the user with it's id
            requests.map(request =>
                this.http.get<User>(
                    `${this.API_URL}/users/${request.requester}`, {
                        ...headers,
                        params: {
                            userType: request.type
                        }
                    }
                ).pipe(
                    this.errorService.pipeHandler(),
                    // Then map the user to the request
                    map(user => {return {
                        id: request.id,
                        requester: user,
                        classId: request.classId,
                        userType: request.type
                    }})
                )
            )
        );
    }

    /**
     * Get a list of join requests for a given class
     * @param classId The class id
     * @returns Observable of join requests meant for the given class
     */
    public getJoinRequestsForClass(classId: string): Observable<JoinRequestResponse[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        // Get list of request ids
        return this.http.get<JoinRequestsResponse>(
            `${this.API_URL}/classes/${classId}/requests`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            // Map the request ids to the requests
            switchMap(requestIds => 
                forkJoin(
                    requestIds.requests.map(requestId =>
                        this.http.get<JoinRequestResponse>(
                            `${this.API_URL}/requests/${requestId}`,
                            headers
                        )
                    )
                )
            )
        );
    }

    /**
     * Accepts a request
     * @param requestId The id of the request to accept
     * @returns Observable of whether the acceptance was successful
     */
    public acceptRequest(requestId: string): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.patch(
            `${this.API_URL}/requests/${requestId}`,
            null, {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            map(response => {
                return response.status === 204; // 204 No Content
            })
        );
    }

    /**
     * Rejects a request
     * @param requestId The id of the request to reject
     * @returns Observable of whether the rejection was successful
     */
    public rejectRequest(requestId: string): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.delete(
            `${this.API_URL}/requests/${requestId}`, {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            map(response => {
                return response.status === 204; // 204 No Content
            })
        );
    }

    /**
     * Create a new join request for a class from a user
     * @param request The new join request
     * @returns Observable of whether the request was created successfully
     */
    public createRequest(request: NewJoinRequest): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.post(
            `${this.API_URL}/requests`,
            request, {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            map(response => {
                return response.status === 201; // 201 Created
            })
        );
    }

}
