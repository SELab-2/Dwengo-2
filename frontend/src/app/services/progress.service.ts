import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { ClassActivity } from "../interfaces/progress/activity";
import { Progress } from "../interfaces/progress/progress";
import { Observable } from "rxjs";
import { ClassCompletion } from "../interfaces/progress/completion";

@Injectable({
    providedIn: 'root'
})
export class ProgressService {
    private API_URL = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
    ) {}

    getUserAssignmentProgress(userId: string, assignmentId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        const url: string = `${this.API_URL}/users/${userId}/assignments/${assignmentId}/progress`;
        return this.http.get<Progress>(
            url,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
        )
    }

    getClassActivity(classId: string): Observable<ClassActivity> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        const url: string = `${this.API_URL}/classes/${classId}/activity`;
        return this.http.get<ClassActivity>(
            url,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
        )
    }

    getClassCompletion(classId: string): Observable<ClassCompletion> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        const url: string = `${this.API_URL}/classes/${classId}/completion`;
        return this.http.get<ClassCompletion>(
            url,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
        )
    }
}