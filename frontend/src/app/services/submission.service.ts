import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { NewSubmission } from '../interfaces/submissions/newSubmission';
import { NewSubmissionResponse } from '../interfaces/submissions/newSubmissionResponse';
import { switchMap, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubmissionService {
    private API_URL = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
    ) {}

    createSubmission(submission: NewSubmission) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.post<NewSubmissionResponse>(
            `${this.API_URL}/submissions`,
            submission,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(res => of(res.id))
        )
    }
}