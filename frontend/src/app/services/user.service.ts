import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { forkJoin, map, Observable, switchMap } from "rxjs";
import { User, UsersResponse } from "../interfaces";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private API_URL = environment.API_URL;

    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService
    ) { }

    public userWithId(id: string): Observable<User> {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<User>(
            `${this.API_URL}/users/${id}`, {
            ...headers
        }
        ).pipe(
            this.errorService.pipeHandler()
        );
    }

    /**
     * @param id the assignment id
     * @returns the user ids in the assignment
     */
    public assignmentUserIds(id: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<UsersResponse>(
            `${this.API_URL}/assignments/${id}/users?pageSize=100`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            map(response => response.students)
        );
    }

    /**
     * 
     * @param id assignment id
     * @returns full student objects in assignment
     */
    public assignmentUsers(id: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();

        return this.http.get<UsersResponse>(
            `${this.API_URL}/assignments/${id}/users?pageSize=100`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(
                response => forkJoin(
                    response.students.map(id => this.userWithId(id))
                )
            )
        );
    }
}
