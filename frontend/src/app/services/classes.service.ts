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
import { User, UserType } from "../interfaces";
import { UserService } from "./user.service";
import { ClassMembersInterface } from "../interfaces/classes/classMembersResponse";
import { UsersOfClass } from "../interfaces/user/usersOfClass";

@Injectable({
    providedIn: 'root'
})
export class ClassesService {

    private API_URL = environment.API_URL;
    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
        private userService: UserService
    ) { }

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

    public usersInClass(id: string): Observable<UsersOfClass> {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<UsersOfClass>(
            `${this.API_URL}/classes/${id}/users`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`class`)
            )
        )
    }

    public classWithId(id: string): Observable<Class> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<Class>(
            `${this.API_URL}/classes/${id}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(
                this.errorService.retrieveError($localize`:@@class:class`)
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
            )
        );
    }

    public classStudents(id: string): Observable<User[]> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<ClassMembersInterface>(
            `${this.API_URL}/classes/${id}/users`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response =>
                forkJoin<User[]>(
                    response.students.map(studentId => 
                        this.userService.userWithId(studentId)
                    )
                )
            )
        );
    }

}
