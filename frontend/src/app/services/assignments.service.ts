import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, switchMap } from 'rxjs';
import { Assignment } from "../interfaces/assignments/assignment";
import { AssignmentsReponse } from "../interfaces/assignments/assignmentsResponse";
import { NewAssignment } from "../interfaces/assignments/newAssignment";
import { NewAssignmentResponse } from "../interfaces/assignments/newAssignmentResponse";
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";
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
        private errorService: ErrorService
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
        return this.http.get<AssignmentsReponse>(
            `${this.API_URL}/users/${this.userCreds.userId}/assignments`,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler("An error occured, please try again"),
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

    public assignmentWithId(id: string): Observable<Assignment> {
        return this.http.get<Assignment>(
            `${this.API_URL}/assignments/${id}`,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler("An error occured whilst retrieving the assignment"),
        );
    }

    public createAssignment(newAssignment: NewAssignment): Observable<string> {
        return this.http.post<NewAssignmentResponse>(
            `${this.API_URL}/assignments`,
            newAssignment,
            this.standardHeaders
        ).pipe(
            this.errorService.pipeHandler("An error occured, please try again"),
            switchMap(
                response => of(response.id)
            )
        );
    }

    public deleteAssignment(id: string): Observable<boolean> {
        return this.http.delete(
            `${this.API_URL}/assignments/${id}`, {
                ...this.standardHeaders,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler("An error occured, please try again"),
            switchMap(
                response => of(response.status === 204) // 204: success & no content
            )
        );
    }

  }
 