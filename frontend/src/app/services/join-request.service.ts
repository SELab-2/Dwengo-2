import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { environment } from "../../environments/environment";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { JoinRequest } from "../interfaces/join-requests/joinRequest";
import { UserJoinRequestsResponse } from "../interfaces/join-requests/userJoinRequestsResponse";
import { User, UserType } from "../interfaces";
import { JoinRequestWithUser } from "../interfaces/join-requests/joinRequestWithUser";

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

    public getJoinRequestsFromUser(id: string): Observable<JoinRequest[]> {
        return this.http.get<UserJoinRequestsResponse>(
            `${this.API_URL}/users/${id}/requests`,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => 
                forkJoin(
                    response.requests.map(requestId => 
                        this.http.get<JoinRequest>( // TODO: will probably conflict with UserType enum
                            `${this.API_URL}/requests/${requestId}`,
                            this.standardHeaders
                        ).pipe(
                            this.errorService.pipeHandler()
                        )
                    )
                )
            )
        );
    }

    public getJoinRequestsFromUserForClass(userId: string, classId: string): Observable<JoinRequest[]> {
        // const userJoinRequests$ = this.getJoinRequestsFromUser(userId);

        // return userJoinRequests$.pipe(
        //     this.errorService.pipeHandler(),
        //     map(requests =>
        //         requests.filter(request =>
        //             request.class === classId
        //         )
        //     )
        // );
        return of([
            {
                id: "b1fe24f1-4a55-400b-9ff0-95ee18e605ac",
                requester: "123",
                class: classId,
                userType: UserType.STUDENT
            }
        ]);
    }

    public fillUsers(requests: JoinRequest[]): Observable<JoinRequestWithUser[]> {

        return requests.map(request =>
            this.http.get<User>(
                `${this.API_URL}/users/${request.requester}`,
                this.standardHeaders
            ).pipe(
                this.errorService.pipeHandler(),
                map(user => {return {
                    id: request.id,
                    requester: user,
                    class: request.class,
                    UserType: request.userType
                }})
            )
        );

        return of([]);
    }

}
