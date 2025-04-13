import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { environment } from "../../environments/environment";
import { filter, forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { UserJoinRequestsResponse } from "../interfaces/join-requests/userJoinRequestsResponse";
import { User, UserType } from "../interfaces";
import { JoinRequestWithUser } from "../interfaces/join-requests/joinRequestWithUser";
import { JoinRequestResponse } from "../interfaces/join-requests/joinRequestResponse";
import { NewJoinRequest } from "../interfaces/join-requests/newJoinRequest";
import { Users } from "../interfaces/user/users";

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

    public fillUsers(requests: JoinRequestResponse[]): Observable<JoinRequestWithUser[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return forkJoin(
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
                    map(user => {return {
                        id: request.id,
                        requester: user,
                        classId: request.classId,
                        userType: request.type
                    }})
                )
            )
        );

        // return of([])
    }

    public getJoinRequestsForClass(classId: string): Observable<JoinRequestResponse[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<Users>(
            `${this.API_URL}/users`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => {
                const userIds: string[] = response.students;
                console.log(`got users: ${userIds}`);

                return forkJoin(
                    userIds.map(userId => 
                        this.http.get<UserJoinRequestsResponse>(
                            `${this.API_URL}/users/${userId}/requests`,
                            headers
                        ).pipe(
                            tap(response => console.log(response)), // TODO
                            this.errorService.pipeHandler(),
                            switchMap(response => {
                                console.log(`got requests: ${response.requests}`);

                                const requests: string[] = response.requests;

                                return forkJoin(
                                    requests.map(requestId => 
                                        this.http.get<JoinRequestResponse>(
                                            `${this.API_URL}/requests/${requestId}`,
                                            headers
                                        ).pipe(
                                            this.errorService.pipeHandler(),
                                            tap(response => console.log(response)), // TODO
                                            filter(request => request.classId === classId),
                                            tap(response => console.log(response)) // TODO
                                        )
                                    )
                                );
                            })
                        )
                    )
                ).pipe(
                    map(nestedResponses => nestedResponses.flat())
                );
            })
        );
    }

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
