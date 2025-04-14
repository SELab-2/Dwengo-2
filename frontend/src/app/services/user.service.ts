import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { User } from "../interfaces";
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
    ) {}

    public userWithId(id: string): Observable<User> {
        const userId = this.authService.retrieveUserId();
        const headers = this.authService.retrieveAuthenticationHeaders();
        
        return this.http.get<User>(
            `${this.API_URL}/users/${id}`, {
                ...headers,
                params: {
                    'id': userId || '',
                    'userType': this.authService.retrieveUserType()?.toString() || ''
                }
            }
        ).pipe(
            this.errorService.pipeHandler()
        );
    }

}
