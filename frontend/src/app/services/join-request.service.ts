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
import { JoinRequestList } from "../interfaces/join-requests/joinRequestList";

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
    }

    public getJoinRequestsForClass(classId: string): Observable<JoinRequestResponse[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<JoinRequestList>(
            `${this.API_URL}/classes/${classId}/requests`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
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
