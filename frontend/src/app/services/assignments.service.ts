import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";
import { AssignmentsResponse } from "../interfaces/assignments/assignmentsResponse";
import { Assignment } from "../interfaces/assignments/assignment";
import { NewAssignment } from "../interfaces/assignments/newAssignment";
import { NewAssignmentResponse } from "../interfaces/assignments/newAssignmentResponse";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class AssignmentsService {

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

    public assignmentsOfUser(): Observable<Assignment[]> {
        return this.http.get<AssignmentsResponse>(
            `${this.API_URL}/users/${this.userCreds.userId}/assignments`,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response =>
                forkJoin(
                    response.assignments.map(id =>
                        this.http.get<Assignment>(
                            `${this.API_URL}/assignments/${id}`,
                            this.standardHeaders
                        )
                    )
                )
            )
        );
    }

    public createAssignment(newAssignment: NewAssignment): Observable<string> {
        return this.http.post<NewAssignmentResponse>(
            `${this.API_URL}/assignments`,
            newAssignment,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.id)
            )
        );
    }

}
