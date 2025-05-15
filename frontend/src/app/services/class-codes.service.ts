import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";
import { forkJoin, Observable, of, switchMap } from "rxjs";
import { Code } from "../interfaces/codes/code";
import { CodesResponse } from "../interfaces/codes/codesResponse";


@Injectable({
    providedIn: 'root'
})
export class ClassCodeService {

    private API_URL = environment.API_URL;
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService
    ) {}

    public createClassCode(classId: string): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        console.log(classId);

        return this.http.post(
            `${this.API_URL}/codes`,
            { "classId": classId },
            {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => of(response.status === 201))
        );
    }

    public expireClassCode(code: Code): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.patch(
            `${this.API_URL}/codes/${code.code}`,
            { expired: true }, 
            {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => of(response.status === 204))
        );
    }

    public deleteClassCode(code: Code): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.delete(
            `${this.API_URL}/codes/${code.code}`,
            {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => of(response.status === 204))
        );
    }

    public getClassCode(code: string): Observable<Code> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        // TODO: possible clash with date conversion
        return this.http.get<Code>(
            `${this.API_URL}/codes/${code}`,
            headers
        ).pipe(
            this.errorService.pipeHandler()
        );
    }

    public getClassCodes(classId: string): Observable<Code[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<CodesResponse>(
            `${this.API_URL}/classes/${classId}/codes`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response => 
                forkJoin(
                    response.codes.map(code => 
                        this.getClassCode(code)
                    )
                )
            )
        );
    }

}
