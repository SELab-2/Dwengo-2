import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, switchMap } from 'rxjs';
import { Class } from "../interfaces/classes/class";
import { NewClass } from "../interfaces/classes/newClass";
import { UpdatedClass } from "../interfaces/classes/updatedClass";
import { NewClassResponse } from "../interfaces/classes/newClassResponse";
import { ClassesReponse } from "../interfaces/classes/classesResponse";
import { environment } from "../../environments/environment";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class ClassesService {

    private API_URL = environment.API_URL;
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService
    ) {}
  
    public classesOfUser(): Observable<Class[]> {
        const userId = this.authService.retrieveUserId();
        const headers = this.authService.retrieveAuthenticationHeaders();
        
        return this.http.get<ClassesReponse>(
            `${this.API_URL}/users/${userId}/classes`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response =>
                forkJoin(
                    response.classes.map(id =>
                        this.http.get<Class>(
                            `${this.API_URL}/classes/${id}`,
                            headers
                        )
                    )
                )
            )
        );
    }

    public classWithId(id: string): Observable<Class> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        
        return this.http.get<Class>(
            `${this.API_URL}/classes/${id}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`class`)
            ),
        );
    }

    public createClass(newClass: NewClass): Observable<string> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        
        return this.http.post<NewClassResponse>(
            `${this.API_URL}/classes`,
            newClass,
            headers,
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.id)
            )
        );
    }

    public deleteClass(id: string): Observable<boolean> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        
        return this.http.delete(
            `${this.API_URL}/classes/${id}`, {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.status === 204) // 204: success & no content
            )
        );
    }

    // TODO: wait for bugfix API
    public updateClass(_class: Class): Observable<boolean> {
        const updatedClass: UpdatedClass = {
            name: _class.name,
            description: _class.description,
            targetAudience: _class.targetAudience
        };

        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.patch(
            `${this.API_URL}/classes/${_class.id}`,
            updatedClass, {
                ...headers,
                observe: 'response'
            }
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => of(response.status === 204)
            ) // TODO: does this still work (can't know before API bugfix)
        );
    }

}
