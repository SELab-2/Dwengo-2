import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { NewSubmission } from "../interfaces/submissions/newSubmission";
import { Progress } from "../interfaces/progress/Progress";

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
}