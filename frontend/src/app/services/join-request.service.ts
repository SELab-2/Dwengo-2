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
    private userCreds;
    private standardHeaders;

    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
    ) {
        this.userCreds = {
            userId: this.authService.retrieveUserId(),
            userToken: this.authService.retrieveToken()
        };

        this.standardHeaders = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.userCreds.userToken}`
            }
        };
    }

    // public getJoinRequestsFromUser(id: string): Observable<JoinRequest[]> {
    //     return this.http.get<UserJoinRequestsResponse>(
    //         `${this.API_URL}/users/${id}/requests`,
    //         this.standardHeaders
    //     ).pipe(
    //         this.errorService.pipeHandler(),
    //         tap(response => console.log(response)), // TODO
    //         switchMap(response => 
    //             forkJoin(
    //                 response.requests.map(requestId => 
    //                     this.http.get<JoinRequest>( // TODO: will probably conflict with UserType enum
    //                         `${this.API_URL}/requests/${requestId}`,
    //                         this.standardHeaders
    //                     ).pipe(
    //                         this.errorService.pipeHandler()
    //                     )
    //                 )
    //             )
    //         )
    //     );

    //     // return of([])
    // }

    // public getJoinRequestsFromUserForClass(userId: string, classId: string): Observable<JoinRequest[]> {
    //     const userJoinRequests$ = this.getJoinRequestsFromUser(userId);

    //     return userJoinRequests$.pipe(
    //         this.errorService.pipeHandler(),
    //         map(requests => {
    //             console.log(requests); // TODO
    //             return requests.filter(request =>
    //                 request.class === classId
    //             )
    //         }
    //         )
    //     );
    //     // return of([
    //     //     {
    //     //         id: "1",
    //     //         requester: "b1fe24f1-4a55-400b-9ff0-95ee18e605ac",
    //     //         class: classId,
    //     //         userType: UserType.STUDENT
    //     //     }
    //     // ]);
    // }

    public fillUsers(requests: JoinRequestResponse[]): Observable<JoinRequestWithUser[]> {
        return forkJoin(
            requests.map(request =>
                this.http.get<User>(
                    `${this.API_URL}/users/${request.requester}`, {
                        ...this.standardHeaders,
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
        return this.http.get<Users>(
            `${this.API_URL}/users`,
            this.standardHeaders // TODO use headers fix from PR
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => {
                const userIds: string[] = response.students;
                console.log(`got users: ${userIds}`);

                return forkJoin(
                    userIds.map(userId => 
                        this.http.get<UserJoinRequestsResponse>(
                            `${this.API_URL}/users/${userId}/requests`,
                            this.standardHeaders // TODO use headers fix from PR
                        ).pipe(
                            this.errorService.pipeHandler(),
                            switchMap(response => {
                                console.log(`got requests: ${response.requests}`);

                                const requests: string[] = response.requests;

                                return forkJoin(
                                    requests.map(requestId => 
                                        this.http.get<JoinRequestResponse>(
                                            `${this.API_URL}/requests/${requestId}`,
                                            this.standardHeaders // TODO use headers fix from PR
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
        return this.http.patch(
            `${this.API_URL}/requests/${requestId}`,
            null,{
                ...this.standardHeaders,
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
        return this.http.delete(
            `${this.API_URL}/requests/${requestId}`, {
                ...this.standardHeaders,
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
        return this.http.post(
            `${this.API_URL}/requests`,
            request, {
                ...this.standardHeaders,
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
