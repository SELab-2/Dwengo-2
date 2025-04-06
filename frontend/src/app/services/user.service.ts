import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { User, UserType } from "../interfaces";
import { AuthenticationService } from "./authentication.service";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private API_URL = environment.API_URL;
    private userCreds;
    private standardHeaders;

    public constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService
    ) {
        this.userCreds = {
            userId: this.authService.retrieveUserId(),
            userToken: this.authService.retrieveToken()
        };

        this.standardHeaders = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.userCreds.userToken}`
            }
        };
    }

    public userWithIdAndType(id: string, userType: UserType): Observable<User> {
        return this.http.get<User>(
            `${this.API_URL}/users/${id}`, {
                ...this.standardHeaders,
                params: {
                    'id': this.userCreds.userId || '',
                    'userType': userType.toString()
                }
            }
        ).pipe(
            this.errorService.pipeHandler()
        );
    }

}
