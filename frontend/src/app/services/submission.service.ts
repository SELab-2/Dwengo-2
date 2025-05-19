import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { NewSubmission, Submission } from '../interfaces/submissions/newSubmission';
import { GetSubmissionsResponse, NewSubmissionResponse } from '../interfaces/submissions/newSubmissionResponse';
import { switchMap, of, forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubmissionService {
    private API_URL = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
    ) { }

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

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleContents(content: any): string {
        if (typeof content === 'string') {
            return content;
        }

        if (content && content.type === 'Buffer' && Array.isArray(content.data)) {
            return String.fromCharCode(...content.data);
        }

        console.warn('Unknown content format:', content);
        return '';
    }




    getOneSubmission(submId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<Submission>(
            `${this.API_URL}/submissions/${submId}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`submission`),
            ),
            map((subm) => {
                const parsed = this.handleContents(subm.contents);
                return { ...subm, contents: parsed };
            })
        )
    }

    userSubmissionForStep(userId: string, assignmentId: string, taskId: string): Observable<Submission | null> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<GetSubmissionsResponse>(
            `${this.API_URL}/users/${userId}/submissions?assignmentId=${assignmentId}&taskId=${taskId}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`submission`)
            ),
            switchMap(response => {
                const submission = response.submissions[0];
                if (submission) {
                    return this.getOneSubmission(submission);
                } else {
                    return of(null);
                }
            })
        );
    }

    getSubmissionsForUserInAssignment(userId: string, assignmentId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<GetSubmissionsResponse>(
            `${this.API_URL}/users/${userId}/submissions?assignmentId=${assignmentId}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`submission`)
            ),
            switchMap(response => forkJoin(response.submissions.map(id => this.getOneSubmission(id)))
            )
        )
    }

    patchSubmission(submission: Submission) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.patch<void>(
            `${this.API_URL}/submissions/${submission.id}`,
            { status: submission.status },
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.updateError($localize`submission`)
            )
        );
    }
}