import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LearningPathRequest } from '../interfaces/learning-path';
import { LearningPathResponse } from '../interfaces/learning-path/learningPathResponse';

@Injectable({
    providedIn: 'root'
})
export class LearningPathService {

    private API_URL = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
        private errorService: ErrorService,
    ) { }

    /**
     * Retrieve all learning paths that based on the request object (query). Every present query parameter will be added to the request.
     * @returns An observable of the matching learning paths.
     */
    retrieveLearningPathsByQuery(query: LearningPathRequest): Observable<LearningPathResponse> {
        const headers = this.authenticationService.retrieveAuthenticationHeaders();

        return this.http.get<LearningPathResponse>(
            `${this.API_URL}/learningPath?${query.all ? `all=${query.all}` : ''}${query.title ? `&title=${query.title}` : ''}${query.hruid ? `&hruid=${query.hruid}` : ''}${query.language ? `&language=${query.language}` : ''}${query.description ? `&description=${query.description}` : ''}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`learning paths`)
            ),
        );
    }
}
