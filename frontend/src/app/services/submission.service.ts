import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { NewSubmission, Submission } from '../interfaces/submissions/newSubmission';
import { GetSubmissionsResponse, NewSubmissionResponse } from '../interfaces/submissions/newSubmissionResponse';
import { switchMap, of, forkJoin, map } from 'rxjs';

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

    handleContents(content: Buffer | string): string {
        // Als het al een string is, gewoon teruggeven
        if (typeof content === 'string') {
            return content;
        }

        // Als het een object is met 'type' en 'data', behandelen als Buffer
        if (
            content &&
            typeof content === 'object' &&
            (content as any).type === 'Buffer' &&
            Array.isArray((content as any).data)
        ) {
            const buffer = new Uint8Array((content as any).data);
            return new TextDecoder().decode(buffer);
        }

        // Als niets van bovenstaande klopt, geef een lege string of gooi een fout
        console.warn('Onbekend content-formaat:', content);
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
            map((subm) => ({ ...subm, contents: this.handleContents(subm.contents) }))
        )
    }

    getSubmissionForUserInCertainStepOfAssignmentIKnowThisIsAVeryLongName(userId: string, assignmentId: string, taskId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<GetSubmissionsResponse>(
            `${this.API_URL}/users/${userId}/submissions?asssignmentId=${assignmentId}&taskId=${taskId}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`submission`)
            ),
            switchMap(response => this.getOneSubmission(response.submissions[0])
            )
        )
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
}