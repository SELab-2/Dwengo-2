import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { SpecificLearningPathRequest } from '../interfaces/learning-path';
import { HtmlType, LearningObject, LearningObjectRequest } from '../interfaces/learning-object';
import { LearningPathService } from './learningPath.service';

@Injectable({
    providedIn: 'root'
})
export class LearningObjectService {

    private API_URL = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService,
        private learningPathService: LearningPathService,
        private errorService: ErrorService,
    ) { }

    /**
     * Retrieve the learning object that matches the request object (query). Every present query parameter will be added to the request.
     * @returns An observable of the matching learning object.
     */
    retrieveOneLearningObject(query: LearningObjectRequest): Observable<LearningObject> {
        const headers = this.authenticationService.retrieveAuthenticationHeaders();

        let params = new HttpParams();
        params = params.set('type', query.htmlType);
        if (query.language) params = params.set('language', query.language);
        if (query.version) params = params.set('version', query.version);

        return this.http.get<LearningObject>(
            `${this.API_URL}/learningObject/${query.hruid}`,
            { ...headers, params }
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`:@@learningObjectServiceLearningPathError:learning paths`)
            ),
        );
    }


    // Retrieve every learning object in the list
    retrieveMultipleLearningObjects(nodes: LearningObjectRequest[]): Observable<LearningObject[]> {

        return forkJoin(nodes.map(node => this.retrieveOneLearningObject(node)));
    }


    /**
     * Give the basic information for a learning path (hruid, language) and receive the full learning objects
     * @param request the basic information to retrieve a learning path (hruid, language)
     * @returns every object within that learning path
     */
    retrieveObjectsForLearningPath(request: SpecificLearningPathRequest): Observable<LearningObject[]> {
        request.includeNodes = true;
        // We need the request to include nodes
        return this.learningPathService.retrieveOneLearningPath(request).pipe(
            switchMap(response =>
                this.retrieveMultipleLearningObjects(
                    response.nodes!.map(node => ({
                        hruid: node.hruid,
                        htmlType: HtmlType.WRAPPED,
                        language: node.language,
                        version: node.version
                    }))
                )
            )
        );
    }

}
